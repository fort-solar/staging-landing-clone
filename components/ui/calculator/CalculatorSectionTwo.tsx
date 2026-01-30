"use client";

import React, { useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import PdfIcon from "@/components/features/icons/PdfIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  selected: boolean;
};
const createRow = (): Row => ({
  id: crypto.randomUUID(),
  item: "",
  quantity: 1,
  watts: 0,
  hours: 1,
  selected: false,
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
    const activeRows = rows.filter(r => r.selected);

    const totalWh = activeRows.reduce(
      (sum, r) => sum + r.quantity * r.watts * r.hours,
      0
    );

    const peakWatts = activeRows.reduce(
      (sum, r) => sum + r.quantity * r.watts,
      0
    );

    return {
      totalWh,
      dailyKWh: totalWh / 1000,
      peakKW: peakWatts / 1000,
    };
  }, [rows]);


  const selectedDevices = useMemo(() => {
    return rows
      .filter(r => r.selected)
      .map(r => ({
        item: r.item,
        quantity: r.quantity,
        watts: r.watts,
        hours: r.hours,
        wattHours: r.quantity * r.watts * r.hours,
      }));
  }, [rows]);


  const downloadPdf = () => {
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
        ["Estimated Inverter Size", `${Math.ceil(totals.peakKW * 1.25)} kW`],
        ["Estimated Battery Capacity", `${Math.ceil(totals.dailyKWh)} kWh`],
        ["Estimated PV Size", `${(totals.dailyKWh / 4).toFixed(2)} kWp`],
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
                        const value = e.target.value;
                        const device = DEVICES.find(d => d.label === value);

                        updateRow(row.id, {
                          item: value,
                          watts: device?.watts || 0,
                          selected: Boolean(device),
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
                        min={0}
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
                        min={0}
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


      <div ref={summaryRef} className="bg-white my-20 max-w-2xl">
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
          <Button disabled={totals.totalWh === 0} variant="outline" onClick={downloadPdf} className="cursor-pointer">
            <PdfIcon /> Download Summary & Save
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSectionTwo;
