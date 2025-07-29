"use client";

import { useState } from "react";

export default function WarehouseFeeForm() {
  const [formData, setFormData] = useState({
    companyName: "",            // fetched from seller profile
    companyTIN: "",             // fetched from seller profile
    amountBeforeTax: "",
    vat: "",
    receiptNo: "",
    receiptMachineNo: "",
    receiptDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting warehouse fee:", formData);
    // TODO: Replace with API call to backend
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Warehouse Fee Form
        </h2>

        {/* Company Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Acme Inc."
            required
          />
        </div>

        {/* Company TIN */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Company TIN</label>
          <input
            type="text"
            name="companyTIN"
            value={formData.companyTIN}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="1234567890"
            required
          />
        </div>

        {/* Amount Before Tax */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Amount Before Tax</label>
          <input
            type="number"
            name="amountBeforeTax"
            value={formData.amountBeforeTax}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="1000.00"
            required
          />
        </div>

        {/* VAT */}
        <div className="mb-4">
          <label className="block font-medium mb-1">VAT (if applicable)</label>
          <input
            type="number"
            name="vat"
            value={formData.vat}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="150.00"
          />
        </div>

        {/* Receipt No */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Receipt No.</label>
          <input
            type="text"
            name="receiptNo"
            value={formData.receiptNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="R123456"
            required
          />
        </div>

        {/* Receipt Machine No */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Receipt Machine No.</label>
          <input
            type="text"
            name="receiptMachineNo"
            value={formData.receiptMachineNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="M98765"
            required
          />
        </div>

        {/* Receipt Date */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Receipt Date</label>
          <input
            type="date"
            name="receiptDate"
            value={formData.receiptDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
