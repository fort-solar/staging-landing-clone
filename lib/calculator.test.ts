import {
  addCalculatorRow,
  buildCalculatorQuotePayload,
  buildCalculatorTotals,
  createCalculatorRow,
  deriveCalculatorRecommendation,
  removeCalculatorRow,
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

    expect(totals).toEqual({
      totalWh: 16800,
      dailyKWh: 16.8,
      peakKW: 4.2,
    });
    expect(recommendation).toEqual({
      inverterKw: 6,
      batteryKwh: 17,
      pvKwp: 4.2,
      hasCalculated: false,
    });
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

describe("calculator row state helpers", () => {
  it("persists existing rows when adding a new row", () => {
    const firstRow = {
      id: "row-1",
      item: "Television",
      quantity: 1,
      watts: 120,
      hours: 6,
      nightBackup: false,
      inductive: false,
    };

    const rows = addCalculatorRow([firstRow]);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual(firstRow);
    expect(rows[1]).toEqual(
      expect.objectContaining({
        item: "",
        quantity: "",
        watts: "",
        hours: "",
      }),
    );
  });

  it("keeps a safe default row when removing the last calculator row", () => {
    const onlyRow = createCalculatorRow();
    const rows = removeCalculatorRow([onlyRow], onlyRow.id);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(
      expect.objectContaining({
        item: "",
        quantity: "",
        watts: "",
        hours: "",
      }),
    );
    expect(rows[0]?.id).not.toBe(onlyRow.id);
  });
});
