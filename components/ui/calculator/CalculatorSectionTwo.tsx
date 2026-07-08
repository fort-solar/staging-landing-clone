"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, CheckCircle2, Trash2, Zap } from "lucide-react";
import PdfIcon from "@/components/features/icons/PdfIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "../button";
import GetQuoteDialog from "./GetQuoteDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { submitForm } from "@/actions/SubmitForm";
import { BASE_URL } from "@/components/features/constants";
import Link from "next/link";
import {
  addCalculatorRow,
  buildCalculatorQuotePayload,
  buildCalculatorTotals,
  buildSelectedDevices,
  createCalculatorRow,
  deriveCalculatorRecommendation,
  parseCalculatorNumericInput,
  removeCalculatorRow,
  type CalculatorResponseData,
  type CalculatorRow as Row,
  type Totals,
} from "@/lib/calculator";

type CatalogItem = {
  key: string;
  name: string;
  category: string;
  watts: number;
  surgeMultiplier: number;
  inductive: boolean;
  search_aliases: string[];
};

type CatalogSearchResponse = {
  success: boolean;
  data: { matches?: CatalogItem[]; presets?: CatalogItem[] };
};

type SuggestedPackage = {
  id: string;
  name: string;
  slug: string | null;
  system_size_kw: number | null;
  price: number;
  description: string | null;
  what_it_powers: string[];
  battery_included: boolean;
  battery_capacity_kwh?: number | null;
  inverter_size_kw?: number | null;
  number_of_panels: number | null;
  estimated_savings_monthly: number | null;
  is_active?: boolean;
  matchScore: number; // calculated combined difference
};

type PackagesApiResponse = {
  success: boolean;
  data: { packages?: SuggestedPackage[] } | SuggestedPackage[];
};

type CalculatorResponse = {
  success: boolean;
  data: CalculatorResponseData;
};

const buildApiUrl = (endpoint: string, query?: Record<string, string>) => {
  const base = (BASE_URL ?? "").replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const search = query ? new URLSearchParams(query).toString() : "";
  return `${base}${normalizedEndpoint}${search ? `?${search}` : ""}`;
};

const CalculatorSectionTwo = () => {
  const [rows, setRows] = useState<Row[]>([createCalculatorRow()]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const [activeSuggestions, setActiveSuggestions] = useState<CatalogItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [calculation, setCalculation] = useState<CalculatorResponse["data"] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  // Package suggestion state
  const [suggestedPackages, setSuggestedPackages] = useState<SuggestedPackage[]>([]);
  const [isFetchingPackages, setIsFetchingPackages] = useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const updateRow = (id: string, updates: Partial<Row>) => {
    setRows(currentRows =>
      currentRows.map(row => (row.id === id ? { ...row, ...updates } : row))
    );
  };

  const removeRow = (id: string) => {
    setRows((currentRows) => removeCalculatorRow(currentRows, id));
  };

  useEffect(() => {
    const scrollElement = tableScrollRef.current;

    const updateRect = () => {
      if (!activeInputRef.current) return;
      setDropdownRect(activeInputRef.current.getBoundingClientRect());
    };

    updateRect();

    const handleScroll = () => updateRect();
    window.addEventListener("resize", handleScroll);
    window.addEventListener("scroll", handleScroll, true);
    scrollElement?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
      scrollElement?.removeEventListener("scroll", handleScroll);
    };
  }, [activeRowId]);

  const completeRows = useMemo(() => {
    return rows.filter(
      (row) =>
        row.item.trim().length > 0 &&
        typeof row.quantity === "number" &&
        Number.isFinite(row.quantity) &&
        row.quantity >= 1 &&
        typeof row.watts === "number" &&
        Number.isFinite(row.watts) &&
        row.watts > 0 &&
        typeof row.hours === "number" &&
        Number.isFinite(row.hours) &&
        row.hours > 0,
    );
  }, [rows]);

  const selectedDevices = useMemo(() => {
    return buildSelectedDevices(completeRows);
  }, [completeRows]);

  // Live search: uses the correct /calculator/catalog?q= endpoint
  useEffect(() => {
    if (!activeRowId) {
      setActiveSuggestions([]);
      return;
    }

    const activeRow = rows.find(row => row.id === activeRowId);
    const query = activeRow?.item.trim() ?? "";

    if (query.length < 2) {
      setActiveSuggestions([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        // Fixed: was calling /appliances, now correctly calls /calculator/catalog
        const response = await fetch(
          buildApiUrl("calculator/catalog", { q: query }),
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setActiveSuggestions([]);
          return;
        }

        const data = (await response.json()) as CatalogSearchResponse;
        if (data.success) {
          setActiveSuggestions(data.data.matches ?? data.data.presets ?? []);
        } else {
          setActiveSuggestions([]);
        }
      } catch {
        if (!controller.signal.aborted) {
          setActiveSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [activeRowId, rows]);

  useEffect(() => {
    if (!completeRows.length) {
      setCalculation(null);
      setIsCalculating(false);
      setSuggestedPackages([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsCalculating(true);
        const response = await fetch(buildApiUrl("calculator/calculate"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appliances: completeRows.map(row => ({
              name: row.item,
              quantity: Number(row.quantity),
              wattage: Number(row.watts),
              hoursPerDay: Number(row.hours),
            })),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          setCalculation(null);
          return;
        }

        const data = (await response.json()) as CalculatorResponse;
        setCalculation(data.success ? data.data : null);
      } catch {
        if (!controller.signal.aborted) {
          setCalculation(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsCalculating(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [completeRows]);

  // Fetch package suggestions whenever calculation updates
  useEffect(() => {
    if (!calculation) {
      setSuggestedPackages([]);
      return;
    }

    const calculatedKw = calculation.recommendedPvKwp ?? calculation.totalLoadKw ?? 0;
    if (calculatedKw <= 0) {
      setSuggestedPackages([]);
      return;
    }

    const controller = new AbortController();
    const fetchPackages = async () => {
      try {
        setIsFetchingPackages(true);
        const response = await fetch(buildApiUrl("products/packages"), {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;

        const json = (await response.json()) as PackagesApiResponse;
        const raw: SuggestedPackage[] = Array.isArray(json.data)
          ? json.data
          : (json.data as { packages?: SuggestedPackage[] }).packages ?? [];

        // Filter to packages within ±10% of calculated PV size, Inverter size, and Battery size
        const TOLERANCE = 0.10;
        
        // We calculate combined difference for sorting, but strictly filter each component.
        // If the calculator says we don't need a battery (0), we shouldn't strictly require 0 if the package has one?
        // Wait, the prompt says "if there is a package that matches all 3 by either a +/- 10% margin room".
        // Let's implement strict +/- 10% bounds for all 3 components.
        const reqPv = calculatedKw;
        const reqInv = Number(inverterKw);
        const reqBat = Number(batteryKwh);
        
        const matched = raw
          .filter(pkg => pkg.system_size_kw != null && pkg.is_active !== false)
          .map(pkg => {
            const pkgPv = pkg.system_size_kw!;
            const pkgInv = pkg.inverter_size_kw ?? 0;
            const pkgBat = pkg.battery_capacity_kwh ?? 0;
            
            // Calculate absolute % difference. For 0 bounds, avoid division by zero.
            const diffPv = Math.abs((pkgPv - reqPv) / reqPv);
            const diffInv = reqInv > 0 ? Math.abs((pkgInv - reqInv) / reqInv) : (pkgInv > 0 ? 1 : 0);
            const diffBat = reqBat > 0 ? Math.abs((pkgBat - reqBat) / reqBat) : (pkgBat > 0 ? 1 : 0);
            
            return {
              ...pkg,
              diffPv,
              diffInv,
              diffBat,
              matchScore: diffPv + diffInv + diffBat,
            };
          })
          .filter(pkg => pkg.diffPv <= TOLERANCE && pkg.diffInv <= TOLERANCE && pkg.diffBat <= TOLERANCE)
          .sort((a, b) => a.matchScore - b.matchScore)
          .slice(0, 3);

        setSuggestedPackages(matched);
      } catch {
        if (!controller.signal.aborted) setSuggestedPackages([]);
      } finally {
        if (!controller.signal.aborted) setIsFetchingPackages(false);
      }
    };

    fetchPackages();
    return () => controller.abort();
  }, [calculation]);

  const totals: Totals = buildCalculatorTotals(calculation);
  const recommendation = deriveCalculatorRecommendation(calculation, totals);
  const { inverterKw, batteryKwh, pvKwp } = recommendation;
  const hasCalculated = recommendation.hasCalculated && !isCalculating;

  const downloadPdf = () => {
    if (!hasCalculated) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Custom System Recommendation", 14, 20);

    doc.setFontSize(11);
    doc.text(
      "Here’s a quick breakdown of your total energy usage based on your inputs. This shows your daily demand and the solar setup that fits perfectly.",
      14,
      30,
      {
        maxWidth: 180,
      }
    );

    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: [
        ["Total Load", `${totals.peakKW.toFixed(2)} kW`],
        ["Calculated Daily Energy Use", `${totals.dailyKWh.toFixed(2)} kWh`],
        ["Estimated Inverter Size", `${Number(inverterKw).toFixed(2)} kW`],
        ["Estimated Battery Capacity", `${Number(batteryKwh).toFixed(2)} kWh`],
        ["Estimated PV Size", `${Number(pvKwp).toFixed(2)} kWp`],
      ],
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [44, 178, 44],
        textColor: 255,
      },
    });

    doc.save("energy-summary.pdf");
  };

  const submitQuote = async (payload: {
    name: string;
    email: string;
    phone: string;
    location: string;
    address?: string;
    installationType: string;
    buildingType?: string;
    termsAccepted: boolean;
    createAccount: boolean;
    note?: string;
    summary?: {
      peakKW: number;
      dailyKWh: number;
      items: Array<{
        item: string;
        quantity: number;
        watts: number;
        hours: number;
        wattHours: number;
      }>;
    };
  }) => {
    const quotePayload = buildCalculatorQuotePayload({
      selectedDevices,
      totals,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      location: payload.location,
      address: payload.address,
      installationType: payload.installationType,
      buildingType: payload.buildingType,
      termsAccepted: payload.termsAccepted,
      note: payload.note,
    });

    try {
      setQuoteSubmitting(true);
      await toast.promise(
        submitForm({
          endpoint: "quotes",
          method: "POST",
          values: quotePayload,
        }),
        {
          loading: "Submitting quote request...",
          position: "top-center",
          success: "Quote submitted successfully.",
          error: err => (err instanceof Error ? err.message : "Unable to submit quote right now"),
        }
      );

      if (payload.createAccount) {
        setTimeout(() => {
          const params = new URLSearchParams();
          params.append('email', payload.email);
          params.append('name', payload.name);
          window.location.href = `http://localhost:3323/signup?${params.toString()}`;
        }, 3000);
      }
    } finally {
      if (!payload.createAccount) {
        setQuoteSubmitting(false);
      }
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 my-10">
      <Toaster />

      <div ref={tableScrollRef} className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-[10px] md:text-sm table">
          <thead className="table-header-group">
            <tr className="text-[#101828] font-medium md:font-semibold border-b">
              <th className="p-2 md:p-3 border-r text-start">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-pointer">Item</span>
                  </TooltipTrigger>
                  <TooltipContent>Device or appliance</TooltipContent>
                </Tooltip>
              </th>
              <th className="p-2 md:p-3 border-r text-start ">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-pointer">
                      <p className="hidden md:block">Quantity</p>
                      <p className="block md:hidden">Qty</p>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Number of items</TooltipContent>
                </Tooltip>
              </th>
              <th className="p-2 md:p-3 border-r text-start">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-pointer">
                      <p className="hidden md:block">
                        Watts <span className="font-normal">(Per Item)</span>
                      </p>
                      <p className="block md:hidden">Watts</p>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Power per item</TooltipContent>
                </Tooltip>
              </th>
              <th className="p-2 md:p-3 border-r text-start">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-pointer">
                      <p className="hidden md:block">
                        Hours <span className="font-normal">(Per Day)</span>
                      </p>
                      <p className="block md:hidden">Hrs</p>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Hours used per day</TooltipContent>
                </Tooltip>
              </th>
              <th className="p-2 md:p-3 border-r text-start whitespace-nowrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-pointer whitespace-nowrap">
                      <p className="hidden md:block whitespace-nowrap">
                        Energy Consumed
                      </p>
                      <p className="block md:hidden whitespace-nowrap">Energy(Wh)</p>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Total Watt Hours</TooltipContent>
                </Tooltip>
              </th>
              <th className="p-2 md:p-3 text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center cursor-pointer w-full">
                      <p className="hidden md:block">Actions</p>
                      <p className="flex items-center justify-center md:hidden">...</p>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Remove row</TooltipContent>
                </Tooltip>
              </th>
            </tr>
          </thead>

          <tbody className="table-row-group">
            {rows.map(row => {
              const wattHours =
                typeof row.quantity === "number" &&
                row.quantity >= 1 &&
                typeof row.watts === "number" &&
                row.watts >= 1 &&
                typeof row.hours === "number" &&
                row.hours >= 1
                ? Number(row.quantity) * Number(row.watts) * Number(row.hours)
                : "";

              return (
                <tr
                  key={row.id}
                  className=" border-b bg-white p-3 last:border-b-0 table-row md:border-t md:p-0"
                >
                  <td
                    className="table-cell border-b-0 border-r md:p-2 w-fit whitespace-nowrap min-w-22"
                  >
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="w-full text-[10px] md:text-sm rounded-md border-none p-2 outline-0 focus:ring-0 whitespace-nowrap"
                        placeholder="Search or type item"
                        value={row.item}
                        onFocus={e => {
                          activeInputRef.current = e.currentTarget;
                          setDropdownRect(e.currentTarget.getBoundingClientRect());
                          setActiveRowId(row.id);
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                        onBlur={() =>
                          setActiveRowId(prev => {
                            if (prev === row.id) {
                              activeInputRef.current = null;
                              setDropdownRect(null);
                              return null;
                            }
                            return prev;
                          })
                        }
                        onChange={e => {
                          const value = e.target.value;
                          if (activeRowId !== row.id) {
                            activeInputRef.current = e.currentTarget;
                            setDropdownRect(e.currentTarget.getBoundingClientRect());
                            setActiveRowId(row.id);
                          }
                          updateRow(row.id, { item: value });
                        }}
                      />
                    </div>
                  </td>

                  <td
                    className="table-cell border-b-0 border-r md:p-2"
                  >
                    <div className="flex w-full items-center justify-center gap-3 px-2 lg:px-4 py-2">
                      <input
                        type="number"
                        min={1}
                        inputMode="decimal"
                        className="w-full rounded-md border-none p-2 outline-0 focus:ring-0 md:w-20"
                        value={row.quantity}
                        onChange={e =>
                          updateRow(row.id, {
                            quantity: parseCalculatorNumericInput(e.target.value),
                          })
                        }
                        onBlur={() => {
                          if (row.quantity === "") return;
                          updateRow(row.id, { quantity: Math.max(1, Number(row.quantity)) });
                        }}
                      />
                    </div>

                  </td>

                  <td
                    className="table-cell border-b-0 border-r md:p-2"
                  >
                    <div className="flex w-full items-center justify-between gap-3 px-2 lg:px-4 py-2">
                      <input
                        type="number"
                        min={1}
                        inputMode="decimal"
                        className="w-full rounded-md border-none p-2 outline-0 focus:ring-0 md:w-24"
                        value={row.watts}
                        onChange={e =>
                          updateRow(row.id, {
                            watts: parseCalculatorNumericInput(e.target.value),
                          })
                        }
                        onBlur={() => {
                          if (row.watts === "") return;
                          updateRow(row.id, { watts: Math.max(1, Number(row.watts)) });
                        }}
                      />
                      <p className="font-medium text-[7px] md:text-sm bg-[#B8C0CC33] p-1 md:p-2 text-[#3B3B3BB2] rounded-sm hidden md:block">W</p>
                    </div>

                  </td>

                  <td
                    className="table-cell border-b-0 border-r md:p-2"
                  >
                    <div className="flex w-full items-center justify-center lg:justify-between gap-3 px-2 lg:px-4 py-2">
                      <input
                        type="number"
                        min={1}
                        max={24}
                        inputMode="decimal"
                        className="w-full rounded-md border-none p-2 outline-0 focus:ring-0 md:w-24"
                        value={row.hours}
                        onChange={e =>
                          updateRow(row.id, {
                            hours: parseCalculatorNumericInput(e.target.value),
                          })
                        }
                        onBlur={() => {
                          if (row.hours === "") return;
                          updateRow(row.id, { hours: Math.min(24, Math.max(1, Number(row.hours))) });
                        }}
                      />
                      <p className="font-medium text-[7px] md:text-sm bg-[#B8C0CC33] p-1 md:p-2 text-[#3B3B3BB2] rounded-sm hidden md:block">Hrs</p>
                    </div>

                  </td>

                  <td
                    className="table-cell border-b-0 border-r md:p-2"
                  >
                    <div className="flex w-full items-center justify-center lg:justify-between gap-3 px-2 lg:px-4 py-2">
                      <p>{wattHours}</p>
                      <p className="font-medium text-[7px] md:text-sm bg-[#B8C0CC33] p-1 md:p-2 text-[#3B3B3BB2] rounded-sm">Wh</p>
                    </div>

                  </td>

                  <td
                    className="table-cell border-b-0 border-r md:p-2 bg-[#FF00001A]"
                  >
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-red-500 flex items-center justify-center w-full "
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {activeRowId && dropdownRect && typeof window !== "undefined" && (() => {
        const dropdownMaxHeight = 192;
        const spaceBelow = window.innerHeight - dropdownRect.bottom;
        const openUp = spaceBelow < dropdownMaxHeight && dropdownRect.top > dropdownMaxHeight;
        const top = openUp ? dropdownRect.top - dropdownMaxHeight - 4 : dropdownRect.bottom + 4;
        const left = Math.max(8, dropdownRect.left);
        const width = Math.min(dropdownRect.width, window.innerWidth - left - 8);

        if (!activeSuggestions.length) return null;

        return createPortal(
          <div
            className="fixed z-50 max-h-48 overflow-auto rounded-md border border-gray-200 bg-white shadow-md"
            style={{ top, left, width }}
          >
            {activeSuggestions.map(device => (
              <button
                key={device.key}
                type="button"
                className="w-full text-left text-[10px] md:text-sm px-3 py-2 hover:bg-gray-50"
                onMouseDown={event => {
                  event.preventDefault();
                  if (!activeRowId) return;
                  updateRow(activeRowId, {
                    item: device.name,
                    watts: Math.max(1, Number(device.watts) || 1),
                    hours: 1,
                    quantity: 1,
                  });
                  setActiveRowId(null);
                  setActiveSuggestions([]);
                }}
              >
                <span className="font-medium">{device.name}</span>
                <span className="text-[#667085]">
                  {` — ${device.watts}W`}
                  {device.category ? ` · ${device.category}` : ""}
                </span>
              </button>
            ))}
          </div>,
          document.body
        );
      })()}
      <div className="flex justify-end">
        <Button
          onClick={() => setRows((currentRows) => addCalculatorRow(currentRows))}
          className="w-full md:w-fit text-[10px] md:text-sm cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] px-8 py-5 rounded-b-lg rounded-t-none hover:opacity-90"
        >
          Add Item
        </Button>
      </div>
      <div ref={summaryRef} className="bg-white my-20 max-w-2xl">
        <p className="text-lg font-semibold mb-4 text-[#101828]">
          Your Custom System Recommendation
        </p>
        <p className="pb-10">
          Here&apos;s a quick breakdown of your total energy usage based on your inputs. This shows your daily demand and the solar setup that fits perfectly.
        </p>

        {isSearching && (
          <p className="text-xs text-[#667085] pb-3">Searching appliances...</p>
        )}

        {isCalculating && (
          <p className="text-xs text-[#667085] pb-3">Calculating your recommendation...</p>
        )}

        <table className="w-full max-w-xl border rounded-lg text-sm">
          <tbody>
            <tr className="border-b"><td className="p-3">Total Load</td><td>{totals.peakKW.toFixed(2)} kW</td></tr>
            <tr className="border-b"><td className="p-3">Calculated Daily Energy Use</td><td>{totals.dailyKWh.toFixed(2)} kWh</td></tr>
            <tr className="border-b"><td className="p-3">Estimated Inverter Size</td><td>{Number(inverterKw).toFixed(2)} kW</td></tr>
            <tr className="border-b"><td className="p-3">Estimated Battery Capacity</td><td>{Number(batteryKwh).toFixed(2)} kWh</td></tr>
            <tr><td className="p-3">Estimated PV Size</td><td>{Number(pvKwp).toFixed(2)} kWp</td></tr>
          </tbody>
        </table>

        {/* ── Package Suggestions ──────────────────────────────── */}
        {hasCalculated && (
          <div className="mt-10">
            {isFetchingPackages && (
              <p className="text-xs text-[#667085] mb-3">Checking for matching packages...</p>
            )}

            {!isFetchingPackages && suggestedPackages.length > 0 && hasCalculated && (
              <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <GetQuoteDialog
                    totals={totals}
                    selectedDevices={selectedDevices}
                    disabled={!completeRows.length || !hasCalculated}
                    isSubmitting={quoteSubmitting}
                    onSubmit={submitQuote}
                  />
                  <Button disabled={!hasCalculated} variant="outline" onClick={downloadPdf} className="cursor-pointer w-full sm:w-fit py-6 rounded-xl font-semibold border-gray-300">
                    <PdfIcon /> Download Summary & Save
                  </Button>
                </div>

                <div className="mb-8">
                  <h2 className="text-[28px] md:text-[36px] font-bold text-[#101828] leading-tight mb-3">
                    Your Perfect Solar Package
                  </h2>
                  <p className="text-[#475467] text-base md:text-lg max-w-3xl">
                    We&apos;ve matched your energy needs with the best-fit solar Package complete with panels, inverter, batteries, and free installation. You can adjust or upgrade anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestedPackages.map((pkg, i) => {
                    const isBestMatch = i === 0;
                    
                    return (
                      <div
                        key={pkg.id}
                        className={`relative rounded-[24px] p-6 transition-all duration-300 hover:shadow-lg flex flex-col ${
                          isBestMatch 
                            ? "bg-white border-2 border-[#12B76A] shadow-md shadow-[#12B76A]/10" 
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        {isBestMatch && (
                          <div className="absolute -top-3 left-6 bg-[#12B76A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Best Match
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between gap-3 mb-2 pt-2">
                          <h3 className="text-xl font-bold text-[#101828] leading-tight">
                            {pkg.name}
                          </h3>
                          <Link
                            href={`/store/packages/${pkg.slug ?? pkg.id}`}
                            className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
                              isBestMatch ? "bg-[#12B76A] text-white hover:bg-[#039855]" : "bg-[#F2F4F7] text-[#101828] hover:bg-gray-200"
                            }`}
                          >
                            <ArrowRight className="w-5 h-5 -rotate-45" />
                          </Link>
                        </div>
                        
                        <p className="text-sm text-[#475467] min-h-[40px] mb-4">
                          {pkg.description || "Affordable and efficient solutions tailored to your needs."}
                        </p>

                        <div className="mb-6">
                          <p className="text-2xl font-extrabold text-[#101828]">
                            ₦{pkg.price.toLocaleString()}
                          </p>
                          {pkg.estimated_savings_monthly && (
                            <p className="text-xs font-medium text-[#027A48] mt-1">
                              Saves ~₦{pkg.estimated_savings_monthly.toLocaleString()}/mo
                            </p>
                          )}
                        </div>

                        <div className={`rounded-xl p-4 mb-6 ${isBestMatch ? "bg-[#F6FEF9] border border-[#D1FADF]" : "bg-[#F9FAFB] border border-[#EAECF0]"}`}>
                          <div className={`flex items-center gap-2 font-semibold text-sm mb-3 ${isBestMatch ? "text-[#027A48]" : "text-[#344054]"}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            Package Components
                          </div>
                          
                          <div className="space-y-2">
                            {pkg.inverter_size_kw ? (
                              <div className={`flex items-center justify-between text-xs font-medium ${isBestMatch ? "text-[#027A48]" : "text-[#475467]"}`}>
                                <span>{pkg.inverter_size_kw}kW Inverter</span>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                            ) : null}
                            
                            {pkg.battery_capacity_kwh ? (
                              <div className={`flex items-center justify-between text-xs font-medium ${isBestMatch ? "text-[#027A48]" : "text-[#475467]"}`}>
                                <span>{pkg.battery_capacity_kwh}kWh Battery</span>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                            ) : null}

                            {pkg.system_size_kw ? (
                              <div className={`flex items-center justify-between text-xs font-medium ${isBestMatch ? "text-[#027A48]" : "text-[#475467]"}`}>
                                <span>{pkg.system_size_kw}kWp Solar Panels</span>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {pkg.what_it_powers && pkg.what_it_powers.length > 0 && (
                          <div className="mb-6 flex-1">
                            <div className="flex items-center gap-2 font-semibold text-[#101828] text-sm mb-3">
                              <Zap className="w-4 h-4 text-[#FDB022] fill-[#FDB022]" />
                              Fortified To Power
                            </div>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs text-[#475467] font-medium">
                              {(pkg.what_it_powers as string[]).slice(0, 8).map((item: string) => (
                                <span key={item}>{item}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-auto pt-2">
                          {/* We use standard image fallback if thumbnail is missing */}
                          <div className="w-full h-[180px] bg-gray-100 rounded-xl overflow-hidden relative">
                            {/* In real usage we'd use next/image with pkg.thumbnail_url or pkg.package_image_url */}
                            <img 
                              src={(pkg as any).thumbnail_url || (pkg as any).package_image_url || "https://images.unsplash.com/photo-1509391366360-1e564d720c02?auto=format&fit=crop&q=80&w=600&h=400"} 
                              alt={pkg.name} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!isFetchingPackages && suggestedPackages.length === 0 && hasCalculated && (
              <div className="border border-dashed border-gray-200 rounded-xl p-5 text-center">
                <p className="text-sm font-medium text-[#101828] mb-1">No exact package match found</p>
                <p className="text-[#333333] text-xs text-center">
                  We don&apos;t have a pre-built package that matches your exact needs right now — but we can build one for you.
                  Request a custom quote and our team will get back to you within 24 hours.
                </p>
              </div>
            )}
          </div>
        )}
        {/* ── End Package Suggestions ─────────────────────────── */}

        <div className="mt-8">
          <p className="italic text-[#667085] text-sm">Note: <span>These are estimates based on your usage pattern. For custom optimization, you can request a detailed quote. </span> </p>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSectionTwo;
