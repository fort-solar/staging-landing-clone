export type NumericField = number | "";

export type SimultaneousMode = "simultaneous" | "staggered";

export type CalculatorRow = {
  id: string;
  item: string;
  quantity: NumericField;
  watts: NumericField;
  hours: NumericField;
  nightBackup: boolean;
  nightHours: NumericField;
  simultaneousMode: SimultaneousMode;
  inductive: boolean;
  surgeMultiplier?: number;
};

export type SelectedDevice = {
  item: string;
  quantity: number;
  watts: number;
  hours: number;
  wattHours: number;
  nightBackup: boolean;
  nightHours: number;
  nightWattHours: number;
  simultaneousMode: SimultaneousMode;
};

export type Totals = {
  totalWh: number;
  dailyKWh: number;
  nightWh: number;
  nightKWh: number;
  daytimeKWh: number;
  peakKW: number;
  simultaneousKW: number;
  maxSurgeW: number;
};

export type CalculatorResponseData = {
  totalLoadW: number;
  totalLoadKw: number;
  simultaneousLoadW?: number;
  simultaneousLoadKw?: number;
  totalEnergyWhPerDay: number;
  totalEnergyKwhPerDay: number;
  daytimeEnergyWhPerDay?: number;
  daytimeEnergyKwhPerDay?: number;
  avgEnergyKwhPerHour: number;
  backupEnergyWh?: number;
  backupEnergyKwh?: number;
  maxSurgeHeadroomW?: number;
  recommendedInverterKw: number;
  recommendedInverterKva?: number;
  recommendedBatteryKwh: number;
  recommendedPvKwp: number;
  inverterSizing?: {
    totalConnectedLoadW: number;
    totalConnectedLoadKw: number;
    simultaneousRunningLoadW: number;
    simultaneousRunningLoadKw: number;
    maxSurgeHeadroomW: number;
    peakLoadWithSurgeW: number;
    requiredContinuousKw: number;
    requiredInverterKva: number;
    recommendedInverterKw: number;
    recommendedInverterKva: number;
    powerFactor: number;
    safetyMargin: number;
  };
  batterySizing?: {
    requiredNominalKwh: number;
    recommendedNominalKwh: number;
    usableCapacityKwh: number;
    unitSizeKwh: number;
    unitsCount: number;
    systemVoltageV: number;
    configurationLabel: string;
    maxContinuousDischargeKw: number;
    dischargePowerLimited: boolean;
    requestedBackupHours: number;
    estimatedBackupHours: number;
    backupDurationMet: boolean;
    backupWarning: string | null;
  };
  pvSizing?: {
    daytimeDirectEnergyKwh: number;
    nightReplenishmentEnergyKwh: number;
    requiredDailyPvEnergyKwh: number;
    requiredPvKwp: number;
    panelWattageW: number;
    recommendedPanelCount: number;
    installedPvKwp: number;
    estimatedDailyGenerationKwh: number;
    estimatedBatteryRechargeHours: number;
    pvWarning: string | null;
  };
  warnings?: string[];
  display?: {
    inverterKw: number;
    inverterKva?: number;
    batteryKwh: number;
    batteryUnitsCount?: number;
    batteryUnitKwh?: number;
    usableBatteryKwh?: number;
    pvKwp: number;
    panelCount?: number;
    panelWattageW?: number;
    totalLoadKw?: number;
    simultaneousLoadKw?: number;
    totalEnergyKwhPerDay?: number;
    backupEnergyKwh?: number;
    estimatedDailySolarGenKwh?: number;
    estimatedRechargeHours?: number;
  };
};

export const CALCULATOR_CONSTANTS = {
  pshHours: 3.5,
  cloudyWeatherFactor: 1.3,
  pvPerformanceRatio: 0.78,
  batteryChargeEfficiency: 0.95,
  batteryDischargeEfficiency: 0.95,
  batteryUsableDod: 0.80,
  inverterEfficiency: 0.92,
  inverterSafetyMargin: 1.25,
  inverterPowerFactor: 0.80,
  standardBatteryUnitKwh: 5.0,
  batteryMaxDischargeCRate: 0.8,
  standardPanelWattage: 600,
  backupHours: 12,
};

export const STANDARD_INVERTER_SIZES_KVA = [
  1.5, 2.5, 3.0, 3.5, 5.0, 6.0, 7.5, 8.0, 10.0, 12.0, 15.0, 20.0, 25.0, 30.0, 40.0, 50.0, 60.0, 80.0, 100.0,
] as const;

export function selectStandardInverterKva(requiredKva: number): number {
  if (requiredKva <= 0) return 0;
  for (const std of STANDARD_INVERTER_SIZES_KVA) {
    if (std >= requiredKva - 1e-6) return std;
  }
  return Math.ceil(requiredKva / 5) * 5;
}

export function generateCalculatorRowId() {
  if (typeof globalThis !== "undefined" && "crypto" in globalThis) {
    const cryptoObj = globalThis.crypto as Crypto | undefined;
    if (cryptoObj?.randomUUID) {
      return cryptoObj.randomUUID();
    }
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createCalculatorRow(): CalculatorRow {
  return {
    id: generateCalculatorRowId(),
    item: "",
    quantity: "",
    watts: "",
    hours: "",
    nightBackup: false,
    nightHours: "",
    simultaneousMode: "simultaneous",
    inductive: false,
    surgeMultiplier: 1,
  };
}

export function isPositiveCalculatorNumber(value: NumericField) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function isNonNegativeCalculatorNumber(value: NumericField) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function parseCalculatorNumericInput(value: string): NumericField {
  if (value === "") {
    return "";
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return "";
  }

  return parsed;
}

export function resolveRowNightHours(row: Pick<CalculatorRow, "hours" | "nightBackup" | "nightHours">): number {
  if (!row.nightBackup) return 0;
  const dailyHours = typeof row.hours === "number" && Number.isFinite(row.hours) ? Math.max(0, Math.min(24, row.hours)) : 0;
  if (typeof row.nightHours === "number" && Number.isFinite(row.nightHours)) {
    return Math.max(0, Math.min(dailyHours, row.nightHours));
  }
  return Math.min(dailyHours, 8);
}

export function validateCalculatorRow(row: CalculatorRow): string | null {
  if (!row.item.trim()) return null;
  if (!isPositiveCalculatorNumber(row.quantity)) return "Quantity must be greater than 0";
  if (!isPositiveCalculatorNumber(row.watts)) return "Power (Watts) must be greater than 0";
  if (!isPositiveCalculatorNumber(row.hours) || Number(row.hours) > 24) {
    return "Daily hours must be between 0.1 and 24";
  }
  if (row.nightBackup && row.nightHours !== "") {
    const nh = Number(row.nightHours);
    if (!Number.isFinite(nh) || nh < 0) return "Night hours cannot be negative";
    if (nh > Number(row.hours)) {
      return `Night hours (${nh}h) cannot exceed daily hours (${row.hours}h)`;
    }
  }
  return null;
}

export function addCalculatorRow(rows: CalculatorRow[]) {
  return [...rows, createCalculatorRow()];
}

export function removeCalculatorRow(rows: CalculatorRow[], id: string) {
  if (rows.length === 1) {
    return [createCalculatorRow()];
  }

  return rows.filter((row) => row.id !== id);
}

export function buildCompleteCalculatorRows(rows: CalculatorRow[]) {
  return rows.filter(
    (row) =>
      row.item.trim().length > 0 &&
      isPositiveCalculatorNumber(row.quantity) &&
      isPositiveCalculatorNumber(row.watts) &&
      isPositiveCalculatorNumber(row.hours) &&
      Number(row.hours) <= 24 &&
      (!row.nightBackup ||
        row.nightHours === "" ||
        (Number(row.nightHours) >= 0 && Number(row.nightHours) <= Number(row.hours))),
  );
}

export function buildSelectedDevices(rows: CalculatorRow[]): SelectedDevice[] {
  return buildCompleteCalculatorRows(rows).map((row) => {
    const quantity = Number(row.quantity);
    const watts = Number(row.watts);
    const hours = Number(row.hours);
    const nightHours = resolveRowNightHours(row);
    const simultaneousMode: SimultaneousMode =
      row.simultaneousMode === "staggered" ? "staggered" : "simultaneous";
    return {
      item: row.item,
      quantity,
      watts,
      hours,
      wattHours: quantity * watts * hours,
      nightBackup: Boolean(row.nightBackup),
      nightHours,
      nightWattHours: row.nightBackup ? quantity * watts * nightHours : 0,
      simultaneousMode,
    };
  });
}

/** Pure client-side engineering calculation matching backend v4 engine */
export function calculateEngineeringSystem(
  rows: CalculatorRow[],
  overrides?: Partial<typeof CALCULATOR_CONSTANTS>
): CalculatorResponseData {
  const cfg = { ...CALCULATOR_CONSTANTS, ...overrides };
  const validRows = buildCompleteCalculatorRows(rows);

  let totalLoadW = 0;
  let simultaneousBaseW = 0;
  let largestStaggeredW = 0;
  let totalEnergyWhPerDay = 0;
  let backupEnergyWh = 0;
  let maxSurgeHeadroomW = 0;
  let maxRequestedNightHours = 0;

  for (const row of validRows) {
    const qty = Number(row.quantity);
    const w = Number(row.watts);
    const hours = Math.min(24, Math.max(0, Number(row.hours)));
    const nightHours = resolveRowNightHours(row);
    const mode: SimultaneousMode = row.simultaneousMode === "staggered" ? "staggered" : "simultaneous";
    const surgeMult = row.surgeMultiplier && row.surgeMultiplier >= 1 ? row.surgeMultiplier : row.inductive ? 2.5 : 1.0;

    const rowLoadW = qty * w;
    totalLoadW += rowLoadW;
    if (mode === "simultaneous") {
      simultaneousBaseW += rowLoadW;
    } else if (rowLoadW > largestStaggeredW) {
      largestStaggeredW = rowLoadW;
    }

    const rowDailyWh = qty * w * hours;
    const rowNightWh = row.nightBackup ? qty * w * nightHours : 0;
    totalEnergyWhPerDay += rowDailyWh;
    backupEnergyWh += rowNightWh;

    if (row.nightBackup && nightHours > maxRequestedNightHours) {
      maxRequestedNightHours = nightHours;
    }

    if (row.inductive || surgeMult > 1) {
      const surgeW = w * (surgeMult - 1);
      if (surgeW > maxSurgeHeadroomW) maxSurgeHeadroomW = surgeW;
    }
  }

  const simultaneousLoadW = simultaneousBaseW + largestStaggeredW;
  const totalLoadKw = totalLoadW / 1000;
  const simultaneousLoadKw = simultaneousLoadW / 1000;
  const totalEnergyKwhPerDay = totalEnergyWhPerDay / 1000;
  const backupEnergyKwh = backupEnergyWh / 1000;
  const daytimeEnergyWhPerDay = Math.max(0, totalEnergyWhPerDay - backupEnergyWh);
  const daytimeEnergyKwhPerDay = daytimeEnergyWhPerDay / 1000;

  const continuousWithMarginW = simultaneousLoadW * cfg.inverterSafetyMargin;
  const peakWithSurgeW = simultaneousLoadW + maxSurgeHeadroomW;
  const governingInverterW = Math.max(continuousWithMarginW, peakWithSurgeW);
  const recommendedInverterKw =
    governingInverterW > 0 ? Math.ceil(governingInverterW / 1000 / 0.5) * 0.5 : 0;
  const rawRequiredKva = recommendedInverterKw / cfg.inverterPowerFactor;
  const recommendedInverterKva = selectStandardInverterKva(rawRequiredKva);

  const usableEfficiencyFactor =
    cfg.batteryUsableDod * cfg.batteryDischargeEfficiency * cfg.inverterEfficiency;
  const requiredNominalKwh = backupEnergyKwh > 0 ? backupEnergyKwh / usableEfficiencyFactor : 0;
  let unitsCount =
    requiredNominalKwh > 0 ? Math.ceil(requiredNominalKwh / cfg.standardBatteryUnitKwh) : 0;

  const singleModuleMaxKw = cfg.standardBatteryUnitKwh * cfg.batteryMaxDischargeCRate;
  let dischargePowerLimited = false;
  if (unitsCount > 0 && simultaneousLoadKw > unitsCount * singleModuleMaxKw) {
    unitsCount = Math.ceil(simultaneousLoadKw / singleModuleMaxKw);
    dischargePowerLimited = true;
  }

  const recommendedNominalKwh = unitsCount * cfg.standardBatteryUnitKwh;
  const usableCapacityKwh = recommendedNominalKwh * usableEfficiencyFactor;
  const avgNightLoadKw =
    maxRequestedNightHours > 0 ? backupEnergyKwh / maxRequestedNightHours : simultaneousLoadKw;
  const estimatedBackupHours =
    avgNightLoadKw > 0 && usableCapacityKwh > 0 ? usableCapacityKwh / avgNightLoadKw : 0;
  const backupDurationMet =
    maxRequestedNightHours === 0 || estimatedBackupHours + 0.05 >= maxRequestedNightHours;

  const warnings: string[] = [];
  let backupWarning: string | null = null;
  if (dischargePowerLimited) {
    backupWarning = `Battery bank increased to ${unitsCount} × ${cfg.standardBatteryUnitKwh}kWh (${recommendedNominalKwh}kWh) to safely support your ${simultaneousLoadKw.toFixed(2)}kW simultaneous discharge load.`;
    warnings.push(backupWarning);
  } else if (!backupDurationMet && maxRequestedNightHours > 0) {
    backupWarning = `Requested ${maxRequestedNightHours.toFixed(1)}h night backup exceeds single-bank capacity; estimated runtime is ${estimatedBackupHours.toFixed(1)}h.`;
    warnings.push(backupWarning);
  }

  const roundTripEff =
    cfg.batteryChargeEfficiency * cfg.batteryDischargeEfficiency * cfg.inverterEfficiency;
  const daytimeDirectPvKwh =
    daytimeEnergyKwhPerDay > 0 ? daytimeEnergyKwhPerDay / cfg.inverterEfficiency : 0;
  const nightReplenishmentPvKwh = backupEnergyKwh > 0 ? backupEnergyKwh / roundTripEff : 0;
  const arrayEnvironmentalPr = cfg.pvPerformanceRatio / cfg.inverterEfficiency;
  const requiredPvKwp =
    daytimeDirectPvKwh + nightReplenishmentPvKwh > 0
      ? ((daytimeDirectPvKwh + nightReplenishmentPvKwh) * cfg.cloudyWeatherFactor) /
        (cfg.pshHours * arrayEnvironmentalPr)
      : 0;
  const recommendedPanelCount =
    requiredPvKwp > 0 ? Math.ceil((requiredPvKwp * 1000) / cfg.standardPanelWattage) : 0;
  const installedPvKwp = (recommendedPanelCount * cfg.standardPanelWattage) / 1000;
  const estimatedDailyGenerationKwh = installedPvKwp * cfg.pshHours * cfg.pvPerformanceRatio;
  const netArrayChargingKw = installedPvKwp * cfg.pvPerformanceRatio;
  const estimatedBatteryRechargeHours =
    netArrayChargingKw > 0 && backupEnergyKwh > 0
      ? backupEnergyKwh / (cfg.batteryChargeEfficiency * cfg.batteryDischargeEfficiency) / netArrayChargingKw
      : 0;

  let pvWarning: string | null = null;
  if (recommendedInverterKw > 0 && installedPvKwp > recommendedInverterKw * 1.6) {
    pvWarning = `High night energy demand requires a ${installedPvKwp.toFixed(2)}kWp solar array (${recommendedPanelCount} panels), which exceeds typical MPPT input limits for a ${recommendedInverterKva}kVA inverter.`;
    warnings.push(pvWarning);
  }

  return {
    totalLoadW,
    totalLoadKw,
    simultaneousLoadW,
    simultaneousLoadKw,
    totalEnergyWhPerDay,
    totalEnergyKwhPerDay,
    daytimeEnergyWhPerDay,
    daytimeEnergyKwhPerDay,
    avgEnergyKwhPerHour: totalEnergyKwhPerDay / 24,
    backupEnergyWh,
    backupEnergyKwh,
    maxSurgeHeadroomW,
    recommendedInverterKw,
    recommendedInverterKva,
    recommendedBatteryKwh: recommendedNominalKwh,
    recommendedPvKwp: installedPvKwp,
    inverterSizing: {
      totalConnectedLoadW: totalLoadW,
      totalConnectedLoadKw: totalLoadKw,
      simultaneousRunningLoadW: simultaneousLoadW,
      simultaneousRunningLoadKw: simultaneousLoadKw,
      maxSurgeHeadroomW,
      peakLoadWithSurgeW: peakWithSurgeW,
      requiredContinuousKw: continuousWithMarginW / 1000,
      requiredInverterKva: rawRequiredKva,
      recommendedInverterKw,
      recommendedInverterKva,
      powerFactor: cfg.inverterPowerFactor,
      safetyMargin: cfg.inverterSafetyMargin,
    },
    batterySizing: {
      requiredNominalKwh,
      recommendedNominalKwh,
      usableCapacityKwh,
      unitSizeKwh: cfg.standardBatteryUnitKwh,
      unitsCount,
      systemVoltageV: recommendedInverterKva >= 3.0 || unitsCount >= 1 ? 48 : 24,
      configurationLabel:
        unitsCount > 0
          ? `${unitsCount} × ${cfg.standardBatteryUnitKwh}kWh LiFePO4 (${recommendedNominalKwh}kWh Nominal / ${usableCapacityKwh.toFixed(1)}kWh Usable)`
          : "No Night Backup Selected (Daytime Solar Only)",
      maxContinuousDischargeKw: unitsCount * singleModuleMaxKw,
      dischargePowerLimited,
      requestedBackupHours: maxRequestedNightHours,
      estimatedBackupHours,
      backupDurationMet,
      backupWarning,
    },
    pvSizing: {
      daytimeDirectEnergyKwh: daytimeEnergyKwhPerDay,
      nightReplenishmentEnergyKwh: nightReplenishmentPvKwh * cfg.inverterEfficiency,
      requiredDailyPvEnergyKwh: totalEnergyKwhPerDay,
      requiredPvKwp,
      panelWattageW: cfg.standardPanelWattage,
      recommendedPanelCount,
      installedPvKwp,
      estimatedDailyGenerationKwh,
      estimatedBatteryRechargeHours,
      pvWarning,
    },
    warnings,
    display: {
      inverterKw: Number(recommendedInverterKw.toFixed(1)),
      inverterKva: Number(recommendedInverterKva.toFixed(1)),
      batteryKwh: Number(recommendedNominalKwh.toFixed(2)),
      batteryUnitsCount: unitsCount,
      batteryUnitKwh: cfg.standardBatteryUnitKwh,
      usableBatteryKwh: Number(usableCapacityKwh.toFixed(2)),
      pvKwp: Number(installedPvKwp.toFixed(2)),
      panelCount: recommendedPanelCount,
      panelWattageW: cfg.standardPanelWattage,
      totalLoadKw: Number(totalLoadKw.toFixed(2)),
      simultaneousLoadKw: Number(simultaneousLoadKw.toFixed(2)),
      totalEnergyKwhPerDay: Number(totalEnergyKwhPerDay.toFixed(2)),
      backupEnergyKwh: Number(backupEnergyKwh.toFixed(2)),
      estimatedDailySolarGenKwh: Number(estimatedDailyGenerationKwh.toFixed(2)),
      estimatedRechargeHours: Number(estimatedBatteryRechargeHours.toFixed(1)),
    },
  };
}

export function buildCalculatorTotals(
  calculation: CalculatorResponseData | null,
): Totals {
  const totalWh = calculation?.totalEnergyWhPerDay ?? 0;
  const dailyKWh = calculation?.totalEnergyKwhPerDay ?? 0;
  const nightWh = calculation?.backupEnergyWh ?? 0;
  const nightKWh = calculation?.backupEnergyKwh ?? 0;
  const daytimeKWh = calculation?.daytimeEnergyKwhPerDay ?? Math.max(0, dailyKWh - nightKWh);
  const peakKW = calculation?.totalLoadKw ?? 0;
  const simultaneousKW = calculation?.simultaneousLoadKw ?? peakKW;
  const maxSurgeW = calculation?.maxSurgeHeadroomW ?? 0;

  return {
    totalWh,
    dailyKWh,
    nightWh,
    nightKWh,
    daytimeKWh,
    peakKW,
    simultaneousKW,
    maxSurgeW,
  };
}

export function deriveCalculatorRecommendation(
  calculation: CalculatorResponseData | null,
  totals: Totals,
) {
  const inverterKw =
    calculation?.display?.inverterKw ??
    calculation?.recommendedInverterKw ??
    Math.ceil(totals.peakKW * 1.25);
  const inverterKva =
    calculation?.display?.inverterKva ??
    calculation?.recommendedInverterKva ??
    selectStandardInverterKva(inverterKw / 0.8);
  const batteryKwh =
    calculation?.display?.batteryKwh ??
    calculation?.recommendedBatteryKwh ??
    Math.ceil(totals.dailyKWh);
  const pvKwp =
    calculation?.display?.pvKwp ??
    calculation?.recommendedPvKwp ??
    totals.dailyKWh / 4;

  return {
    inverterKw,
    inverterKva,
    batteryKwh,
    pvKwp,
    hasCalculated: Boolean(calculation),
  };
}

export function buildCalculatorQuotePayload(input: {
  selectedDevices: Array<{
    item: string;
    quantity: number;
    watts: number;
    hours: number;
    wattHours: number;
    nightBackup?: boolean;
    nightHours?: number;
    simultaneousMode?: SimultaneousMode;
  }>;
  totals: Pick<Totals, "totalWh" | "dailyKWh" | "peakKW"> & Partial<Totals>;
  name: string;
  email: string;
  phone: string;
  location: string;
  address?: string;
  installationType: string;
  buildingType?: string;
  termsAccepted: boolean;
  note?: string;
}) {
  const quantity = input.selectedDevices.reduce(
    (sum, appliance) => sum + appliance.quantity,
    0,
  );

  return {
    name: input.name,
    email: input.email,
    phone: input.phone,
    location: input.location,
    address: input.address ?? "Not provided",
    appliances: input.selectedDevices.map((appliance) => ({
      name: appliance.item,
      wattage: appliance.watts,
      quantity: appliance.quantity,
      hoursPerDay: appliance.hours,
      ...(appliance.nightBackup !== undefined ? { nightBackup: appliance.nightBackup } : {}),
      ...(appliance.nightHours !== undefined ? { nightHours: appliance.nightHours } : {}),
      ...(appliance.simultaneousMode !== undefined ? { simultaneousMode: appliance.simultaneousMode } : {}),
    })),
    totalLoadKw: Number(input.totals.peakKW.toFixed(2)),
    totalWattHoursPerDay: Number(input.totals.totalWh.toFixed(2)),
    dailyUsageKwh: Number(input.totals.dailyKWh.toFixed(2)),
    monthlyUsageKwh: Number((input.totals.dailyKWh * 30).toFixed(2)),
    monthlyBill: 0,
    quantity,
    projectType: input.installationType,
    buildingType: input.buildingType ?? "Not provided",
    additionalInfo: input.note ?? "",
    agreeToTerms: input.termsAccepted,
    requestInstallation: true,
  };
}
