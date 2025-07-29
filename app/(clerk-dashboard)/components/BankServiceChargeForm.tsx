"use client";

import { useState } from "react";

export default function BankServiceChargeForm() {
  const [formData, setFormData] = useState({
    bankName: "",
    bankPermitDate: "",
    bankPermitNo: "",
    bankPermitAmount: "",
    invoiceDate: "",
    invoiceNo: "",
    invoiceAmount: "",
    serviceType: "",
    serviceAmount: "",
    serviceDate: "",
    bankReference: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bank Service Charge Data:", formData);
    // TODO: POST to API
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Bank Service Charge</h2>

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

        {/* Bank Permit */}
        <div>
          <label className="block font-medium mb-1">Permit Date</label>
          <input
            type="date"
            name="bankPermitDate"
            value={formData.bankPermitDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Permit No.</label>
          <input
            type="text"
            name="bankPermitNo"
            value={formData.bankPermitNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Permit Amount</label>
          <input
            type="number"
            name="bankPermitAmount"
            value={formData.bankPermitAmount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Commercial Invoice */}
        <div>
          <label className="block font-medium mb-1">Invoice Date</label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Invoice No.</label>
          <input
            type="text"
            name="invoiceNo"
            value={formData.invoiceNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Invoice Amount</label>
          <input
            type="number"
            name="invoiceAmount"
            value={formData.invoiceAmount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Service Info */}
        <div>
          <label className="block font-medium mb-1">Service Type</label>
          <input
            type="text"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Service Amount</label>
          <input
            type="number"
            name="serviceAmount"
            value={formData.serviceAmount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Service Date</label>
          <input
            type="date"
            name="serviceDate"
            value={formData.serviceDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

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
