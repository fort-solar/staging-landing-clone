"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
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

type NumericField = number | "";

type Row = {
  id: string;
  item: string;
  quantity: NumericField;
  watts: NumericField;
  hours: NumericField;
};

type Appliance = {
  id: string;
  name: string;
  category: string;
  power_rating_watts: number;
  daily_hours_usage: number;
};

type AppliancesResponse = {
  success: boolean;
  data: Appliance[];
};

type CalculatorResponse = {
  success: boolean;
  data: {
    totalLoadW: number;
    totalLoadKw: number;
    totalEnergyWhPerDay: number;
    totalEnergyKwhPerDay: number;
    avgEnergyKwhPerHour: number;
    recommendedInverterKw: number;
    recommendedBatteryKwh: number;
    recommendedPvKwp: number;
    display?: {
      inverterKw: number;
      batteryKwh: number;
      pvKwp: number;
    };
  };
};

type Totals = {
  totalWh: number;
  dailyKWh: number;
  peakKW: number;
};

const CALCULATOR_CONSTANTS = {
  pshHours: 3.5,
  inverterSurgeFactor: 1.5,
  backupHours: 14,
  batterySafetyFactor: 1.3,
  pvLossFactor: 1.2,
};

const generateRowId = () => {
  if (typeof globalThis !== "undefined" && "crypto" in globalThis) {
    const cryptoObj = globalThis.crypto as Crypto | undefined;
    if (cryptoObj?.randomUUID) {
      return cryptoObj.randomUUID();
    }
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createRow = (): Row => ({
  id: generateRowId(),
  item: "",
  quantity: "",
  watts: "",
  hours: "",
});

const isPositive = (value: NumericField) => typeof value === "number" && Number.isFinite(value) && value >= 1;

const parseNumericInput = (value: string): NumericField => {
  if (value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed;
};

const buildApiUrl = (endpoint: string, query?: Record<string, string>) => {
  const base = (BASE_URL ?? "").replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const search = query ? new URLSearchParams(query).toString() : "";
  return `${base}${normalizedEndpoint}${search ? `?${search}` : ""}`;
};

const CalculatorSectionTwo = () => {
  const [rows, setRows] = useState<Row[]>([createRow()]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const [activeSuggestions, setActiveSuggestions] = useState<Appliance[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [calculation, setCalculation] = useState<CalculatorResponse["data"] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const updateRow = (id: string, updates: Partial<Row>) => {
    setRows(currentRows =>
      currentRows.map(row => (row.id === id ? { ...row, ...updates } : row))
    );
  };

  const removeRow = (id: string) => {
    setRows(currentRows => {
      if (currentRows.length === 1) {
        return [createRow()];
      }
      return currentRows.filter(row => row.id !== id);
    });
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
    return rows.filter(row => row.item.trim().length > 0 && isPositive(row.quantity) && isPositive(row.watts) && isPositive(row.hours));
  }, [rows]);

  const selectedDevices = useMemo(() => {
    return completeRows.map(row => ({
      item: row.item,
      quantity: Number(row.quantity),
      watts: Number(row.watts),
      hours: Number(row.hours),
      wattHours: Number(row.quantity) * Number(row.watts) * Number(row.hours),
    }));
  }, [completeRows]);

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
        const response = await fetch(
          buildApiUrl("appliances", {
            q: query,
            limit: "8",
          }),
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

        const data = (await response.json()) as AppliancesResponse;
        setActiveSuggestions(data.success ? data.data : []);
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
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsCalculating(true);
        const response = await fetch(buildApiUrl("calculator/calculate"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appliances: completeRows.map(row => ({
              name: row.item,
              quantity: Number(row.quantity),
              wattage: Number(row.watts),
              hoursPerDay: Number(row.hours),
            })),
            constants: CALCULATOR_CONSTANTS,
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

  const totals: Totals = {
    totalWh: calculation?.totalEnergyWhPerDay ?? 0,
    dailyKWh: calculation?.totalEnergyKwhPerDay ?? 0,
    peakKW: calculation?.totalLoadKw ?? 0,
  };

  const inverterKw =
    calculation?.display?.inverterKw ?? calculation?.recommendedInverterKw ?? Math.ceil(totals.peakKW * 1.25);
  const batteryKwh =
    calculation?.display?.batteryKwh ?? calculation?.recommendedBatteryKwh ?? Math.ceil(totals.dailyKWh);
  const pvKwp = calculation?.display?.pvKwp ?? calculation?.recommendedPvKwp ?? totals.dailyKWh / 4;

  const hasCalculated = Boolean(calculation) && !isCalculating;

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
    address: string;
    installationType: string;
    buildingType: string;
    termsAccepted: boolean;
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
    const quantity = selectedDevices.reduce((sum, appliance) => sum + appliance.quantity, 0);

    const quotePayload = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      location: payload.location,
      address: payload.address,
      appliances: selectedDevices.map(appliance => ({
        name: appliance.item,
        wattage: appliance.watts,
        quantity: appliance.quantity,
        hoursPerDay: appliance.hours,
      })),
      totalLoadKw: Number(totals.peakKW.toFixed(2)),
      totalWattHoursPerDay: Number(totals.totalWh.toFixed(2)),
      dailyUsageKwh: Number(totals.dailyKWh.toFixed(2)),
      monthlyUsageKwh: Number((totals.dailyKWh * 30).toFixed(2)),
      monthlyBill: 0,
      quantity,
      projectType: payload.installationType,
      buildingType: payload.buildingType,
      additionalInfo: payload.note ?? "",
      agreeToTerms: payload.termsAccepted,
      requestInstallation: true,
    };

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
    } finally {
      setQuoteSubmitting(false);
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
              const wattHours = isPositive(row.quantity) && isPositive(row.watts) && isPositive(row.hours)
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
                            quantity: parseNumericInput(e.target.value),
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
                            watts: parseNumericInput(e.target.value),
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
                            hours: parseNumericInput(e.target.value),
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
                key={device.id}
                type="button"
                className="w-full text-left text-[10px] md:text-sm px-3 py-2 hover:bg-gray-50"
                onMouseDown={event => {
                  event.preventDefault();
                  if (!activeRowId) return;
                  updateRow(activeRowId, {
                    item: device.name,
                    watts: Math.max(1, Number(device.power_rating_watts) || 1),
                    hours: Math.min(24, Math.max(1, Number(device.daily_hours_usage) || 1)),
                    quantity: 1,
                  });
                  setActiveRowId(null);
                  setActiveSuggestions([]);
                }}
              >
                <span className="font-medium">{device.name}</span>
                <span className="text-[#667085]">
                  {` - ${device.power_rating_watts}W - ${Number(device.daily_hours_usage).toFixed(1)}hrs`}
                </span>
              </button>
            ))}
          </div>,
          document.body
        );
      })()}
      <div className="flex justify-end">
        <Button
          onClick={() => setRows(currentRows => [...currentRows, createRow()])}
          className="w-full md:w-fit text-[10px] md:text-sm cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] px-8 py-5 rounded-b-lg rounded-t-none hover:opacity-90"
        >
          Add Item
        </Button>
      </div>

      <div ref={summaryRef} className="bg-white my-20 max-w-2xl">
        <p className="text-lg font-semibold mb-4 text-[#101828]">
          Your Custom System Recommendation
        </p>
        <p className="pb-10">
          Here’s a quick breakdown of your total energy usage based on your inputs. This shows your daily demand and the solar setup that fits perfectly.
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
          <p className="italic">Note: <span>These are estimates based on your usage pattern. For custom optimization, you can request a detailed quote. </span> </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full my-8">
          <GetQuoteDialog
            totals={totals}
            selectedDevices={selectedDevices}
            disabled={!completeRows.length || !hasCalculated}
            isSubmitting={quoteSubmitting}
            onSubmit={submitQuote}
          />
          <Button disabled={!hasCalculated} variant="outline" onClick={downloadPdf} className="cursor-pointer w-full lg:w-fit py-6">
            <PdfIcon /> Download Summary & Save
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSectionTwo;
