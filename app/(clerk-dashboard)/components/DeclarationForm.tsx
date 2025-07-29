"use client";

import { useState } from "react";

// Types
type FormItem = {
  itemDescription: string;
  unitOfMeasurement: string;
  units: string;
  quantity: string;
  unitCost: string;
  dpvAmount: string;
  taxType: string[];
};

type FormData = {
  custombranchname: string;
  declarationnumber: string;
  declarationdispensedate: string;
  fobamount: string;
  exchangerate: string;
  externalfreight: string;
  insuranceCost: string;
  inlandfreight1: string;
  djibouticost: string;
  othercost1: string;
  items: FormItem[];
};

// InputField Component
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="font-medium mb-1 text-sm">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
        required
      />
    </div>
  );
}

// ItemRow Component
function ItemRow({
  item,
  index,
  handleItemChange,
  taxOptions,
}: {
  item: FormItem;
  index: number;
  handleItemChange: (index: number, field: string, value: any) => void;
  taxOptions: { label: string; value: string }[];
}) {
  return (
    <tr key={index} className="hover:bg-gray-50">
      <td className="px-2 py-1 border border-gray-200">
        <input
          type="text"
          value={item.itemDescription}
          onChange={(e) =>
            handleItemChange(index, "itemDescription", e.target.value)
          }
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          required
        />
      </td>
      <td className="px-2 py-1 border border-gray-200">
        <input
          type="text"
          value={item.unitOfMeasurement}
          onChange={(e) =>
            handleItemChange(index, "unitOfMeasurement", e.target.value)
          }
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          required
        />
      </td>
      <td className="px-2 py-1 border border-gray-200">
        <input
          type="text"
          value={item.units}
          onChange={(e) => handleItemChange(index, "units", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          required
        />
      </td>
      <td className="px-2 py-1 border border-gray-200">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          required
        />
      </td>
      <td className="px-2 py-1 border border-gray-200">
        <input
          type="number"
          value={item.unitCost}
          onChange={(e) => handleItemChange(index, "unitCost", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          required
        />
      </td>
      <td className="px-2 py-1 border border-gray-200">
        <select
          multiple
          value={item.taxType}
          onChange={(e) =>
            handleItemChange(
              index,
              "taxType",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
          className="w-full border border-gray-300 rounded px-1 py-1 text-xs h-[38px]"
          required
        >
          {taxOptions.map((tax) => (
            <option key={tax.value} value={tax.value}>
              {tax.label.split(" (")[0]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-2 py-1 border border-gray-200">
        <input
          type="number"
          value={item.dpvAmount}
          onChange={(e) => handleItemChange(index, "dpvAmount", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          required
        />
      </td>
    </tr>
  );
}

// Main Form Component
export default function DeclarationForm() {
  const [formData, setFormData] = useState<FormData>({
    custombranchname: "",
    declarationnumber: "",
    declarationdispensedate: "",
    fobamount: "",
    exchangerate: "",
    externalfreight: "",
    insuranceCost: "",
    inlandfreight1: "",
    djibouticost: "",
    othercost1: "",
    items: [
      {
        itemDescription: "",
        unitOfMeasurement: "",
        units: "",
        quantity: "",
        unitCost: "",
        dpvAmount: "",
        taxType: [],
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemDescription: "",
          unitOfMeasurement: "",
          units: "",
          quantity: "",
          unitCost: "",
          dpvAmount: "",
          taxType: [],
        },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");

      const response = await fetch(
        `https://customreceiptmanagement.onrender.com/api/v1/clerk/declarationInfo/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit declaration");
      }

      alert("Declaration submitted successfully!");
      setFormData({
        custombranchname: "",
        declarationnumber: "",
        declarationdispensedate: "",
        fobamount: "",
        exchangerate: "",
        externalfreight: "",
        insuranceCost: "",
        inlandfreight1: "",
        djibouticost: "",
        othercost1: "",
        items: [
          {
            itemDescription: "",
            unitOfMeasurement: "",
            units: "",
            quantity: "",
            unitCost: "",
            dpvAmount: "",
            taxType: [],
          },
        ],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const taxOptions = [
    { label: "Custom Duty Tax (01)", value: "01" },
    { label: "Custom Excise Tax (03)", value: "03" },
    { label: "Custom VAT (04)", value: "04" },
    { label: "Custom Surtax (05)", value: "05" },
    { label: "Custom Withholding Tax (15)", value: "15" },
    { label: "Custom Social Warfare (12)", value: "12" },
    { label: "Custom Scanning Fee (16)", value: "16" },
  ];

  return (
    <div className="w-full max-w-[100vw] px-2 md:px-4 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto bg-white rounded-lg p-4 md:p-6 space-y-6"
      >
        <h2 className="text-lg md:text-xl font-semibold text-center">
          Custom Declaration Form
        </h2>

        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Branch Name"
            name="custombranchname"
            value={formData.custombranchname}
            onChange={handleChange}
          />
          <InputField
            label="Decl. Number"
            name="declarationnumber"
            value={formData.declarationnumber}
            onChange={handleChange}
          />
          <InputField
            label="Decl. Date"
            name="declarationdispensedate"
            type="date"
            value={formData.declarationdispensedate}
            onChange={handleChange}
          />
          <InputField
            label="FOB Amount"
            name="fobamount"
            type="number"
            value={formData.fobamount}
            onChange={handleChange}
          />
          <InputField
            label="Exchange Rate"
            name="exchangerate"
            type="number"
            value={formData.exchangerate}
            onChange={handleChange}
          />
          <InputField
            label="Ext. Freight"
            name="externalfreight"
            type="number"
            value={formData.externalfreight}
            onChange={handleChange}
          />
          <InputField
            label="Insurance"
            name="insuranceCost"
            type="number"
            value={formData.insuranceCost}
            onChange={handleChange}
          />
          <InputField
            label="Inland Freight"
            name="inlandfreight1"
            type="number"
            value={formData.inlandfreight1}
            onChange={handleChange}
          />
          <InputField
            label="Djibouti Cost"
            name="djibouticost"
            type="number"
            value={formData.djibouticost}
            onChange={handleChange}
          />
          <InputField
            label="Other Cost"
            name="othercost1"
            type="number"
            value={formData.othercost1}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Item Details</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Item", "Unit", "Qty", "Cost", "Taxes", "DPV"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.items.map((item, index) => (
                  <ItemRow
                    key={index}
                    item={item}
                    index={index}
                    handleItemChange={handleItemChange}
                    taxOptions={taxOptions}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded text-sm"
          >
            + Add Item
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Declaration"}
        </button>
      </form>
    </div>
  );
}
