"use client";

import { useState } from "react";

export default function BankServiceChargeForm() {
  const [formData, setFormData] = useState({
    bankName: "", // From seller profile
    bankPermitDate: "",
    bankPermitNo: "",
    bankPermitAmount: "",
    serviceType: "",
    bankReference: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Bank Service Charge:", formData);
    // TODO: Submit to backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-3xl mx-auto bg-white shadow rounded space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Bank Service Charge</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank Name */}
        <div>
          <label className="block font-medium mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Fetched from Seller Profile"
          />
        </div>

        {/* Bank Permit Date */}
        <div>
          <label className="block font-medium mb-1">Bank Permit Date</label>
          <input
            type="date"
            name="bankPermitDate"
            value={formData.bankPermitDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Bank Permit No */}
        <div>
          <label className="block font-medium mb-1">Bank Permit No.</label>
          <input
            type="text"
            name="bankPermitNo"
            value={formData.bankPermitNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Bank Permit Amount */}
        <div>
          <label className="block font-medium mb-1">Bank Permit Amount</label>
          <input
            type="number"
            name="bankPermitAmount"
            value={formData.bankPermitAmount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Service Type */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Service Type</label>
          <input
            type="text"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g. Bank Transfer, SWIFT Fee"
          />
        </div>

        {/* Bank Reference */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Bank Reference</label>
          <input
            type="text"
            name="bankReference"
            value={formData.bankReference}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </div>
    </form>
  );
}
