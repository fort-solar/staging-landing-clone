"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronDown,
  Cpu,
  HelpCircle,
  Info,
  Moon,
  Sun,
  Tent,
  Trash2,
  AlertTriangle,
  Zap,
} from "lucide-react";
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
  calculateEngineeringSystem,
  createCalculatorRow,
  deriveCalculatorRecommendation,
  parseCalculatorNumericInput,
  removeCalculatorRow,
  resolveRowNightHours,
  validateCalculatorRow,
  type CalculatorResponseData,
  type CalculatorRow as Row,
  type SimultaneousMode,
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
  matchScore: number;
};

type PackagesApiResponse = {
  success: boolean;
  data: { packages?: SuggestedPackage[] } | SuggestedPackage[];
};

type CalculatorResponse = {
  success: boolean;
  data: CalculatorResponseData;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    id: "night-hours",
    question: "Why do I enter both Daily Hours and Night Hours?",
    answer:
      'Daily Hours is the total time an appliance runs in a 24-hour day (daytime + nighttime). When you tick "Night Backup", you enter how many of those hours happen at night (typically 6 PM – 6 AM). Your battery is sized strictly from your Night Energy, while your solar panels are sized to cover both your daytime usage and recharging your battery.',
  },
  {
    id: "inverter-size",
    question: "How is the inverter size (kVA & kW) calculated?",
    answer:
      'We sum the running watts of all appliances that run at the same time (plus the single largest appliance marked "Used Separately"). We then check the startup surge of your largest motor/compressor (such as a borehole pump or AC), apply a 25% continuous safety margin, and convert to kVA using a standard 0.8 power factor so your inverter never trips.',
  },
  {
    id: "battery-size",
    question: "How is the lithium battery bank sized?",
    answer:
      "Your Nighttime Energy (kWh) is divided by real-world Nigerian system efficiencies: 80% usable Depth of Discharge (DoD) for LiFePO4 longevity, 95% battery discharge efficiency, and 92% inverter efficiency (~70% net usable factor). We then match the result to practical 5kWh lithium battery modules and verify that the bank can safely handle your continuous discharge power.",
  },
  {
    id: "solar-pv-size",
    question: "How many solar panels do I need under Nigerian weather conditions?",
    answer:
      "We use a conservative Nigerian baseline of 3.5 effective Peak Sun Hours (PSH), a 78% overall Performance Ratio (accounting for roof heat, harmattan dust, MPPT, and cable losses), and a 1.3× cloudy-weather safety factor so your battery still recharges reliably during rainy season.",
  },
  {
    id: "non-inverter-fridge-ac",
    question: "Why does a non-inverter AC, freezer, or borehole pump increase the inverter size?",
    answer:
      "Standard induction motors and non-inverter compressors draw 3× to 4× their running watts for a split second when starting. Inverter ACs and inverter refrigerators soft-start smoothly (only ~1.3× to 1.5×), allowing a smaller, more affordable hybrid inverter.",
  },
  {
    id: "simultaneous-vs-staggered",
    question: 'What is the difference between "Runs Together" and "Used Separately"?',
    answer:
      '"Runs Together (Simultaneous)" means the appliance stays on alongside your normal household loads (like fridges, fans, lights, TVs). "Used Separately (Staggered)" is for heavy short-use appliances you turn on one at a time (like a pressing iron, kettle, or borehole pump) so we do not oversize your inverter unnecessarily.',
  },
];

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
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ_ITEMS);
  const [openFaqId, setOpenFaqId] = useState<string | null>("night-hours");

  const [suggestedPackages, setSuggestedPackages] = useState<SuggestedPackage[]>([]);
  const [isFetchingPackages, setIsFetchingPackages] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const summaryRef = useRef<HTMLDivElement>(null);
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const updateRow = (id: string, updates: Partial<Row>) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...updates };
        // If daily hours decreased below nightHours, clamp nightHours automatically
        if (
          updates.hours !== undefined &&
          typeof next.hours === "number" &&
          typeof next.nightHours === "number" &&
          next.nightHours > next.hours
        ) {
          next.nightHours = next.hours;
        }
        // When toggling nightBackup ON for the first time, prefill sensible nightHours
        if (updates.nightBackup === true && next.nightHours === "") {
          const dailyH = typeof next.hours === "number" && next.hours > 0 ? next.hours : 8;
          next.nightHours = Math.min(dailyH, 8);
        }
        if (updates.nightBackup === false) {
          next.nightHours = "";
        }
        return next;
      }),
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
        row.hours > 0 &&
        row.hours <= 24 &&
        (!row.nightBackup ||
          row.nightHours === "" ||
          (typeof row.nightHours === "number" &&
            row.nightHours >= 0 &&
            row.nightHours <= row.hours)),
    );
  }, [rows]);

  const selectedDevices = useMemo(() => {
    return buildSelectedDevices(completeRows);
  }, [completeRows]);

  const [catalogPresets, setCatalogPresets] = useState<CatalogItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadCatalogAndFaq() {
      try {
        const [catRes, faqRes] = await Promise.allSettled([
          fetch(buildApiUrl("calculator/catalog"), {
            method: "GET",
            headers: { Accept: "application/json" },
          }),
          fetch(buildApiUrl("calculator/faq"), {
            method: "GET",
            headers: { Accept: "application/json" },
          }),
        ]);
        if (catRes.status === "fulfilled" && catRes.value.ok) {
          const data = (await catRes.value.json()) as CatalogSearchResponse;
          if (data.success && !cancelled) {
            setCatalogPresets(data.data.presets ?? data.data.matches ?? []);
          }
        }
        if (faqRes.status === "fulfilled" && faqRes.value.ok) {
          const fData = (await faqRes.value.json()) as {
            success: boolean;
            data?: { items?: FaqItem[] };
          };
          if (fData.success && fData.data?.items?.length && !cancelled) {
            setFaqItems(fData.data.items);
          }
        }
      } catch {
        // Fallback to local defaults
      }
    }
    loadCatalogAndFaq();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeRowId) {
      setActiveSuggestions([]);
      setIsSearching(false);
      return;
    }

    const activeRow = rows.find((row) => row.id === activeRowId);
    const rawQuery = activeRow?.item.trim().toLowerCase() ?? "";

    if (rawQuery.length < 2) {
      setActiveSuggestions([]);
      setIsSearching(false);
      return;
    }

    if (catalogPresets.length > 0) {
      const q = rawQuery;
      const matches = catalogPresets.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const keyMatch = item.key.toLowerCase().includes(q);
        const catMatch = item.category?.toLowerCase().includes(q);
        const aliasMatch =
          Array.isArray(item.search_aliases) &&
          item.search_aliases.some((a) => a.toLowerCase().includes(q));
        return nameMatch || keyMatch || catMatch || aliasMatch;
      });

      matches.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aStarts = aName.startsWith(q);
        const bStarts = bName.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aName.localeCompare(bName);
      });

      setActiveSuggestions(matches.slice(0, 10));
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(buildApiUrl("calculator/catalog", { q: rawQuery }), {
          method: "GET",
          signal: controller.signal,
        });
        if (!response.ok) {
          setActiveSuggestions([]);
          return;
        }
        const data = (await response.json()) as CatalogSearchResponse;
        if (data.success && !controller.signal.aborted) {
          setActiveSuggestions(data.data.matches ?? data.data.presets ?? []);
        } else {
          setActiveSuggestions([]);
        }
      } catch {
        if (!controller.signal.aborted) setActiveSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 150);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [activeRowId, rows, catalogPresets]);

  // Instant local calculation + backend sync
  useEffect(() => {
    if (!completeRows.length) {
      setCalculation(null);
      setIsCalculating(false);
      setSuggestedPackages([]);
      return;
    }

    // Immediate deterministic client-side engineering calculation so UI never lags or fails offline
    const localCalc = calculateEngineeringSystem(completeRows);
    setCalculation(localCalc);

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsCalculating(true);
        const response = await fetch(buildApiUrl("calculator/calculate"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appliances: completeRows.map((row) => ({
              name: row.item,
              quantity: Number(row.quantity),
              wattage: Number(row.watts),
              hoursPerDay: Number(row.hours),
              nightBackup: row.nightBackup,
              nightHours: resolveRowNightHours(row),
              simultaneousMode: row.simultaneousMode || "simultaneous",
              inductive: row.inductive,
              surgeMultiplier: row.surgeMultiplier,
            })),
          }),
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as CalculatorResponse;
        if (data.success && data.data && !controller.signal.aborted) {
          setCalculation(data.data);
        }
      } catch {
        // Keep localCalc fallback
      } finally {
        if (!controller.signal.aborted) {
          setIsCalculating(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [completeRows]);

  const totals: Totals = buildCalculatorTotals(calculation);
  const recommendation = deriveCalculatorRecommendation(calculation, totals);
  const { inverterKw, inverterKva, batteryKwh, pvKwp } = recommendation;
  const hasCalculated = recommendation.hasCalculated;

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

        const reqPv = Number(pvKwp);
        const reqInv = Number(inverterKw);
        const reqBat = Number(batteryKwh);

        const matched = raw
          .filter((pkg) => pkg.system_size_kw != null && pkg.is_active !== false)
          .map((pkg) => {
            const pkgPv = pkg.system_size_kw!;
            const pkgInv = pkg.inverter_size_kw ?? pkgPv;
            const pkgBat = pkg.battery_capacity_kwh ?? 0;

            const pvOk = reqPv > 0 ? pkgPv >= reqPv * 0.85 : true;
            const invOk = reqInv > 0 ? pkgInv >= reqInv * 0.85 : true;
            const batOk = reqBat > 0 ? pkgBat >= reqBat * 0.85 : true;

            const pvCap = reqPv > 0 ? pkgPv <= Math.max(reqPv * 2.2, reqPv + 3) : true;
            const invCap = reqInv > 0 ? pkgInv <= Math.max(reqInv * 2.2, reqInv + 3) : true;
            const batCap = reqBat > 0 ? pkgBat <= Math.max(reqBat * 2.2, reqBat + 5) : true;

            const fits = pvOk && invOk && batOk && pvCap && invCap && batCap;

            const diffPv = reqPv > 0 ? Math.abs(pkgPv - reqPv) / reqPv : 0;
            const diffInv = reqInv > 0 ? Math.abs(pkgInv - reqInv) / reqInv : 0;
            const diffBat = reqBat > 0 ? Math.abs(pkgBat - reqBat) / reqBat : 0;

            return {
              ...pkg,
              matchScore: diffPv + diffInv + diffBat,
              fits,
            };
          })
          .filter((pkg) => pkg.fits)
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
  }, [calculation, pvKwp, inverterKw, batteryKwh]);

  const downloadPdf = () => {
    if (!hasCalculated) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(44, 178, 44);
    doc.rect(0, 0, pageWidth, 22, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("FORTSOLAR ENGINEERING ENERGY AUDIT & ESTIMATE", 14, 15);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const dateStr = new Date().toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Generated on: ${dateStr}  |  fortsolar.ng`, 14, 30);

    const batConfig =
      calculation?.batterySizing?.configurationLabel ??
      `${Number(batteryKwh).toFixed(1)} kWh LiFePO4`;
    const panelCount =
      calculation?.pvSizing?.recommendedPanelCount ??
      calculation?.display?.panelCount ??
      Math.ceil((Number(pvKwp) * 1000) / 600);
    const panelWatt = calculation?.pvSizing?.panelWattageW ?? 600;

    autoTable(doc, {
      startY: 38,
      head: [["Engineering Metric", "Recommended Sizing / Specification"]],
      body: [
        [
          "Recommended Inverter Capacity",
          `${Number(inverterKva).toFixed(1)} kVA / ${Number(inverterKw).toFixed(1)} kW (PF 0.8, +25% margin)`,
        ],
        ["Recommended Battery Bank", batConfig],
        [
          "Recommended Solar PV Array",
          `${Number(pvKwp).toFixed(2)} kWp (${panelCount} × ${panelWatt}W Monocrystalline Panels)`,
        ],
        [
          "Simultaneous Running Load / Connected Load",
          `${totals.simultaneousKW.toFixed(2)} kW simultaneous / ${totals.peakKW.toFixed(2)} kW connected`,
        ],
        ["Total Daily Energy Consumption", `${totals.dailyKWh.toFixed(2)} kWh / day (${totals.totalWh.toLocaleString()} Wh)`],
        ["Nighttime Backup Energy Requirement", `${totals.nightKWh.toFixed(2)} kWh / night (${totals.nightWh.toLocaleString()} Wh)`],
      ],
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [44, 178, 44], textColor: 255, fontStyle: "bold" },
    });

    let currentY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ? (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
      : 105;

    if (completeRows.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Appliance Load & Night Backup Breakdown", 14, currentY);

      const applianceBody: (string | number)[][] = completeRows.map((r, i) => {
        const qty = Number(r.quantity);
        const w = Number(r.watts);
        const h = Number(r.hours);
        const nh = resolveRowNightHours(r);
        const dailyWh = qty * w * h;
        const nightWh = r.nightBackup ? qty * w * nh : 0;
        return [
          String(i + 1),
          r.item,
          String(qty),
          `${w} W`,
          `${h}h`,
          r.nightBackup ? `${nh}h` : "—",
          `${dailyWh.toLocaleString()} Wh`,
          r.nightBackup ? `${nightWh.toLocaleString()} Wh` : "0 Wh",
        ];
      });

      autoTable(doc, {
        startY: currentY + 3,
        head: [["#", "Appliance", "Qty", "Power", "Daily Hrs", "Night Hrs", "Daily Energy", "Night Energy"]],
        body: applianceBody,
        theme: "striped",
        styles: { fontSize: 8.5, cellPadding: 2.5 },
        headStyles: { fillColor: [24, 114, 24], textColor: 255, fontStyle: "bold" },
      });

      currentY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ? (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
        : currentY + 50;
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Note: Sizing uses Fortsolar Nigerian Engineering Standards (3.5h PSH baseline, 1.3x cloudy-weather safety factor, 80% LiFePO4 DoD, 95% battery efficiency, 92% inverter efficiency).",
      14,
      Math.min(currentY, 275),
      { maxWidth: 180 },
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
          error: (err) =>
            err instanceof Error ? err.message : "Unable to submit quote right now",
        },
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

  const batteryUnitsCount =
    calculation?.batterySizing?.unitsCount ??
    calculation?.display?.batteryUnitsCount ??
    (Number(batteryKwh) > 0 ? Math.ceil(Number(batteryKwh) / 5) : 0);
  const batteryUnitSize =
    calculation?.batterySizing?.unitSizeKwh ?? calculation?.display?.batteryUnitKwh ?? 5;
  const usableBatteryKwh =
    calculation?.batterySizing?.usableCapacityKwh ??
    calculation?.display?.usableBatteryKwh ??
    Number(batteryKwh) * 0.7;
  const panelCount =
    calculation?.pvSizing?.recommendedPanelCount ??
    calculation?.display?.panelCount ??
    (Number(pvKwp) > 0 ? Math.ceil((Number(pvKwp) * 1000) / 600) : 0);
  const panelWattageW =
    calculation?.pvSizing?.panelWattageW ?? calculation?.display?.panelWattageW ?? 600;
  const estSolarGenKwh =
    calculation?.pvSizing?.estimatedDailyGenerationKwh ??
    calculation?.display?.estimatedDailySolarGenKwh ??
    Number(pvKwp) * 3.5 * 0.78;
  const estRechargeHours =
    calculation?.pvSizing?.estimatedBatteryRechargeHours ??
    calculation?.display?.estimatedRechargeHours ??
    0;

  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 md:pt-10 my-6 md:my-10">
      <Toaster />

      {/* ── Mobile-First Appliance Cards (< md) ───────────────────────── */}
      <div className="space-y-4 md:hidden">
        {rows.map((row, index) => {
          const dailyWh =
            typeof row.quantity === "number" &&
            typeof row.watts === "number" &&
            typeof row.hours === "number"
              ? row.quantity * row.watts * row.hours
              : 0;
          const nightHrs = resolveRowNightHours(row);
          const nightWh =
            row.nightBackup &&
            typeof row.quantity === "number" &&
            typeof row.watts === "number"
              ? row.quantity * row.watts * nightHrs
              : 0;
          const rowError = validateCalculatorRow(row);

          return (
            <article
              key={row.id}
              className={`rounded-2xl border p-4 shadow-sm transition-colors ${
                row.inductive ? "border-l-4 border-l-amber-500 " : ""
              }${
                row.nightBackup
                  ? "border-[#2CB22C]/40 bg-[#F6FFF6]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ECFDF3] text-xs font-bold text-[#027A48]">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold text-[#101828]">Appliance</p>
                  {row.inductive && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Motor Surge ({row.surgeMultiplier ?? 2.5}×)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove appliance ${index + 1}`}
                  className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wide text-[#667085]">
                Appliance Name
                <input
                  type="text"
                  value={row.item}
                  placeholder="Search e.g. 1HP Inverter AC, Fridge, Fan..."
                  className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-normal normal-case tracking-normal text-[#101828] outline-none focus:border-[#2CB22C]"
                  onFocus={(event) => {
                    activeInputRef.current = event.currentTarget;
                    setDropdownRect(event.currentTarget.getBoundingClientRect());
                    setActiveRowId(row.id);
                  }}
                  onBlur={() =>
                    setTimeout(
                      () =>
                        setActiveRowId((current) =>
                          current === row.id ? null : current,
                        ),
                      120,
                    )
                  }
                  onChange={(event) => {
                    activeInputRef.current = event.currentTarget;
                    setDropdownRect(event.currentTarget.getBoundingClientRect());
                    setActiveRowId(row.id);
                    updateRow(row.id, { item: event.target.value });
                  }}
                />
              </label>

              <div className="mt-3 grid grid-cols-3 gap-2.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                  Qty
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    placeholder="1"
                    value={row.quantity}
                    className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-2 py-2.5 text-center text-sm font-medium text-[#101828] outline-none focus:border-[#2CB22C]"
                    onChange={(event) =>
                      updateRow(row.id, {
                        quantity: parseCalculatorNumericInput(event.target.value),
                      })
                    }
                  />
                </label>

                <label className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                  Watts (W)
                  <input
                    type="number"
                    min={1}
                    inputMode="decimal"
                    placeholder="100"
                    value={row.watts}
                    className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-2 py-2.5 text-center text-sm font-medium text-[#101828] outline-none focus:border-[#2CB22C]"
                    onChange={(event) =>
                      updateRow(row.id, {
                        watts: parseCalculatorNumericInput(event.target.value),
                      })
                    }
                  />
                </label>

                <label className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                  Daily Hrs
                  <input
                    type="number"
                    min={0.5}
                    max={24}
                    step="0.5"
                    inputMode="decimal"
                    placeholder="8"
                    value={row.hours}
                    className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-2 py-2.5 text-center text-sm font-medium text-[#101828] outline-none focus:border-[#2CB22C]"
                    onChange={(event) =>
                      updateRow(row.id, {
                        hours: parseCalculatorNumericInput(event.target.value),
                      })
                    }
                  />
                </label>
              </div>

              {/* Simultaneous Usage Mode */}
              <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2">
                <span className="text-xs font-medium text-[#344054]">Usage Pattern:</span>
                <select
                  value={row.simultaneousMode || "simultaneous"}
                  onChange={(e) =>
                    updateRow(row.id, {
                      simultaneousMode: e.target.value as SimultaneousMode,
                    })
                  }
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#101828] outline-none focus:border-[#2CB22C]"
                >
                  <option value="simultaneous">Runs with others (Simultaneous)</option>
                  <option value="staggered">Used separately (Occasional)</option>
                </select>
              </div>

              {/* Option A Conditional Night Backup + Night Hours */}
              <div className="mt-3 rounded-xl border border-[#D1FADF] bg-white p-3">
                <label className="flex cursor-pointer items-center justify-between text-sm font-medium text-[#101828]">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-4 w-4 text-[#2CB22C]" />
                    Include in Night Backup?
                  </span>
                  <input
                    type="checkbox"
                    disabled={!row.item}
                    checked={row.nightBackup}
                    onChange={(event) =>
                      updateRow(row.id, { nightBackup: event.target.checked })
                    }
                    className="h-5 w-5 accent-[#2CB22C] rounded cursor-pointer"
                  />
                </label>

                {row.nightBackup && (
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 animate-in fade-in duration-200">
                    <div className="text-xs text-[#475467]">
                      <p className="font-semibold text-[#101828]">Night Backup Hours</p>
                      <p className="text-[11px] text-[#667085]">
                        Out of {row.hours || 0} daily hrs (max {row.hours || 24}h)
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={typeof row.hours === "number" ? row.hours : 24}
                        step="0.5"
                        inputMode="decimal"
                        value={row.nightHours}
                        placeholder={String(nightHrs)}
                        onChange={(e) =>
                          updateRow(row.id, {
                            nightHours: parseCalculatorNumericInput(e.target.value),
                          })
                        }
                        className="w-20 rounded-xl border border-[#2CB22C] bg-[#F6FFF6] px-2.5 py-2 text-center text-sm font-bold text-[#027A48] outline-none"
                      />
                      <span className="text-xs font-semibold text-[#027A48]">hrs</span>
                    </div>
                  </div>
                )}
              </div>

              {rowError && (
                <p className="mt-2 text-xs font-medium text-red-600">{rowError}</p>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 text-xs text-[#667085]">
                <span>
                  Daily:{" "}
                  <strong className="text-[#101828]">
                    {dailyWh.toLocaleString()} Wh
                  </strong>
                </span>
                <span>
                  Night Backup:{" "}
                  <strong className="text-[#027A48]">
                    {nightWh.toLocaleString()} Wh
                  </strong>
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Desktop / Tablet Appliance Table (md+) ────────────────────── */}
      <div
        ref={tableScrollRef}
        className="hidden rounded-t-2xl border border-gray-200 bg-white overflow-x-auto md:block shadow-xs"
      >
        <table className="w-full text-xs md:text-sm table">
          <thead className="bg-gray-50/80 text-[#344054]">
            <tr className="font-semibold border-b border-gray-200">
              <th className="p-3 border-r text-start min-w-[210px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 cursor-pointer">
                      Appliance / Load <Info className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Search our Nigerian appliance catalog or type any custom device
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="p-3 border-r text-center w-20">Qty</th>
              <th className="p-3 border-r text-center w-28">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 cursor-pointer">
                      Watts (W) <Info className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Running power per unit in Watts</TooltipContent>
                </Tooltip>
              </th>
              <th className="p-3 border-r text-center w-28">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 cursor-pointer">
                      Daily Hrs <Info className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Total hours this appliance runs in a 24-hour day (daytime + night)
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="p-3 border-r text-center min-w-[165px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 cursor-pointer">
                      🌙 Night Backup & Hrs <Info className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Tick if used at night (6 PM – 6 AM) and specify how many of the Daily Hours occur at night
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="p-3 border-r text-center w-36">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 cursor-pointer">
                      Usage Mode <Info className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Simultaneous loads run together; Staggered loads (e.g. iron, kettle, pump) run one at a time
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="p-3 border-r text-right whitespace-nowrap w-36">
                Daily / Night Energy
              </th>
              <th className="p-3 text-center w-14">Del</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const dailyWh =
                typeof row.quantity === "number" &&
                row.quantity >= 1 &&
                typeof row.watts === "number" &&
                row.watts >= 1 &&
                typeof row.hours === "number" &&
                row.hours > 0
                  ? Number(row.quantity) * Number(row.watts) * Number(row.hours)
                  : 0;
              const nightHrs = resolveRowNightHours(row);
              const nightWh =
                row.nightBackup &&
                typeof row.quantity === "number" &&
                row.quantity >= 1 &&
                typeof row.watts === "number" &&
                row.watts >= 1
                  ? Number(row.quantity) * Number(row.watts) * nightHrs
                  : 0;

              return (
                <tr
                  key={row.id}
                  className={`border-b last:border-b-0 transition-colors ${
                    row.inductive
                      ? "border-l-4 border-l-amber-500"
                      : "border-l-4 border-l-transparent"
                  } ${row.nightBackup ? "bg-[#2CB22C]/5" : "bg-white"}`}
                >
                  <td className="border-r p-2">
                    <div className="flex items-center gap-1.5">
                      {row.nightBackup && (
                        <span className="w-2 h-2 rounded-full bg-[#2CB22C] shrink-0" />
                      )}
                      <input
                        type="text"
                        className="w-full text-sm rounded-lg border border-transparent focus:border-[#2CB22C] bg-transparent px-2 py-1.5 outline-0"
                        placeholder="Search or type appliance..."
                        value={row.item}
                        onFocus={(e) => {
                          activeInputRef.current = e.currentTarget;
                          setDropdownRect(e.currentTarget.getBoundingClientRect());
                          setActiveRowId(row.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault();
                        }}
                        onBlur={() =>
                          setTimeout(() => {
                            setActiveRowId((prev) => (prev === row.id ? null : prev));
                          }, 120)
                        }
                        onChange={(e) => {
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

                  <td className="border-r p-2">
                    <input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      placeholder="1"
                      className="w-full text-center rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#2CB22C]"
                      value={row.quantity}
                      onChange={(e) =>
                        updateRow(row.id, {
                          quantity: parseCalculatorNumericInput(e.target.value),
                        })
                      }
                      onBlur={() => {
                        if (row.quantity === "") return;
                        updateRow(row.id, {
                          quantity: Math.max(1, Number(row.quantity)),
                        });
                      }}
                    />
                  </td>

                  <td className="border-r p-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        inputMode="decimal"
                        placeholder="100"
                        className="w-full text-center rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#2CB22C]"
                        value={row.watts}
                        onChange={(e) =>
                          updateRow(row.id, {
                            watts: parseCalculatorNumericInput(e.target.value),
                          })
                        }
                        onBlur={() => {
                          if (row.watts === "") return;
                          updateRow(row.id, {
                            watts: Math.max(1, Number(row.watts)),
                          });
                        }}
                      />
                      <span className="text-xs font-medium text-gray-400">W</span>
                    </div>
                  </td>

                  <td className="border-r p-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0.5}
                        max={24}
                        step="0.5"
                        inputMode="decimal"
                        placeholder="8"
                        className="w-full text-center rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#2CB22C]"
                        value={row.hours}
                        onChange={(e) =>
                          updateRow(row.id, {
                            hours: parseCalculatorNumericInput(e.target.value),
                          })
                        }
                        onBlur={() => {
                          if (row.hours === "") return;
                          updateRow(row.id, {
                            hours: Math.min(24, Math.max(0.5, Number(row.hours))),
                          });
                        }}
                      />
                      <span className="text-xs font-medium text-gray-400">h</span>
                    </div>
                  </td>

                  {/* Option A Conditional Night Backup + Night Hours */}
                  <td className="border-r p-2">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="checkbox"
                        disabled={!row.item}
                        checked={row.nightBackup}
                        onChange={(e) =>
                          updateRow(row.id, { nightBackup: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#2CB22C] rounded border-gray-300 cursor-pointer shrink-0"
                      />
                      {row.nightBackup ? (
                        <div className="flex items-center gap-1 animate-in fade-in duration-150">
                          <input
                            type="number"
                            min={0}
                            max={typeof row.hours === "number" ? row.hours : 24}
                            step="0.5"
                            inputMode="decimal"
                            value={row.nightHours}
                            placeholder={String(nightHrs)}
                            onChange={(e) =>
                              updateRow(row.id, {
                                nightHours: parseCalculatorNumericInput(e.target.value),
                              })
                            }
                            onBlur={() => {
                              if (row.nightHours === "") return;
                              const maxH =
                                typeof row.hours === "number" ? row.hours : 24;
                              updateRow(row.id, {
                                nightHours: Math.min(
                                  maxH,
                                  Math.max(0, Number(row.nightHours)),
                                ),
                              });
                            }}
                            className="w-16 rounded-lg border border-[#2CB22C] bg-white px-1.5 py-1 text-center text-xs font-bold text-[#027A48] outline-none"
                          />
                          <span className="text-[11px] font-medium text-[#027A48]">
                            /{row.hours || 24}h
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Day only</span>
                      )}
                    </div>
                  </td>

                  <td className="border-r p-2">
                    <select
                      value={row.simultaneousMode || "simultaneous"}
                      onChange={(e) =>
                        updateRow(row.id, {
                          simultaneousMode: e.target.value as SimultaneousMode,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-[#344054] outline-none focus:border-[#2CB22C]"
                    >
                      <option value="simultaneous">Runs Together</option>
                      <option value="staggered">Used Separately</option>
                    </select>
                  </td>

                  <td className="border-r p-2 text-right">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-[#101828]">
                        {dailyWh > 0 ? `${dailyWh.toLocaleString()} Wh` : "—"}
                      </p>
                      {row.nightBackup && nightWh > 0 && (
                        <p className="text-[11px] font-medium text-[#027A48]">
                          🌙 {nightWh.toLocaleString()} Wh night
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="p-2 text-center bg-red-50/40">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="text-red-500 hover:text-red-700 inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Autocomplete Portal */}
      {activeRowId &&
        dropdownRect &&
        typeof window !== "undefined" &&
        (() => {
          const dropdownMaxHeight = 220;
          const spaceBelow = window.innerHeight - dropdownRect.bottom;
          const openUp =
            spaceBelow < dropdownMaxHeight && dropdownRect.top > dropdownMaxHeight;
          const top = openUp
            ? dropdownRect.top - dropdownMaxHeight - 4
            : dropdownRect.bottom + 4;
          const left = Math.max(8, dropdownRect.left);
          const width = Math.max(
            260,
            Math.min(dropdownRect.width, window.innerWidth - left - 8),
          );

          if (!activeSuggestions.length) return null;

          return createPortal(
            <div
              className="fixed z-50 max-h-56 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg"
              style={{ top, left, width }}
            >
              {activeSuggestions.map((device) => {
                const isDefaultNight =
                  device.name.toLowerCase().includes("fridge") ||
                  device.name.toLowerCase().includes("freezer") ||
                  device.name.toLowerCase().includes("fan") ||
                  device.name.toLowerCase().includes("bulb") ||
                  device.name.toLowerCase().includes("floodlight") ||
                  device.name.toLowerCase().includes("cctv") ||
                  device.name.toLowerCase().includes("router");
                const defaultDailyHours =
                  device.name.toLowerCase().includes("fridge") ||
                  device.name.toLowerCase().includes("freezer")
                    ? 16
                    : device.name.toLowerCase().includes("pump") ||
                        device.name.toLowerCase().includes("iron") ||
                        device.name.toLowerCase().includes("kettle") ||
                        device.name.toLowerCase().includes("washing")
                      ? 1
                      : 6;
                const defaultNightHours = isDefaultNight
                  ? Math.min(defaultDailyHours, 8)
                  : "";
                const isStaggeredDefault =
                  device.name.toLowerCase().includes("pump") ||
                  device.name.toLowerCase().includes("iron") ||
                  device.name.toLowerCase().includes("kettle") ||
                  device.name.toLowerCase().includes("microwave") ||
                  device.name.toLowerCase().includes("washing");

                return (
                  <button
                    key={device.key}
                    type="button"
                    className="w-full text-left text-xs md:text-sm px-3.5 py-2.5 hover:bg-[#F6FFF6] border-b border-gray-50 last:border-b-0 flex items-center justify-between gap-2"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      if (!activeRowId) return;
                      updateRow(activeRowId, {
                        item: device.name,
                        watts: Math.max(1, Number(device.watts) || 1),
                        hours: defaultDailyHours,
                        quantity: 1,
                        nightBackup: isDefaultNight,
                        nightHours: defaultNightHours,
                        simultaneousMode: isStaggeredDefault
                          ? "staggered"
                          : "simultaneous",
                        inductive: device.inductive || false,
                        surgeMultiplier: device.surgeMultiplier || 1,
                      });
                      setActiveRowId(null);
                      setActiveSuggestions([]);
                    }}
                  >
                    <div>
                      <span className="font-semibold text-[#101828]">
                        {device.name}
                      </span>
                      {device.category && (
                        <span className="ml-1.5 text-xs text-[#667085]">
                          · {device.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-[#344054]">
                        {device.watts}W
                      </span>
                      {device.inductive && (
                        <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          {device.surgeMultiplier}× surge
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>,
            document.body,
          );
        })()}

      <div className="flex justify-end mt-3 md:mt-0">
        <Button
          onClick={() => setRows((currentRows) => addCalculatorRow(currentRows))}
          className="w-full md:w-fit text-xs md:text-sm cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] px-8 py-5 rounded-xl md:rounded-b-xl md:rounded-t-none hover:opacity-90 font-semibold"
        >
          + Add Another Appliance
        </Button>
      </div>

      {/* Legend */}
      <div className="mt-3 md:mt-0 flex flex-wrap items-center gap-4 bg-gray-50 border border-gray-200 p-3.5 text-xs text-gray-600 rounded-xl md:rounded-b-xl md:rounded-t-none">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-amber-500 rounded-xs"></div>
          <span>
            <strong>Inductive motor load:</strong> Startup surge is factored into inverter sizing
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#2CB22C] rounded-full"></div>
          <span>
            <strong>🌙 Night Backup:</strong> Enter exact night hours (out of daily hours) to size your lithium battery bank accurately
          </span>
        </div>
      </div>

      {/* ── 3 Prominent Engineering Result Cards + Summary ──────────────── */}
      <div ref={summaryRef} className="mt-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-semibold text-[#027A48] mb-2">
              <Zap className="h-3.5 w-3.5" /> Nigerian Engineering Standard Sizing
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#101828]">
              Your Custom Solar Engineering Recommendation
            </h3>
            <p className="text-sm text-[#475467] mt-1">
              Sized independently for peak load &amp; motor surge (Inverter), nighttime backup energy (Battery), and rainy-season recharge recovery (Solar PV).
            </p>
          </div>
          {isCalculating && (
            <span className="text-xs font-medium text-[#027A48] animate-pulse">
              Updating engineering calculations...
            </span>
          )}
        </div>

        {/* 3 Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Recommended Inverter */}
          <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Recommended Inverter
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#027A48]">
                  <Cpu className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-[#101828]">
                  {Number(inverterKva).toFixed(1)} kVA
                </p>
                <span className="text-sm font-semibold text-[#027A48]">
                  ({Number(inverterKw).toFixed(1)} kW)
                </span>
              </div>
              <p className="mt-1 text-xs text-[#475467]">
                Pure Sine Wave Hybrid Inverter (PF 0.8, +25% safety headroom)
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-xs text-[#475467]">
              <div className="flex justify-between">
                <span>Simultaneous Load:</span>
                <strong className="text-[#101828]">
                  {totals.simultaneousKW.toFixed(2)} kW ({Math.round(totals.simultaneousKW * 1000)} W)
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Max Motor Surge Headroom:</span>
                <strong className="text-amber-700">
                  +{Math.round(totals.maxSurgeW).toLocaleString()} W
                </strong>
              </div>
            </div>
          </div>

          {/* Card 2: Recommended Battery Bank */}
          <div className="rounded-2xl border-2 border-[#2CB22C] bg-[#F6FFF6]/60 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#027A48]">
                  Recommended Battery Bank
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2CB22C] text-white">
                  <BatteryCharging className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-[#101828]">
                  {Number(batteryKwh).toFixed(1)} kWh
                </p>
                <span className="text-xs font-semibold text-[#027A48]">
                  Nominal LiFePO4
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#027A48]">
                {batteryUnitsCount > 0
                  ? `${batteryUnitsCount} × ${batteryUnitSize}kWh Lithium Module${batteryUnitsCount > 1 ? "s" : ""} (${usableBatteryKwh.toFixed(1)} kWh Usable)`
                  : "No night backup loads selected (0 kWh)"}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2CB22C]/20 space-y-1 text-xs text-[#344054]">
              <div className="flex justify-between">
                <span>Nighttime Energy Need:</span>
                <strong className="text-[#101828]">
                  {totals.nightKWh.toFixed(2)} kWh ({Math.round(totals.nightWh).toLocaleString()} Wh)
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Est. Backup Duration:</span>
                <strong className="text-[#027A48]">
                  {calculation?.batterySizing?.requestedBackupHours
                    ? `${calculation.batterySizing.estimatedBackupHours.toFixed(1)} hrs (Req: ${calculation.batterySizing.requestedBackupHours.toFixed(1)}h)`
                    : "Daytime Only"}
                </strong>
              </div>
            </div>
          </div>

          {/* Card 3: Recommended Solar PV Array */}
          <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Recommended Solar Array
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Sun className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-[#101828]">
                  {Number(pvKwp).toFixed(2)} kWp
                </p>
                <span className="text-xs font-semibold text-amber-700">
                  ({panelCount} × {panelWattageW}W Panels)
                </span>
              </div>
              <p className="mt-1 text-xs text-[#475467]">
                Includes 1.3× Nigerian rainy/cloudy weather safety factor
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-xs text-[#475467]">
              <div className="flex justify-between">
                <span>Est. Daily Generation:</span>
                <strong className="text-[#101828]">
                  ~{estSolarGenKwh.toFixed(1)} kWh / day
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Battery Recharge Time:</span>
                <strong className="text-[#027A48]">
                  {estRechargeHours > 0
                    ? `~${estRechargeHours.toFixed(1)} Peak Sun Hrs`
                    : "N/A (No night load)"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Warnings (if any) */}
        {calculation?.warnings && calculation.warnings.length > 0 && (
          <div className="mt-4 space-y-2">
            {calculation.warnings.map((warn, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900"
              >
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Energy Breakdown & Collapsible Engineering Assumptions */}
        <div className="mt-6 rounded-2xl border border-[#EAECF0] bg-white overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 p-4 text-center">
            <div className="p-2">
              <p className="text-[11px] font-medium text-[#667085] uppercase">
                Total Connected Load
              </p>
              <p className="mt-1 text-base font-bold text-[#101828]">
                {totals.peakKW.toFixed(2)} kW
              </p>
            </div>
            <div className="p-2">
              <p className="text-[11px] font-medium text-[#667085] uppercase">
                Total Daily Energy
              </p>
              <p className="mt-1 text-base font-bold text-[#101828]">
                {totals.dailyKWh.toFixed(2)} kWh
              </p>
            </div>
            <div className="p-2">
              <p className="text-[11px] font-medium text-[#667085] uppercase">
                Daytime Direct Energy
              </p>
              <p className="mt-1 text-base font-bold text-[#101828]">
                {totals.daytimeKWh.toFixed(2)} kWh
              </p>
            </div>
            <div className="p-2">
              <p className="text-[11px] font-medium text-[#027A48] uppercase">
                Night Backup Energy
              </p>
              <p className="mt-1 text-base font-bold text-[#027A48]">
                {totals.nightKWh.toFixed(2)} kWh
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-2.5">
            <button
              type="button"
              onClick={() => setShowAssumptions((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-semibold text-[#344054] hover:text-[#101828]"
            >
              <span>View Nigerian Engineering Design Parameters &amp; Efficiencies</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showAssumptions ? "rotate-180" : ""
                }`}
              />
            </button>
            {showAssumptions && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-200/70 text-[11px] text-[#475467]">
                <div>
                  <span className="text-gray-500">Peak Sun Hours (PSH):</span>{" "}
                  <strong className="text-[#101828]">3.5 hrs/day</strong>
                </div>
                <div>
                  <span className="text-gray-500">Cloudy Safety Factor:</span>{" "}
                  <strong className="text-[#101828]">1.3×</strong>
                </div>
                <div>
                  <span className="text-gray-500">PV Performance Ratio:</span>{" "}
                  <strong className="text-[#101828]">78%</strong>
                </div>
                <div>
                  <span className="text-gray-500">LiFePO4 Usable DoD:</span>{" "}
                  <strong className="text-[#101828]">80%</strong>
                </div>
                <div>
                  <span className="text-gray-500">Battery Charge/Disch Eff:</span>{" "}
                  <strong className="text-[#101828]">95% / 95%</strong>
                </div>
                <div>
                  <span className="text-gray-500">Inverter Efficiency:</span>{" "}
                  <strong className="text-[#101828]">92% (PF 0.8)</strong>
                </div>
                <div>
                  <span className="text-gray-500">Inverter Safety Margin:</span>{" "}
                  <strong className="text-[#101828]">+25% (1.25×)</strong>
                </div>
                <div>
                  <span className="text-gray-500">Standard Modules:</span>{" "}
                  <strong className="text-[#101828]">600W PV / 5kWh Bat</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Package Suggestions ──────────────────────────────── */}
      {hasCalculated && (
        <div className="mt-12 w-full">
          {isFetchingPackages && (
            <p className="text-xs text-[#667085] mb-3">
              Checking for matching packages...
            </p>
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
                            isBestMatch
                              ? "bg-[#2CB22C] text-white hover:bg-[#048A05]"
                              : "bg-[#F2F4F7] text-[#101828] hover:bg-gray-200"
                          }`}
                        >
                          <ArrowRight className="w-4 h-4 -rotate-45" />
                        </Link>
                      </div>

                      <p className="text-xs text-[#475467] line-clamp-2 min-h-[32px] mb-4 z-20 relative">
                        {pkg.description ||
                          "Affordable and efficient solar solution tailored to power your home and appliances seamlessly."}
                      </p>

                      <div className="relative flex-1 grid mt-2">
                        <div
                          className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-300 z-10 bg-white ${
                            hoveredCardId === pkg.id
                              ? "opacity-0 pointer-events-none"
                              : "opacity-100"
                          }`}
                        >
                          <div className="mb-4">
                            <p className="text-xl font-extrabold text-[#101828]">
                              ₦{pkg.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-auto w-full h-[200px] bg-gray-100 rounded-xl overflow-hidden relative">
                            <img
                              src={
                                pkg.thumbnail_url && pkg.thumbnail_url !== "null"
                                  ? pkg.thumbnail_url
                                  : pkg.package_image_url &&
                                      pkg.package_image_url !== "null"
                                    ? pkg.package_image_url
                                    : "/double_solar_panels.png"
                              }
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/double_solar_panels.png";
                              }}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                              {pkg.target_audience === "campus" && (
                                <Tent className="w-4 h-4 text-[#2CB22C]" strokeWidth={2} />
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-300 z-20 bg-white h-full ${
                            hoveredCardId === pkg.id
                              ? "opacity-100 pointer-events-auto"
                              : "opacity-0 pointer-events-none"
                          }`}
                        >
                          <div
                            className={`rounded-xl p-3 mb-4 ${
                              isBestMatch
                                ? "bg-[#F0FFF0] border border-[#2CB22C]/20"
                                : "bg-[#F9FAFB] border border-[#EAECF0]"
                            }`}
                          >
                            <div
                              className={`flex items-center gap-1.5 font-semibold text-xs mb-2 ${
                                isBestMatch ? "text-[#048A05]" : "text-[#344054]"
                              }`}
                            >
                              Package Components
                            </div>

                            <div className="space-y-1.5">
                              <div
                                className={`flex items-center justify-between text-[11px] font-medium ${
                                  isBestMatch ? "text-[#048A05]" : "text-[#475467]"
                                }`}
                              >
                                <span>{pkg.inverter_size_kw || 3.5}kW Inverter</span>
                                <CheckCircle2 className="w-3 h-3" />
                              </div>

                              <div
                                className={`flex items-center justify-between text-[11px] font-medium ${
                                  isBestMatch ? "text-[#048A05]" : "text-[#475467]"
                                }`}
                              >
                                <span>{pkg.battery_capacity_kwh || 5.12}kWh Battery</span>
                                <CheckCircle2 className="w-3 h-3" />
                              </div>

                              <div
                                className={`flex items-center justify-between text-[11px] font-medium ${
                                  isBestMatch ? "text-[#048A05]" : "text-[#475467]"
                                }`}
                              >
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
                              {(pkg.what_it_powers && pkg.what_it_powers.length > 0
                                ? pkg.what_it_powers
                                : [
                                    "1x AC (1HP)",
                                    "1x Fridge",
                                    "1x TV",
                                    "4x Fans",
                                    "10x Lighting",
                                    "2x Laptops",
                                  ]
                              )
                                .slice(0, 8)
                                .map((item: string) => (
                                  <span key={item}>{item}</span>
                                ))}
                            </div>
                          </div>

                          <div className="pt-3 mt-auto">
                            <Link
                              href={storePackageHref(pkg.slug ?? pkg.id)}
                              className="w-full py-2 px-3 text-xs font-semibold text-center text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] hover:opacity-90 rounded-xl flex items-center justify-center gap-1.5 transition-opacity"
                            >
                              View &amp; Order Package →
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
              <p className="text-sm font-medium text-[#101828] mb-1">
                Custom Engineered System Recommended
              </p>
              <p className="text-[#475467] text-xs text-center max-w-xl mx-auto">
                Your load profile is best served by a custom-tailored Fortsolar package. Click &ldquo;Get Quote&rdquo; below and our engineering team will send your itemized quotation within 24 hours.
              </p>
            </div>
          )}
        </div>
      )}

      {hasCalculated && (
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <GetQuoteDialog
            totals={totals}
            selectedDevices={selectedDevices}
            disabled={!completeRows.length || !hasCalculated}
            isSubmitting={quoteSubmitting}
            onSubmit={submitQuote}
          />
          <Button
            disabled={!hasCalculated}
            variant="outline"
            onClick={downloadPdf}
            className="cursor-pointer w-full sm:w-fit py-6 rounded-xl font-semibold border-gray-300"
          >
            <PdfIcon /> Download Engineering Summary (PDF)
          </Button>
        </div>
      )}

      {/* ── Brief, Plain-English Engineering FAQ Section ──────────────── */}
      <div className="mt-16 rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ECFDF3] text-[#027A48]">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-[#101828]">
            How Our Solar Calculator Works (FAQ)
          </h3>
        </div>
        <p className="text-xs md:text-sm text-[#475467] mb-6">
          Brief answers on how we calculate your inverter, lithium battery, and solar panel requirements using Nigerian standards.
        </p>

        <div className="divide-y divide-gray-100">
          {faqItems.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-[#101828] hover:text-[#027A48] transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#667085] transition-transform ${
                      isOpen ? "rotate-180 text-[#027A48]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs md:text-sm leading-relaxed text-[#475467]">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CalculatorSectionTwo;
