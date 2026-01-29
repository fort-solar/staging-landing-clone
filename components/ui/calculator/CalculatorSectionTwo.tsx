"use client";

import React from "react";
import { Trash2 } from "lucide-react";

const CalculatorSectionTwo = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 pt-10">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* TABLE */}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr className="text-gray-600">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Watts (Per Item)</th>
              <th className="px-4 py-3 font-medium">Hours (Per Day)</th>
              <th className="px-4 py-3 font-medium">Watt Hours (W × Hrs)</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            
            <tr className="border-t">
             
              <td className="px-4 py-3">
                <input
                  placeholder="Laptop"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                />
              </td>

             
              <td className="px-4 py-3">
                <input
                  type="number"
                  defaultValue={1}
                  className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center outline-none focus:ring-2 focus:ring-green-500"
                />
              </td>

              
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={35}
                    className="w-24 rounded-lg  px-3 py-2 outline-none focus:ring-0 focus:ring-green-500"
                  />
                  <span className="text-gray-500 text-xs bg-[#B8C0CC33] px-3 py-2 rounded-md font-medium">W</span>
                </div>
              </td>

          
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={3}
                    className="w-24 rounded-lg  px-3 py-2 outline-none focus:ring-0 focus:ring-green-500"
                  />
                  <span className="text-gray-500 text-xs bg-[#B8C0CC33] px-3 py-2 rounded-md font-medium">Hrs</span>
                </div>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                  type="number"
                    defaultValue={105}
                    className="w-24 rounded-lg  px-3 py-2 outline-none focus:ring-0 focus:ring-green-500"
                  />
                     <span className="text-gray-500 text-xs bg-[#B8C0CC33] px-3 py-2 rounded-md font-medium">Wh</span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-center">
                <button className="text-red-500 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ADD ITEM */}
        <div className="flex justify-end px-4 py-4">
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-lg">
            Add Item
          </button>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSectionTwo;
