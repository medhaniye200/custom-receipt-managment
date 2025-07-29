"use client";

import { useState } from "react";

export default function CommercialInvoiceForm() {
  const [formData, setFormData] = useState({
    invoiceDate: "",
    invoiceNo: "",
    invoiceAmount: "",
    serviceType: "",
    serviceAmount: "",
    serviceDate: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Commercial Invoice:", formData);
    // TODO: Send to API
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-700">Commercial Invoice</h2>

      <div>
        <label className="block text-gray-600 mb-1">Invoice Date</label>
        <input
          type="date"
          name="invoiceDate"
          value={formData.invoiceDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-600 mb-1">Invoice No.</label>
        <input
          type="text"
          name="invoiceNo"
          value={formData.invoiceNo}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-600 mb-1">Invoice Amount</label>
        <input
          type="number"
          name="invoiceAmount"
          value={formData.invoiceAmount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-600 mb-1">Service Type</label>
        <input
          type="text"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="e.g. Transportation, Warehousing"
        />
      </div>

      <div>
        <label className="block text-gray-600 mb-1">Service Amount</label>
        <input
          type="number"
          name="serviceAmount"
          value={formData.serviceAmount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-600 mb-1">Service Date</label>
        <input
          type="date"
          name="serviceDate"
          value={formData.serviceDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
