"use client";
<<<<<<< HEAD

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
=======
import { useState } from "react";
import { useRouter } from 'next/navigation';


// Type definitions
type TaxDto = {
  name: string;
  value: number;
  codename: string;
};

type ItemManagementDto = {
  hscode: string;
  itemdescription: string;
  unitofmeasurement: string;
  quantity: number;
  unitCost: number;
  taxApplicationdto: TaxDto[];
>>>>>>> 4493575 ( update message here)
};

type FormData = {
  custombranchname: string;
  declarationnumber: string;
  declarationdispensedate: string;
<<<<<<< HEAD
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
=======
  fobamountusdt: number;
  exchangerate: number;
  externalfreight: number;
  insuranceCost: number;
  inlandfreight1: number;
  djibouticost: number;
  othercost1: number;
  itemManagementdto: ItemManagementDto[];
};

const TAX_OPTIONS = [
  { name: "VAT", value: 15.0, codename: "VAT15" },
  { name: "Excise Tax", value: 10.0, codename: "EXC10" },
  { name: "Withholding Tax", value: 2.0, codename: "WHT2" },
  { name: "Customs Duty", value: 5.0, codename: "CUSD5" },
];

>>>>>>> 4493575 ( update message here)
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
<<<<<<< HEAD
=======
  required = true,
>>>>>>> 4493575 ( update message here)
}: {
  label: string;
  name: string;
  type?: string;
<<<<<<< HEAD
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
=======
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
>>>>>>> 4493575 ( update message here)
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
<<<<<<< HEAD
        required
=======
        required={required}
>>>>>>> 4493575 ( update message here)
      />
    </div>
  );
}

<<<<<<< HEAD
// ItemRow Component
=======
>>>>>>> 4493575 ( update message here)
function ItemRow({
  item,
  index,
  handleItemChange,
<<<<<<< HEAD
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
=======
  handleTaxChange,
  addItemTax,
  removeItemTax,
  removeItem,
}: {
  item: ItemManagementDto;
  index: number;
  handleItemChange: (index: number, field: keyof Omit<ItemManagementDto, 'taxes'>, value: any) => void;
  handleTaxChange: (itemIndex: number, taxIndex: number, field: keyof TaxDto, value: any) => void;
  addItemTax: (itemIndex: number) => void;
  removeItemTax: (itemIndex: number, taxIndex: number) => void;
  removeItem: (index: number) => void;
}) {
  const handleTaxSelect = (itemIndex: number, taxIndex: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTax = TAX_OPTIONS.find(opt => opt.name === e.target.value);
    if (selectedTax) {
      handleTaxChange(itemIndex, taxIndex, "name", selectedTax.name);
      handleTaxChange(itemIndex, taxIndex, "value", selectedTax.value);
      handleTaxChange(itemIndex, taxIndex, "codename", selectedTax.codename);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-2 py-1 border border-gray-200">
          <input
            type="text"
            value={item.hscode}
            onChange={(e) => handleItemChange(index, "hscode", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            required
          />
        </td>
        <td className="px-2 py-1 border border-gray-200">
          <input
            type="text"
            value={item.itemdescription}
            onChange={(e) => handleItemChange(index, "itemdescription", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            required
          />
        </td>
        <td className="px-2 py-1 border border-gray-200">
          <input
            type="text"
            value={item.unitofmeasurement}
            onChange={(e) => handleItemChange(index, "unitofmeasurement", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            required
          />
        </td>
        <td className="px-2 py-1 border border-gray-200">
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            required
            min="1"
          />
        </td>
        <td className="px-2 py-1 border border-gray-200">
          <input
            type="number"
            value={item.unitCost}
            onChange={(e) => handleItemChange(index, "unitCost", Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            required
            min="0"
            step="0.01"
          />
        </td>
        <td className="px-2 py-1 border border-gray-200">
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-600 hover:text-red-800 text-xs"
          >
            Remove
          </button>
        </td>
      </tr>

      {item.taxApplicationdto.map((tax, taxIndex) => (
        <tr key={`tax-${index}-${taxIndex}`} className="hover:bg-gray-50 bg-gray-50">
          <td colSpan={2} className="px-2 py-1 border border-gray-200 text-xs">
            Tax #{taxIndex + 1}
          </td>
          <td className="px-2 py-1 border border-gray-200">
            <select
              value={tax.name}
              onChange={(e) => handleTaxSelect(index, taxIndex, e)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              required
            >
              <option value="">Select Tax</option>
              {TAX_OPTIONS.map((option) => (
                <option key={option.codename} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </td>
          <td className="px-2 py-1 border border-gray-200">
            <input
              type="number"
              value={tax.value}
              onChange={(e) => handleTaxChange(index, taxIndex, "value", Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              required
              min="0"
              step="0.01"
              readOnly
            />
          </td>
          <td className="px-2 py-1 border border-gray-200">
            <input
              type="text"
              value={tax.codename}
              onChange={(e) => handleTaxChange(index, taxIndex, "codename", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
              required
              readOnly
            />
          </td>
          <td className="px-2 py-1 border border-gray-200">
            <button
              type="button"
              onClick={() => removeItemTax(index, taxIndex)}
              className="text-red-600 hover:text-red-800 text-xs"
            >
              Remove
            </button>
          </td>
        </tr>
      ))}

      <tr>
        <td colSpan={6} className="px-2 py-1 border border-gray-200">
          <button
            type="button"
            onClick={() => addItemTax(index)}
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            + Add Tax to this Item
          </button>
        </td>
      </tr>
    </>
  );
}

export default function DeclarationForm() {
  const router = useRouter();
>>>>>>> 4493575 ( update message here)
  const [formData, setFormData] = useState<FormData>({
    custombranchname: "",
    declarationnumber: "",
    declarationdispensedate: "",
<<<<<<< HEAD
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
=======
    fobamountusdt: 0,
    exchangerate: 0,
    externalfreight: 0,
    insuranceCost: 0,
    inlandfreight1: 0,
    djibouticost: 0,
    othercost1: 0,
    itemManagementdto: [],
>>>>>>> 4493575 ( update message here)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
<<<<<<< HEAD
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
=======
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("amount") || name.includes("Cost") || name.includes("rate") 
        ? Number(value) 
        : value
    });
  };

  const handleItemChange = (index: number, field: keyof Omit<ItemManagementDto, 'taxes'>, value: any) => {
    const newItems = [...formData.itemManagementdto];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, itemManagementdto: newItems });
  };

  const handleTaxChange = (itemIndex: number, taxIndex: number, field: keyof TaxDto, value: any) => {
    const newItems = [...formData.itemManagementdto];
    newItems[itemIndex].taxApplicationdto[taxIndex] = { 
      ...newItems[itemIndex].taxApplicationdto[taxIndex], 
      [field]: value 
    };
    setFormData({ ...formData, itemManagementdto: newItems });
>>>>>>> 4493575 ( update message here)
  };

  const addItem = () => {
    setFormData({
      ...formData,
<<<<<<< HEAD
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
=======
      itemManagementdto: [
        ...formData.itemManagementdto,
        {
          hscode: "",
          itemdescription: "",
          unitofmeasurement: "",
          quantity: 1,
          unitCost: 0,
          taxApplicationdto: [],
>>>>>>> 4493575 ( update message here)
        },
      ],
    });
  };

<<<<<<< HEAD
=======
  const addItemTax = (itemIndex: number) => {
    const newItems = [...formData.itemManagementdto];
    newItems[itemIndex].taxApplicationdto.push({
      name: "",
      value: 0,
      codename: "",
    });
    setFormData({ ...formData, itemManagementdto: newItems });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      itemManagementdto: formData.itemManagementdto.filter((_, i) => i !== index),
    });
  };

  const removeItemTax = (itemIndex: number, taxIndex: number) => {
    const newItems = [...formData.itemManagementdto];
    newItems[itemIndex].taxApplicationdto = newItems[itemIndex].taxApplicationdto.filter((_, i) => i !== taxIndex);
    setFormData({ ...formData, itemManagementdto: newItems });
  };

  const validateForm = () => {
    if (!formData.custombranchname) {
      throw new Error("Branch name is required");
    }
    if (!formData.declarationnumber) {
      throw new Error("Declaration number is required");
    }
    if (!formData.declarationdispensedate) {
      throw new Error("Declaration date is required");
    }
    if (formData.itemManagementdto.length === 0) {
      throw new Error("At least one item is required");
    }
    
    formData.itemManagementdto.forEach((item, index) => {
      if (!item.hscode) {
        throw new Error(`HS Code is required for item ${index + 1}`);
      }
      if (!item.itemdescription) {
        throw new Error(`Description is required for item ${index + 1}`);
      }
      if (item.quantity <= 0) {
        throw new Error(`Quantity must be greater than 0 for item ${index + 1}`);
      }
      if (item.unitCost < 0) {
        throw new Error(`Unit cost cannot be negative for item ${index + 1}`);
      }
    });
  };

>>>>>>> 4493575 ( update message here)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
<<<<<<< HEAD
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");

=======
      // Validate form before submission
      validateForm();

      // Verify authentication
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");

      if (!token || !userId) {
        throw new Error("Session expired. Please log in again.");
      }

      if (!roles.includes("CLERK")) {
        throw new Error("You don't have permission to submit declarations.");
      }

      // Prepare submission data
      const submissionData = {
        custombranchname: formData.custombranchname,
        declarationnumber: formData.declarationnumber,
        declarationdispensedate: formData.declarationdispensedate,
        fobamountusdt: Number(formData.fobamountusdt),
        exchangerate: Number(formData.exchangerate),
        externalfreight: Number(formData.externalfreight),
        insuranceCost: Number(formData.insuranceCost),
        inlandfreight1: Number(formData.inlandfreight1),
        djibouticost: Number(formData.djibouticost),
        othercost1: Number(formData.othercost1),
        itemManagementdto: formData.itemManagementdto.map(item => ({
          hscode: item.hscode,
          itemdescription: item.itemdescription,
          unitofmeasurement: item.unitofmeasurement,
          quantity: Number(item.quantity),
          unitCost: Number(item.unitCost),
          taxApplicationdto: item.taxApplicationdto.map(tax => ({
            name: tax.name,
            value: Number(tax.value),
            codename: tax.codename
          }))
        }))
      };

      console.log("Request payload:", submissionData);

      // Make API request
>>>>>>> 4493575 ( update message here)
      const response = await fetch(
        `https://customreceiptmanagement.onrender.com/api/v1/clerk/declarationInfo/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
<<<<<<< HEAD
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
=======
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(submissionData)
        }
      );

      // Handle response
      const responseText = await response.text();
      let responseBody;
      
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        responseBody = responseText;
      }

      if (!response.ok) {
        console.error("API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          body: responseBody
        });

        let errorMessage = "Submission failed";
        if (response.status === 403) {
          errorMessage = "Access denied. Please verify your permissions.";
        } else if (typeof responseBody === 'object' && responseBody.message) {
          errorMessage = responseBody.message;
        } else if (typeof responseBody === 'string') {
          errorMessage = responseBody;
        } else {
          errorMessage = `${errorMessage} (Status: ${response.status})`;
        }

        throw new Error(errorMessage);
      }

      // Success case
      alert("Declaration submitted successfully!");
      console.log("API Response:", responseBody);

      // Reset form
>>>>>>> 4493575 ( update message here)
      setFormData({
        custombranchname: "",
        declarationnumber: "",
        declarationdispensedate: "",
<<<<<<< HEAD
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
=======
        fobamountusdt: 0,
        exchangerate: 0,
        externalfreight: 0,
        insuranceCost: 0,
        inlandfreight1: 0,
        djibouticost: 0,
        othercost1: 0,
        itemManagementdto: [],
      });

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
      
      if (err.message.includes("expired") || err.message.includes("permission")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("roles");
        router.push("/companies");
      }
>>>>>>> 4493575 ( update message here)
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const taxOptions = [
    { label: "Custom Duty Tax (01)", value: "01" },
    { label: "Custom Excise Tax (03)", value: "03" },
    { label: "Custom VAT (04)", value: "04" },
    { label: "Custom Surtax (05)", value: "05" },
    { label: "Custom Withholding Tax (15)", value: "15" },
    { label: "Custom Social Warfare (12)", value: "12" },
    { label: "Custom Scanning Fee (16)", value: "16" },
  ];

=======
>>>>>>> 4493575 ( update message here)
  return (
    <div className="w-full max-w-[100vw] px-2 md:px-4 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto bg-white rounded-lg p-4 md:p-6 space-y-6"
      >
        <h2 className="text-lg md:text-xl font-semibold text-center">
          Custom Declaration Form
        </h2>

<<<<<<< HEAD
        {error && <p className="text-red-600 text-center text-sm">{error}</p>}
=======
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
>>>>>>> 4493575 ( update message here)

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Branch Name"
            name="custombranchname"
            value={formData.custombranchname}
            onChange={handleChange}
          />
          <InputField
<<<<<<< HEAD
            label="Decl. Number"
=======
            label="Declaration Number"
>>>>>>> 4493575 ( update message here)
            name="declarationnumber"
            value={formData.declarationnumber}
            onChange={handleChange}
          />
          <InputField
<<<<<<< HEAD
            label="Decl. Date"
=======
            label="Declaration Date"
>>>>>>> 4493575 ( update message here)
            name="declarationdispensedate"
            type="date"
            value={formData.declarationdispensedate}
            onChange={handleChange}
          />
          <InputField
            label="FOB Amount"
<<<<<<< HEAD
            name="fobamount"
            type="number"
            value={formData.fobamount}
=======
            name="fobamountusdt"
            type="number"
            value={formData.fobamountusdt}
>>>>>>> 4493575 ( update message here)
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
<<<<<<< HEAD
            label="Ext. Freight"
=======
            label="External Freight"
>>>>>>> 4493575 ( update message here)
            name="externalfreight"
            type="number"
            value={formData.externalfreight}
            onChange={handleChange}
          />
          <InputField
<<<<<<< HEAD
            label="Insurance"
=======
            label="Insurance Cost"
>>>>>>> 4493575 ( update message here)
            name="insuranceCost"
            type="number"
            value={formData.insuranceCost}
            onChange={handleChange}
          />
          <InputField
            label="Inland Freight"
            name="inlandfreight1"
<<<<<<< HEAD
            type="number"
=======
>>>>>>> 4493575 ( update message here)
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
<<<<<<< HEAD
            type="number"
=======
>>>>>>> 4493575 ( update message here)
            value={formData.othercost1}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
<<<<<<< HEAD
          <h3 className="text-md font-semibold mb-2">Item Details</h3>
=======
          <h3 className="text-md font-semibold mb-2">Items with Taxes</h3>
>>>>>>> 4493575 ( update message here)
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
<<<<<<< HEAD
                  {["Item", "Unit", "Qty", "Cost", "Taxes", "DPV"].map(
=======
                  {["HS Code", "Description", "Unit measurement", "Quantity", "Unit Cost", "Action"].map(
>>>>>>> 4493575 ( update message here)
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
<<<<<<< HEAD
                {formData.items.map((item, index) => (
=======
                {formData.itemManagementdto.map((item, index) => (
>>>>>>> 4493575 ( update message here)
                  <ItemRow
                    key={index}
                    item={item}
                    index={index}
                    handleItemChange={handleItemChange}
<<<<<<< HEAD
                    taxOptions={taxOptions}
=======
                    handleTaxChange={handleTaxChange}
                    addItemTax={addItemTax}
                    removeItemTax={removeItemTax}
                    removeItem={removeItem}
>>>>>>> 4493575 ( update message here)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 4493575 ( update message here)
