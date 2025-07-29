"use client";

import { useState } from "react";

export default function CustomClearanceForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyTIN: "",
    amountBeforeTax: "",
    vat: "",
    withholdingApplicable: "No",
    withholdingReceiptNo: "",
    withholdingReceiptDate: "",
    withholdingAmount: "",
    receiptNo: "",
    receiptMachineNo: "",
    receiptCalendar: "",
    receiptDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Custom Clearance Data:", formData);
    // TODO: Send data to backend API
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Custom Clearance Agent Fee</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Info */}
        <div>
          <label className="block font-medium">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Fetched from Seller Profile"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Company TIN</label>
          <input
            type="text"
            name="companyTIN"
            value={formData.companyTIN}
            onChange={handleChange}
            placeholder="Fetched from Seller Profile"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Tax Details */}
        <div>
          <label className="block font-medium">Amount Before Tax</label>
          <input
            type="number"
            name="amountBeforeTax"
            value={formData.amountBeforeTax}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">VAT (if applicable)</label>
          <input
            type="number"
            name="vat"
            value={formData.vat}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Withholding Tax Applicability */}
        <div>
          <label className="block font-medium">Withholding Tax Applicable?</label>
          <select
            name="withholdingApplicable"
            value={formData.withholdingApplicable}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Conditional Withholding Fields */}
        {formData.withholdingApplicable === "Yes" && (
          <>
            <div>
              <label className="block font-medium">Withholding Receipt No.</label>
              <input
                type="text"
                name="withholdingReceiptNo"
                value={formData.withholdingReceiptNo}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Withholding Receipt Date</label>
              <input
                type="date"
                name="withholdingReceiptDate"
                value={formData.withholdingReceiptDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Withholding Amount</label>
              <input
                type="number"
                name="withholdingAmount"
                value={formData.withholdingAmount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        {/* Receipt Info */}
        <div>
          <label className="block font-medium">Receipt No.</label>
          <input
            type="text"
            name="receiptNo"
            value={formData.receiptNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Receipt Machine No.</label>
          <input
            type="text"
            name="receiptMachineNo"
            value={formData.receiptMachineNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Receipt Calendar</label>
          <input
            type="text"
            name="receiptCalendar"
            value={formData.receiptCalendar}
            onChange={handleChange}
            placeholder="e.g. EC or GC"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Receipt Date</label>
          <input
            type="date"
            name="receiptDate"
            value={formData.receiptDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
