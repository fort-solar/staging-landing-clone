import {
  addCalculatorRow,
  buildCalculatorQuotePayload,
  buildCalculatorTotals,
  calculateEngineeringSystem,
  createCalculatorRow,
  deriveCalculatorRecommendation,
  removeCalculatorRow,
  validateCalculatorRow,
  type CalculatorRow,
} from "@/lib/calculator";

describe("calculator recommendation helpers", () => {
  it("derives fallback recommendations that match the calculator formulas", () => {
    const totals = buildCalculatorTotals({
      totalLoadW: 4200,
      totalLoadKw: 4.2,
      totalEnergyWhPerDay: 16800,
      totalEnergyKwhPerDay: 16.8,
      avgEnergyKwhPerHour: 0.7,
      recommendedInverterKw: 0,
      recommendedBatteryKwh: 0,
      recommendedPvKwp: 0,
    });
    const recommendation = deriveCalculatorRecommendation(null, totals);

    expect(totals).toEqual(
      expect.objectContaining({
        totalWh: 16800,
        dailyKWh: 16.8,
        peakKW: 4.2,
      }),
    );
    expect(recommendation).toEqual(
      expect.objectContaining({
        inverterKw: 6,
        inverterKva: 7.5,
        batteryKwh: 17,
        pvKwp: 4.2,
        hasCalculated: false,
      }),
    );
  });

  it("builds the quote payload from calculated system specs and selected devices", () => {
    const payload = buildCalculatorQuotePayload({
      selectedDevices: [
        {
          item: "Air Conditioner",
          quantity: 2,
          watts: 1200,
          hours: 8,
          wattHours: 19200,
          nightBackup: true,
          nightHours: 6,
          simultaneousMode: "simultaneous",
        },
      ],
      totals: {
        totalWh: 19200,
        dailyKWh: 19.2,
        peakKW: 2.4,
      },
      name: "Ada Customer",
      email: "ada@example.com",
      phone: "08000000000",
      location: "Ikeja",
      address: "14 Allen Avenue",
      installationType: "Residential",
      buildingType: "Duplex",
      termsAccepted: true,
      note: "Needs weekend installation",
    });

    expect(payload).toEqual({
      name: "Ada Customer",
      email: "ada@example.com",
      phone: "08000000000",
      location: "Ikeja",
      address: "14 Allen Avenue",
      appliances: [
        {
          name: "Air Conditioner",
          wattage: 1200,
          quantity: 2,
          hoursPerDay: 8,
          nightBackup: true,
          nightHours: 6,
          simultaneousMode: "simultaneous",
        },
      ],
      totalLoadKw: 2.4,
      totalWattHoursPerDay: 19200,
      dailyUsageKwh: 19.2,
      monthlyUsageKwh: 576,
      monthlyBill: 0,
      quantity: 2,
      projectType: "Residential",
      buildingType: "Duplex",
      additionalInfo: "Needs weekend installation",
      agreeToTerms: true,
      requestInstallation: true,
    });
  });
});

describe("Fortsolar Engineering Calculator 10-Scenario Suite", () => {
  const row = (overrides: Partial<CalculatorRow>): CalculatorRow => ({
    ...createCalculatorRow(),
    item: "Appliance",
    quantity: 1,
    watts: 100,
    hours: 8,
    nightBackup: false,
    nightHours: "",
    simultaneousMode: "simultaneous",
    inductive: false,
    surgeMultiplier: 1,
    ...overrides,
  });

  it("1. Basic daytime-only load", () => {
    const res = calculateEngineeringSystem([
      row({ item: "Office PC", quantity: 4, watts: 200, hours: 8, nightBackup: false }),
    ]);
    expect(res.totalEnergyWhPerDay).toBe(6400);
    expect(res.backupEnergyWh).toBe(0);
    expect(res.recommendedBatteryKwh).toBe(0);
    expect(res.recommendedInverterKw).toBe(1.0);
    expect(res.recommendedInverterKva).toBe(1.5);
  });

  it("2. Mixed daytime and nighttime load (Option A conditional nightHours)", () => {
    const res = calculateEngineeringSystem([
      row({ item: "Fridge", quantity: 1, watts: 100, hours: 24, nightBackup: true, nightHours: 12 }),
      row({ item: "Fan", quantity: 2, watts: 75, hours: 12, nightBackup: true, nightHours: 8 }),
    ]);
    expect(res.totalEnergyWhPerDay).toBe(2400 + 1800);
    expect(res.backupEnergyWh).toBe(1200 + 1200);
    expect(res.daytimeEnergyWhPerDay).toBe(1800);
    expect(res.batterySizing?.unitsCount).toBe(1);
    expect(res.recommendedBatteryKwh).toBe(5);
  });

  it("3. Night-heavy load", () => {
    const res = calculateEngineeringSystem([
      row({ item: "1HP Inverter AC", quantity: 2, watts: 750, hours: 10, nightBackup: true, nightHours: 8 }),
    ]);
    expect(res.backupEnergyKwh).toBe(12);
    expect(res.batterySizing?.unitsCount).toBe(4);
    expect(res.recommendedBatteryKwh).toBe(20);
  });

  it("4. High-surge inductive appliance", () => {
    const res = calculateEngineeringSystem([
      row({
        item: "1HP Submersible Pump",
        quantity: 1,
        watts: 750,
        hours: 2,
        inductive: true,
        surgeMultiplier: 4.0,
      }),
    ]);
    expect(res.maxSurgeHeadroomW).toBe(2250);
    expect(res.recommendedInverterKw).toBe(3.0);
    expect(res.recommendedInverterKva).toBe(5.0);
  });

  it("5. Multiple loads with simultaneous vs staggered mode", () => {
    const sim = calculateEngineeringSystem([
      row({ item: "AC", quantity: 1, watts: 1100, hours: 8, simultaneousMode: "simultaneous" }),
      row({ item: "Iron", quantity: 1, watts: 1200, hours: 1, simultaneousMode: "simultaneous" }),
      row({ item: "Kettle", quantity: 1, watts: 1800, hours: 0.5, simultaneousMode: "simultaneous" }),
    ]);
    const stag = calculateEngineeringSystem([
      row({ item: "AC", quantity: 1, watts: 1100, hours: 8, simultaneousMode: "simultaneous" }),
      row({ item: "Iron", quantity: 1, watts: 1200, hours: 1, simultaneousMode: "staggered" }),
      row({ item: "Kettle", quantity: 1, watts: 1800, hours: 0.5, simultaneousMode: "staggered" }),
    ]);
    expect(sim.simultaneousLoadW).toBe(4100);
    expect(stag.simultaneousLoadW).toBe(2900);
    expect(stag.recommendedInverterKw).toBeLessThan(sim.recommendedInverterKw);
  });

  it("6. Invalid input where nightHours > hours is caught by validateCalculatorRow", () => {
    const invalid = row({ item: "TV", quantity: 1, watts: 100, hours: 4, nightBackup: true, nightHours: 6 });
    expect(validateCalculatorRow(invalid)).toMatch(/cannot exceed daily hours/i);
  });

  it("7. Zero night backup hours", () => {
    const res = calculateEngineeringSystem([
      row({ item: "Washing Machine", quantity: 1, watts: 500, hours: 2, nightBackup: true, nightHours: 0 }),
    ]);
    expect(res.backupEnergyWh).toBe(0);
    expect(res.recommendedBatteryKwh).toBe(0);
  });

  it("8. High simultaneous power load with low night energy triggers discharge power check", () => {
    const res = calculateEngineeringSystem([
      row({ item: "Workshop Load", quantity: 1, watts: 6000, hours: 2, nightBackup: true, nightHours: 0.3 }),
    ]);
    expect(res.batterySizing?.dischargePowerLimited).toBe(true);
    expect(res.batterySizing?.unitsCount).toBe(2);
    expect(res.recommendedBatteryKwh).toBe(10);
  });

  it("9. High night energy load with low simultaneous power load triggers PV/MPPT warning", () => {
    const res = calculateEngineeringSystem([
      row({ item: "24/7 Telecom Rack", quantity: 1, watts: 600, hours: 24, nightBackup: true, nightHours: 14 }),
    ]);
    expect(res.pvSizing?.pvWarning).toBeTruthy();
  });

  it("10. Admin configuration parameter overrides dynamically update results", () => {
    const base = calculateEngineeringSystem([
      row({ item: "Load", quantity: 1, watts: 1000, hours: 10, nightBackup: true, nightHours: 5 }),
    ]);
    const sunny = calculateEngineeringSystem(
      [row({ item: "Load", quantity: 1, watts: 1000, hours: 10, nightBackup: true, nightHours: 5 })],
      { pshHours: 5.5, cloudyWeatherFactor: 1.1 },
    );
    expect(sunny.pvSizing!.requiredPvKwp).toBeLessThan(base.pvSizing!.requiredPvKwp);
  });
});

describe("calculator row state helpers", () => {
  it("persists existing rows when adding a new row", () => {
    const firstRow = {
      id: "row-1",
      item: "Television",
      quantity: 1,
      watts: 120,
      hours: 6,
      nightBackup: false,
      nightHours: "" as const,
      simultaneousMode: "simultaneous" as const,
      inductive: false,
    };

    const rows = addCalculatorRow([firstRow]);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual(firstRow);
  });

  it("keeps a safe default row when removing the last calculator row", () => {
    const onlyRow = createCalculatorRow();
    const rows = removeCalculatorRow([onlyRow], onlyRow.id);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.id).not.toBe(onlyRow.id);
  });
});
