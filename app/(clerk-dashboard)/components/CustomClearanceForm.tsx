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
    alert("Form submitted! Check console for data."); // Using alert for demonstration
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Custom Clearance Agent Fee
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Company Info */}
        <div>
          <label
            htmlFor="companyName"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="companyTIN"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Company TIN
          </label>
          <input
            type="text"
            id="companyTIN"
            name="companyTIN"
            value={formData.companyTIN}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        {/* Tax Details */}
        <div>
          <label
            htmlFor="amountBeforeTax"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Amount Before Tax
          </label>
          <input
            type="number"
            id="amountBeforeTax"
            name="amountBeforeTax"
            value={formData.amountBeforeTax}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="vat"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            VAT (if applicable)
          </label>
          <input
            type="number"
            id="vat"
            name="vat"
            value={formData.vat}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        {/* Withholding Tax Applicability */}
        <div>
          <label
            htmlFor="withholdingApplicable"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Withholding Tax Applicable?
          </label>
          <select
            id="withholdingApplicable"
            name="withholdingApplicable"
            value={formData.withholdingApplicable}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none transition duration-200"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Conditional Withholding Fields */}
        {formData.withholdingApplicable === "Yes" && (
          <>
            <div>
              <label
                htmlFor="withholdingReceiptNo"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Withholding Receipt No.
              </label>
              <input
                type="text"
                id="withholdingReceiptNo"
                name="withholdingReceiptNo"
                value={formData.withholdingReceiptNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="withholdingReceiptDate"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Withholding Receipt Date
              </label>
              <input
                type="date"
                id="withholdingReceiptDate"
                name="withholdingReceiptDate"
                value={formData.withholdingReceiptDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="withholdingAmount"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Withholding Amount
              </label>
              <input
                type="number"
                id="withholdingAmount"
                name="withholdingAmount"
                value={formData.withholdingAmount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </>
        )}

        {/* Receipt Info */}
        <div>
          <label
            htmlFor="receiptNo"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Receipt No.
          </label>
          <input
            type="text"
            id="receiptNo"
            name="receiptNo"
            value={formData.receiptNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="receiptMachineNo"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Receipt Machine No.
          </label>
          <input
            type="text"
            id="receiptMachineNo"
            name="receiptMachineNo"
            value={formData.receiptMachineNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="receiptCalendar"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Receipt Calendar
          </label>
          <input
            type="text"
            id="receiptCalendar"
            name="receiptCalendar"
            value={formData.receiptCalendar}
            onChange={handleChange}
            placeholder="e.g. EC or GC"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="receiptDate"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Receipt Date
          </label>
          <input
            type="date"
            id="receiptDate"
            name="receiptDate"
            value={formData.receiptDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-10 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg"
      >
        Submit
      </button>
    </form>
  );
}
