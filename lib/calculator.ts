export type NumericField = number | "";

export type CalculatorRow = {
  id: string;
  item: string;
  quantity: NumericField;
  watts: NumericField;
  hours: NumericField;
};

export type SelectedDevice = {
  item: string;
  quantity: number;
  watts: number;
  hours: number;
  wattHours: number;
};

export type Totals = {
  totalWh: number;
  dailyKWh: number;
  peakKW: number;
};

export type CalculatorResponseData = {
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

export const CALCULATOR_CONSTANTS = {
  pshHours: 3.5,
  inverterSurgeFactor: 1.5,
  backupHours: 14,
  batterySafetyFactor: 1.3,
  pvLossFactor: 1.2,
};

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
  };
}

export function isPositiveCalculatorNumber(value: NumericField) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
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
      isPositiveCalculatorNumber(row.hours),
  );
}

export function buildSelectedDevices(rows: CalculatorRow[]) {
  return buildCompleteCalculatorRows(rows).map((row) => ({
    item: row.item,
    quantity: Number(row.quantity),
    watts: Number(row.watts),
    hours: Number(row.hours),
    wattHours: Number(row.quantity) * Number(row.watts) * Number(row.hours),
  }));
}

export function buildCalculatorTotals(
  calculation: CalculatorResponseData | null,
): Totals {
  return {
    totalWh: calculation?.totalEnergyWhPerDay ?? 0,
    dailyKWh: calculation?.totalEnergyKwhPerDay ?? 0,
    peakKW: calculation?.totalLoadKw ?? 0,
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
    batteryKwh,
    pvKwp,
    hasCalculated: Boolean(calculation),
  };
}

export function buildCalculatorQuotePayload(input: {
  selectedDevices: SelectedDevice[];
  totals: Totals;
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
