"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, CheckCircle2, Trash2, Zap, Tent } from "lucide-react";
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
import { storePackageHref, storeSignupHref } from "@/lib/store-links";
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
  target_audience?: string | null;
  what_it_powers: string[];
  battery_included: boolean;
  battery_capacity_kwh?: number | null;
  inverter_size_kw?: number | null;
  number_of_panels: number | null;
  estimated_savings_monthly: number | null;
  is_active?: boolean;
  thumbnail_url?: string | null;
  package_image_url?: string | null;
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
  const rawBase = BASE_URL || "/api/v1";
  const base = rawBase.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\/?(api\/v1\/?)?/, "");
  const search = query ? new URLSearchParams(query).toString() : "";
  return `${base}/${cleanEndpoint}${search ? `?${search}` : ""}`;
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
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

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
              nightBackup: row.nightBackup,
              inductive: row.inductive,
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

        // Match packages that safely cover the user's calculated needs.
        // A package must meet or exceed the requirement (10% under tolerance allowed)
        // but must not be excessively oversized (max 2× the requirement).
        const reqPv = calculatedKw;
        const reqInv = Number(inverterKw);
        const reqBat = Number(batteryKwh);
        
        const matched = raw
          .filter(pkg => pkg.system_size_kw != null && pkg.is_active !== false)
          .map(pkg => {
            const pkgPv = pkg.system_size_kw!;
            const pkgInv = pkg.inverter_size_kw ?? 0;
            const pkgBat = pkg.battery_capacity_kwh ?? 0;
            
            // Package must meet or exceed the requirement (allow 10% under)
            const pvOk = reqPv > 0 ? pkgPv >= reqPv * 0.9 : true;
            const invOk = reqInv > 0 ? pkgInv >= reqInv * 0.9 : true;
            const batOk = reqBat > 0 ? pkgBat >= reqBat * 0.9 : true;
            
            // But not excessively oversized (max 2× the requirement)
            const pvCap = reqPv > 0 ? pkgPv <= reqPv * 2 : true;
            const invCap = reqInv > 0 ? pkgInv <= reqInv * 2 : true;
            const batCap = reqBat > 0 ? pkgBat <= reqBat * 2 : true;
            
            const fits = pvOk && invOk && batOk && pvCap && invCap && batCap;
            
            // Score = how much overshoot (lower is better, tighter fit)
            const diffPv = reqPv > 0 ? Math.abs(pkgPv - reqPv) / reqPv : 0;
            const diffInv = reqInv > 0 ? Math.abs(pkgInv - reqInv) / reqInv : 0;
            const diffBat = reqBat > 0 ? Math.abs(pkgBat - reqBat) / reqBat : 0;
            
            return {
              ...pkg,
              diffPv,
              diffInv,
              diffBat,
              matchScore: diffPv + diffInv + diffBat,
              fits,
            };
          })
          .filter(pkg => pkg.fits)
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
    const pageWidth = doc.internal.pageSize.getWidth();

    // Fortsolar Green Header bar
    doc.setFillColor(44, 178, 44);
    doc.rect(0, 0, pageWidth, 22, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("FORTSOLAR ENERGY AUDIT & ESTIMATE", 14, 15);

    // Subtitle & Date
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const dateStr = new Date().toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Generated on: ${dateStr}  |  fortsolar.ng`, 14, 30);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(
      "Here is your personalized solar load breakdown and system sizing recommendation based on your appliance inputs.",
      14,
      36,
      { maxWidth: 180 }
    );

    // Table 1: System Sizing Estimates
    autoTable(doc, {
      startY: 42,
      head: [["System Metric", "Estimated Requirement"]],
      body: [
        ["Total Peak Load", `${totals.peakKW.toFixed(2)} kW`],
        ["Calculated Daily Energy Use", `${totals.dailyKWh.toFixed(2)} kWh / day`],
        ["Estimated Inverter Size", `${Number(inverterKw).toFixed(2)} kW`],
        ["Estimated Battery Capacity", `${Number(batteryKwh).toFixed(2)} kWh`],
        ["Estimated Solar PV Array", `${Number(pvKwp).toFixed(2)} kWp`],
      ],
      theme: "grid",
      styles: { fontSize: 9.5, cellPadding: 3.5 },
      headStyles: { fillColor: [44, 178, 44], textColor: 255, fontStyle: "bold" },
    });

    let currentY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ? (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
      : 95;

    // Table 2: Appliance Load Breakdown
    if (completeRows.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Appliance Load Breakdown", 14, currentY);

      const applianceBody: (string | number)[][] = completeRows.map((r, i) => {
        const wh = Number(r.quantity) * Number(r.watts) * Number(r.hours);
        return [
          String(i + 1),
          r.item,
          String(r.quantity),
          `${r.watts} W`,
          `${r.hours} hrs`,
          `${wh.toLocaleString()} Wh`,
          r.nightBackup ? "Yes" : "No",
        ];
      });

      const totalWh = completeRows.reduce(
        (sum, r) => sum + Number(r.quantity) * Number(r.watts) * Number(r.hours),
        0
      );
      applianceBody.push([
        "",
        "Total Daily Consumption",
        "",
        "",
        "",
        `${totalWh.toLocaleString()} Wh (${(totalWh / 1000).toFixed(2)} kWh)`,
        "",
      ]);

      autoTable(doc, {
        startY: currentY + 3,
        head: [["#", "Appliance", "Qty", "Power", "Hours/Day", "Daily Energy", "Night Backup"]],
        body: applianceBody,
        theme: "striped",
        styles: { fontSize: 8.5, cellPadding: 2.5 },
        headStyles: { fillColor: [24, 114, 24], textColor: 255, fontStyle: "bold" },
      });

      currentY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ? (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
        : currentY + 50;
    }

    // Table 3: Recommended Fortsolar Packages (if any)
    if (suggestedPackages.length > 0) {
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Matching Fortsolar Pre-Configured Packages", 14, currentY);

      const packageBody = suggestedPackages.map((pkg) => [
        pkg.name,
        `${pkg.system_size_kw ?? "-"} kWp`,
        `${pkg.inverter_size_kw ?? "-"} kW`,
        `${pkg.battery_capacity_kwh ?? "-"} kWh`,
        `NGN ${pkg.price.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: currentY + 3,
        head: [["Package", "Solar PV", "Inverter", "Battery", "Price (NGN)"]],
        body: packageBody,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [44, 178, 44], textColor: 255, fontStyle: "bold" },
      });

      currentY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ? (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
        : currentY + 35;
    }

    // Footer guidance note
    if (currentY > 255) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Note: Sizing values are estimates based on your stated consumption patterns. Actual system requirements may vary based on site survey, roof orientation, and peak surges. Visit store.fortsolar.ng or contact enquiry@fortsolar.ng to schedule a comprehensive physical energy audit.",
      14,
      currentY,
      { maxWidth: 180 }
    );

    doc.save("fortsolar-energy-audit-summary.pdf");
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
          window.location.assign(
            storeSignupHref({
              email: payload.email,
              name: payload.name,
              phone: payload.phone,
            }),
          );
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

      <div className="space-y-4 md:hidden">
        {rows.map((row, index) => {
          const wattHours =
            typeof row.quantity === "number" && typeof row.watts === "number" && typeof row.hours === "number"
              ? row.quantity * row.watts * row.hours
              : 0;

          return (
            <article key={row.id} className={`rounded-2xl border p-4 shadow-sm ${row.nightBackup ? "border-[#2CB22C]/40 bg-[#F6FFF6]" : "border-gray-200 bg-white"}`}>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#101828]">Appliance {index + 1}</p>
                <button type="button" onClick={() => removeRow(row.id)} aria-label={`Remove appliance ${index + 1}`} className="rounded-lg bg-red-50 p-2 text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wide text-[#667085]">
                Appliance
                <input
                  type="text"
                  value={row.item}
                  placeholder="Search or type an appliance"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-base font-normal normal-case tracking-normal text-[#101828] outline-none focus:border-[#2CB22C]"
                  onFocus={(event) => {
                    activeInputRef.current = event.currentTarget;
                    setDropdownRect(event.currentTarget.getBoundingClientRect());
                    setActiveRowId(row.id);
                  }}
                  onBlur={() => setTimeout(() => setActiveRowId((current) => current === row.id ? null : current), 100)}
                  onChange={(event) => {
                    activeInputRef.current = event.currentTarget;
                    setDropdownRect(event.currentTarget.getBoundingClientRect());
                    setActiveRowId(row.id);
                    updateRow(row.id, { item: event.target.value });
                  }}
                />
              </label>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {([
                  ["Qty", "quantity", 1, undefined],
                  ["Watts", "watts", 1, undefined],
                  ["Hrs/day", "hours", 1, 24],
                ] as const).map(([label, field, min, max]) => (
                  <label key={field} className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                    {label}
                    <input
                      type="number"
                      min={min}
                      max={max}
                      inputMode="decimal"
                      value={row[field]}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-2 py-3 text-center text-base font-normal normal-case tracking-normal text-[#101828] outline-none focus:border-[#2CB22C]"
                      onChange={(event) => updateRow(row.id, { [field]: parseCalculatorNumericInput(event.target.value) })}
                    />
                  </label>
                ))}
              </div>

              <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl bg-[#F2F4F7] px-3 py-3 text-sm font-medium text-[#344054]">
                <span>🌙 Include in night backup</span>
                <input type="checkbox" disabled={!row.item} checked={row.nightBackup} onChange={(event) => updateRow(row.id, { nightBackup: event.target.checked })} className="h-5 w-5 accent-[#2CB22C]" />
              </label>

              <p className="mt-3 text-right text-xs text-[#667085]">Daily energy: <strong className="text-[#101828]">{wattHours.toLocaleString()} Wh</strong></p>
            </article>
          );
        })}
      </div>

      <div ref={tableScrollRef} className="hidden border border-gray-200 overflow-x-auto md:block">
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
              <th className="p-2 md:p-3 border-r text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-pointer whitespace-nowrap">
                      🌙 Night Backup?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Runs when solar is off</TooltipContent>
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
                  className={`border-b p-3 last:border-b-0 table-row md:border-t md:p-0 ${row.inductive ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-transparent'} ${row.nightBackup ? 'bg-[#2CB22C]/5' : 'bg-white'}`}
                >
                  <td
                    className="table-cell border-b-0 border-r md:p-2 w-fit whitespace-nowrap min-w-22"
                  >
                    <div className="relative w-full flex items-center">
                      {row.nightBackup && (
                        <div className="w-2 h-2 rounded-full bg-[#2CB22C] shrink-0 mr-2 ml-1" />
                      )}
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
                    className="table-cell border-b-0 border-r md:p-2"
                  >
                    <div className="flex w-full items-center justify-center h-full">
                      <input
                        type="checkbox"
                        disabled={!row.item}
                        checked={row.nightBackup}
                        onChange={(e) => updateRow(row.id, { nightBackup: e.target.checked })}
                        className="w-4 h-4 text-[#2CB22C] focus:ring-[#2CB22C] rounded border-gray-300 cursor-pointer"
                      />
                    </div>
                  </td>

                  <td
                    className="table-cell border-b-0 md:p-2 bg-[#FF00001A]"
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
                    inductive: device.inductive || false,
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

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-50 border border-t-0 border-gray-200 p-3 text-xs text-gray-600 rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3.5 bg-amber-500 rounded-[1px]"></div>
          <span>Inductive load — startup surge factored into inverter sizing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#2CB22C] rounded-full"></div>
          <span>🌙 Night backup load — factored into battery sizing</span>
        </div>
        <p className="w-full text-[11px] italic text-gray-400 mt-1">Energy consumed per item is included in your downloadable PDF summary.</p>
      </div>
      <div ref={summaryRef} className="bg-white mt-8 mb-12 max-w-2xl">
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

        <div className="mt-8">
          <p className="italic text-[#667085] text-sm mb-6">Note: <span>These are estimates based on your usage pattern. For custom optimization, you can request a detailed quote. </span> </p>
        </div>
      </div>

      {/* ── Package Suggestions ──────────────────────────────── */}
      {hasCalculated && (
        <div className="mt-12 w-full">
          {isFetchingPackages && (
            <p className="text-xs text-[#667085] mb-3">Checking for matching packages...</p>
          )}

          {!isFetchingPackages && suggestedPackages.length > 0 && hasCalculated && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-[#2CB22C] fill-[#2CB22C]" />
                  <h2 className="text-[24px] md:text-[32px] font-bold text-[#101828] leading-tight">
                    We have packages that match your energy needs!
                  </h2>
                </div>
                <p className="text-[#475467] text-base md:text-lg max-w-3xl">
                  We’ve found the best package(s) based on your energy needs. Select your preferred choice to continue. All packages include free delivery and installation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedPackages.map((pkg, i) => {
                  const isBestMatch = i === 0;
                  
                  return (
                    <div
                      key={pkg.id}
                      onMouseEnter={() => setHoveredCardId(pkg.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      className={`relative rounded-[24px] p-5 transition-all duration-300 hover:shadow-lg flex flex-col min-h-[420px] ${
                        isBestMatch 
                          ? "bg-white border-2 border-[#2CB22C] shadow-md shadow-[#2CB22C]/10" 
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {isBestMatch && (
                        <div className="absolute -top-3 left-6 bg-[#2CB22C] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-30">
                          Best Match
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between gap-3 mb-2 pt-1 z-20 relative">
                        <h3 className="text-[18px] font-bold text-[#101828] leading-tight">
                          {pkg.name}
                        </h3>
                        <Link
                          href={storePackageHref(pkg.slug ?? pkg.id)}
                          className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-xl transition-colors ${
                            isBestMatch ? "bg-[#2CB22C] text-white hover:bg-[#048A05]" : "bg-[#F2F4F7] text-[#101828] hover:bg-gray-200"
                          }`}
                        >
                          <ArrowRight className="w-4 h-4 -rotate-45" />
                        </Link>
                      </div>
                      
                      <p className="text-xs text-[#475467] line-clamp-2 min-h-[32px] mb-4 z-20 relative">
                        {pkg.description || "Affordable and efficient solar solution tailored to power your home and appliances seamlessly."}
                      </p>

                      <div className="relative flex-1 grid mt-2">
                        {/* Default State Container */}
                        <div className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-300 z-10 bg-white ${hoveredCardId === pkg.id ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                          <div className="mb-4">
                            <p className="text-xl font-extrabold text-[#101828]">
                              ₦{pkg.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-auto w-full h-[200px] bg-gray-100 rounded-xl overflow-hidden relative">
                          <img 
                            src={(pkg.thumbnail_url && pkg.thumbnail_url !== "null") ? pkg.thumbnail_url : ((pkg.package_image_url && pkg.package_image_url !== "null") ? pkg.package_image_url : "/double_solar_panels.png")}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/double_solar_panels.png";
                            }}
                            alt={pkg.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                            {(!pkg.target_audience || pkg.target_audience === 'residential') && (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CB22C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            )}
                            {pkg.target_audience === 'commercial' && (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CB22C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                            )}
                            {pkg.target_audience === 'industrial' && (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CB22C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M17 18h1"></path><path d="M12 18h1"></path><path d="M7 18h1"></path></svg>
                            )}
                            {pkg.target_audience === 'campus' && (
                              <Tent className="w-4 h-4 text-[#2CB22C]" strokeWidth={2} />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover State Container */}
                      <div className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-300 z-20 bg-white h-full ${hoveredCardId === pkg.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <div className={`rounded-xl p-3 mb-4 ${isBestMatch ? "bg-[#F0FFF0] border border-[#2CB22C]/20" : "bg-[#F9FAFB] border border-[#EAECF0]"}`}>
                          <div className={`flex items-center gap-1.5 font-semibold text-xs mb-2 ${isBestMatch ? "text-[#048A05]" : "text-[#344054]"}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            Package Components
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className={`flex items-center justify-between text-[11px] font-medium ${isBestMatch ? "text-[#048A05]" : "text-[#475467]"}`}>
                              <span>{pkg.inverter_size_kw || 3.5}kW Inverter</span>
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                            
                            <div className={`flex items-center justify-between text-[11px] font-medium ${isBestMatch ? "text-[#048A05]" : "text-[#475467]"}`}>
                              <span>{pkg.battery_capacity_kwh || 5.12}kWh Battery</span>
                              <CheckCircle2 className="w-3 h-3" />
                            </div>

                            <div className={`flex items-center justify-between text-[11px] font-medium ${isBestMatch ? "text-[#048A05]" : "text-[#475467]"}`}>
                              <span>{pkg.system_size_kw || 2.4}kWp Solar Panels</span>
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 font-semibold text-[#101828] text-xs mb-2">
                            <Zap className="w-3.5 h-3.5 text-[#FDB022] fill-[#FDB022]" />
                            Fortified To Power
                          </div>
                          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] text-[#475467] font-medium">
                            {((pkg.what_it_powers && pkg.what_it_powers.length > 0) ? pkg.what_it_powers : ["1x AC (1HP)", "1x Fridge", "1x TV", "4x Fans", "10x Lighting", "2x Laptops"]).slice(0, 8).map((item: string) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 mt-auto">
                          <Link
                            href={storePackageHref(pkg.slug ?? pkg.id)}
                            className="w-full py-2 px-3 text-xs font-semibold text-center text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] hover:opacity-90 rounded-xl flex items-center justify-center gap-1.5 transition-opacity"
                          >
                            View & Order Package →
                          </Link>
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
            <div className="border border-dashed border-gray-200 rounded-xl p-5 text-center mt-8">
              <p className="text-sm font-medium text-[#101828] mb-1">No exact package match found</p>
              <p className="text-[#333333] text-xs text-center">
                We don&apos;t have a pre-built package that matches your exact needs right now — but we can build one for you.
                Request a custom quote and our team will get back to you within 24 hours.
              </p>
            </div>
          )}
        </div>
      )}

      {hasCalculated && (
        <div className="mt-12 rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8">
          <h4 className="text-lg font-bold text-[#101828]">What happens after requesting a quote?</h4>
          <p className="text-sm text-[#475467] mt-1 mb-6">
            We follow a structured engineering process to ensure you get the absolute best setup for your home or business.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ECFDF3] text-sm font-semibold text-[#027A48]">1</div>
              <h5 className="font-semibold text-sm text-[#101828]">Submit Energy Audit</h5>
              <p className="text-xs text-[#475467]">Submit your appliance load breakdown so our engineers have accurate requirements.</p>
            </div>
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0F9FF] text-sm font-semibold text-[#026AA2]">2</div>
              <h5 className="font-semibold text-sm text-[#101828]">Engineer Review</h5>
              <p className="text-xs text-[#475467]">Our engineers review the sizing, calculate exact equipment specs, and upload a priced proposal.</p>
            </div>
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDF2FA] text-sm font-semibold text-[#C11574]">3</div>
              <h5 className="font-semibold text-sm text-[#101828]">Approve & Pay Deposit</h5>
              <p className="text-xs text-[#475467]">Review the custom design spec in your customer portal, approve it, and make a Paystack payment.</p>
            </div>
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF4EB] text-sm font-semibold text-[#B93815]">4</div>
              <h5 className="font-semibold text-sm text-[#101828]">Professional Install</h5>
              <p className="text-xs text-[#475467]">A verified local installer sets up the system, sharing real-time photo proofs for your sign-off.</p>
            </div>
          </div>
        </div>
      )}

      {hasCalculated && (
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <GetQuoteDialog
            totals={totals}
            selectedDevices={selectedDevices}
            disabled={!completeRows.length || !hasCalculated}
            isSubmitting={quoteSubmitting}
            onSubmit={submitQuote}
          />
          <Button disabled={!hasCalculated} variant="outline" onClick={downloadPdf} className="cursor-pointer w-full sm:w-fit py-6 rounded-xl font-semibold border-gray-300">
            <PdfIcon /> Download Summary
          </Button>
        </div>
      )}
    </section>
  );
};

export default CalculatorSectionTwo;
