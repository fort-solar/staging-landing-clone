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

      <div className="overflow-x-auto border border-gray-200">
        <table className="min-w-225 w-full text-sm">
          <thead>
            <tr className="text-[#101828] font-semibold border-b">
              <th className="p-3 border-r text-start">Item</th>
              <th className="p-3 border-r text-start">Quantity</th>
              <th className="p-3 border-r text-start">Watts <span className="font-normal">(Per Item)</span> </th>
              <th className="p-3 border-r text-start">Hours <span className="font-normal">(Per Day)</span></th>
              <th className="p-3 border-r text-start">Watt Hours <span className="font-normal">(W X Hrs)</span></th>
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
                      className="w-full border-none focus:ring-0 outline-0   rounded-md p-2"
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
                      className="w-20 border-none focus:ring-0 outline-0 rounded-md p-2"
                      value={row.quantity}
                      onChange={e =>
                        updateRow(row.id, {
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </td>

                  <td >
                    <div className="px-4 py-2 border-r flex items-center justify-between">
                      <input
                        type="number"
                        className="w-24 border-none focus:ring-0 outline-0 rounded-md p-2"
                        value={row.watts}
                        onChange={e =>
                          updateRow(row.id, {
                            watts: Number(e.target.value),
                          })
                        }
                      />
                      <p className="font-medium text-sm bg-[#B8C0CC33] p-2 text-[#3B3B3BB2] rounded-sm">W</p>
                    </div>

                  </td>

                  <td >
                    <div className="px-4 py-2 border-r flex items-center justify-between">
                      <input
                        type="number"
                        className="w-24 border-none focus:ring-0 outline-0 rounded-md p-2"
                        value={row.hours}
                        onChange={e =>
                          updateRow(row.id, {
                            hours: Number(e.target.value),
                          })
                        }
                      />
                      <p className="font-medium text-sm bg-[#B8C0CC33] p-2 text-[#3B3B3BB2] rounded-sm">Hrs</p>
                    </div>

                  </td>

                  <td >
                    <div className="px-4 py-2 border-r flex items-center justify-between">
                      <p>  {wattHours}</p>
                      <p className="font-medium text-sm bg-[#B8C0CC33] p-2 text-[#3B3B3BB2] rounded-sm">Wh</p>
                    </div>

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
          className=" cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] px-8 py-5 rounded-b-lg rounded-t-none hover:opacity-90"
        >
          Add Item
        </Button>
      </div>


      <div ref={summaryRef} className="my-20 max-w-2xl">
        <p className="text-lg font-semibold mb-4 text-[#101828]">
          Your Custom System Recommendation
        </p>
        <p className="pb-10">
          Here’s a quick breakdown of your total energy usage based on your inputs. This shows your daily demand and the solar setup that fits perfectly.
        </p>

        <table className="w-full max-w-xl border rounded-lg text-sm">
          <tbody>
            <tr className="border-b"><td className="p-3">Total Load</td><td>{totals.peakKW.toFixed(2)} kW</td></tr>
            <tr className="border-b"><td className="p-3">Calculated Daily Energy Use</td><td>{totals.dailyKWh.toFixed(2)} kWh</td></tr>
            <tr className="border-b"><td className="p-3">Estimated Inverter Size</td><td>{Math.ceil(totals.peakKW * 1.25)} kW</td></tr>
            <tr className="border-b"><td className="p-3">Estimated Battery Capacity</td><td>{Math.ceil(totals.dailyKWh)} kWh</td></tr>
            <tr className=""><td className="p-3">Estimated PV Size</td><td>{(totals.dailyKWh / 4).toFixed(2)} kWp</td></tr>
          </tbody>
        </table>

        <div className="mt-8">
          <p className="italic">Note: <span>These are estimates based on your usage pattern. For custom optimization, you can request a detailed quote. </span> </p>
        </div>

        <div className="flex gap-4 my-8">
          <Button className=" cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] px-6  hover:opacity-90">Get Quote →</Button>
          <Button variant="outline" onClick={downloadPdf} className="cursor-pointer">
            <PdfIcon /> Download Summary & Save
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSectionTwo;
