"use client";

import React, { useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import PdfIcon from "@/components/features/icons/PdfIcon";
import { Button } from "../button";

const DEVICES = [
  { label: "Laptop", watts: 65 },
  { label: "TV", watts: 120 },
  { label: "Fan", watts: 75 },
  { label: "Refrigerator", watts: 150 },
  { label: "Air Conditioner", watts: 1500 },
];

type Row = {
  id: string;
  item: string;
  quantity: number;
  watts: number;
  hours: number;
};

const createRow = (): Row => ({
  id: crypto.randomUUID(),
  item: "",
  quantity: 1,
  watts: 0,
  hours: 1,
});

const CalculatorSectionTwo = () => {
  const [rows, setRows] = useState<Row[]>([createRow()]);
  const summaryRef = useRef<HTMLDivElement>(null);

  const updateRow = (id: string, updates: Partial<Row>) => {
    setRows(rows =>
      rows.map(row => (row.id === id ? { ...row, ...updates } : row))
    );
  };

  const removeRow = (id: string) => {
    setRows(rows => rows.filter(row => row.id !== id));
  };

  const totals = useMemo(() => {
    const totalWh = rows.reduce(
      (sum, r) => sum + r.quantity * r.watts * r.hours,
      0
    );

    const peakWatts = rows.reduce(
      (sum, r) => sum + r.quantity * r.watts,
      0
    );

    return {
      totalWh,
      dailyKWh: totalWh / 1000,
      peakKW: peakWatts / 1000,
    };
  }, [rows]);

  const downloadPdf = () => {
    if (!summaryRef.current) return;
    html2pdf().from(summaryRef.current).save("energy-summary.pdf");
  };

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 my-10">
      {/* TABLE */}
      <div className="overflow-x-auto border border-gray-200">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="text-[#101828] font-semibold border-b">
              <th className="p-3 border-r">Item</th>
              <th className="p-3 border-r">Qty</th>
              <th className="p-3 border-r">Watts</th>
              <th className="p-3 border-r">Hours</th>
              <th className="p-3 border-r">Watt Hours</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(row => {
              const wattHours =
                row.quantity * row.watts * row.hours;

              return (
                <tr key={row.id} className="border-t">
                  <td className="p-2 border-r">
                    <select
                      className="w-full border rounded-md p-2"
                      value={row.item}
                      onChange={e => {
                        const device = DEVICES.find(
                          d => d.label === e.target.value
                        );
                        updateRow(row.id, {
                          item: e.target.value,
                          watts: device?.watts || 0,
                        });
                      }}
                    >
                      <option value="">Select item</option>
                      {DEVICES.map(d => (
                        <option key={d.label} value={d.label}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-2 border-r">
                    <input
                      type="number"
                      min={1}
                      className="w-20 border rounded-md p-2"
                      value={row.quantity}
                      onChange={e =>
                        updateRow(row.id, {
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </td>

                  <td className="p-2 border-r">
                    <input
                      type="number"
                      className="w-24 border rounded-md p-2"
                      value={row.watts}
                      onChange={e =>
                        updateRow(row.id, {
                          watts: Number(e.target.value),
                        })
                      }
                    />
                  </td>

                  <td className="p-2 border-r">
                    <input
                      type="number"
                      className="w-24 border rounded-md p-2"
                      value={row.hours}
                      onChange={e =>
                        updateRow(row.id, {
                          hours: Number(e.target.value),
                        })
                      }
                    />
                  </td>

                  <td className="p-2 border-r font-medium">
                    {wattHours} Wh
                  </td>

                  <td className="p-2 text-center bg-red-50">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setRows(r => [...r, createRow()])}
          className="px-6 py-5 text-white bg-green-600 rounded-b-lg"
        >
          Add Item
        </Button>
      </div>

      {/* SUMMARY */}
      <div ref={summaryRef} className="my-20 max-w-2xl">
        <p className="text-lg font-semibold mb-4">
          Your Custom System Recommendation
        </p>

        <table className="w-full border rounded-lg text-sm">
          <tbody>
            <tr><td className="p-3">Total Load</td><td>{totals.peakKW.toFixed(2)} kW</td></tr>
            <tr><td className="p-3">Daily Energy Use</td><td>{totals.dailyKWh.toFixed(2)} kWh</td></tr>
            <tr><td className="p-3">Estimated Inverter</td><td>{Math.ceil(totals.peakKW * 1.25)} kW</td></tr>
            <tr><td className="p-3">Battery Capacity</td><td>{Math.ceil(totals.dailyKWh)} kWh</td></tr>
            <tr><td className="p-3">PV Size</td><td>{(totals.dailyKWh / 4).toFixed(2)} kWp</td></tr>
          </tbody>
        </table>

        <div className="flex gap-4 my-8">
          <Button>Get Quote →</Button>
          <Button variant="outline" onClick={downloadPdf}>
            <PdfIcon /> Download Summary
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSectionTwo;
