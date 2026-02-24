"use client";

import React, { useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import PdfIcon from "@/components/features/icons/PdfIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "../button";
import GetQuoteDialog from "./GetQuoteDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

      <div className="border border-gray-200 overflow-x-auto">
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
              const wattHours =
                row.quantity * row.watts * row.hours;

              return (
                <tr
                  key={row.id}
                  className=" border-b bg-white p-3 last:border-b-0 table-row md:border-t md:p-0"
                >
                  <td
                    className="table-cell border-b-0 border-r md:p-2 w-fit whitespace-nowrap min-w-22"
                  >
                    <select
                      className="w-full text-[10px] md:text-sm rounded-md border-none p-2 outline-0 focus:ring-0 whitespace-nowrap"
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
                      <option value="" className="text-sm">Select item</option>
                      {DEVICES.map(d => (
                        <option key={d.label} value={d.label} className="text-sm">
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td
                    className="table-cell border-b-0 border-r md:p-2"
                  >
                    <div className="flex w-full items-center justify-center gap-3 px-2 lg:px-4 py-2">
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-md border-none p-2 outline-0 focus:ring-0 md:w-20"
                        value={row.quantity}
                        onChange={e =>
                          updateRow(row.id, {
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                  </td>

                  <td
                    className="table-cell border-b-0 border-r md:p-2"
                  >
                    <div className="flex w-full items-center justify-between gap-3 px-2 lg:px-4 py-2">
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded-md border-none p-2 outline-0 focus:ring-0 md:w-24"
                        value={row.watts}
                        onChange={e =>
                          updateRow(row.id, {
                            watts: Number(e.target.value),
                          })
                        }
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
                        min={0}
                        max={24}
                        className="w-full rounded-md border-none p-2 outline-0 focus:ring-0 md:w-24"
                        value={row.hours}
                        onChange={e =>
                          updateRow(row.id, {
                            hours: Number(e.target.value),
                          })
                        }
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
      <div className="flex justify-end">
        <Button
          onClick={() => setRows(r => [...r, createRow()])}
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

        <div className="flex flex-col lg:flex-row gap-4 w-full my-8">
          <GetQuoteDialog totals={totals} selectedDevices={selectedDevices} onSubmit={async (payload) => {
            console.log("Quote payload:", payload);

          }} />
          <Button disabled={totals.totalWh === 0} variant="outline" onClick={downloadPdf} className="cursor-pointer w-full lg:w-fit py-6">
            <PdfIcon /> Download Summary & Save
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSectionTwo;
