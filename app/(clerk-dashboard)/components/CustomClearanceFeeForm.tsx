"use client";

import { useState } from "react";

export default function CustomClearanceFeeForm() {
  const [formData, setFormData] = useState({
    companyName: "", // from seller profile
    companyTIN: "",  // from seller profile
    amountBeforeTax: "",
    vatApplicable: false,
    vatAmount: "",
    withholdingTaxApplicable: false,
    withholdingReceiptNo: "",
    withholdingReceiptDate: "",
    withholdingAmount: "",
    receiptNo: "",
    receiptMachineNo: "",
    receiptCalendar: "Gregorian",
    receiptDate: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // You can send formData to your backend API here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold mb-4">Custom Clearance Agent Fee</h2>

      <div>
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="input"
          placeholder="Fetched from seller profile"
        />
      </div>

      <div>
        <label>Company TIN</label>
        <input
          type="text"
          name="companyTIN"
          value={formData.companyTIN}
          onChange={handleChange}
          className="input"
          placeholder="Fetched from seller profile"
        />
      </div>

      <div>
        <label>Amount Before Tax</label>
        <input
          type="number"
          name="amountBeforeTax"
          value={formData.amountBeforeTax}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="vatApplicable"
          checked={formData.vatApplicable}
          onChange={handleChange}
        />
        <label>VAT Applicable?</label>
      </div>

      {formData.vatApplicable && (
        <div>
          <label>VAT Amount</label>
          <input
            type="number"
            name="vatAmount"
            value={formData.vatAmount}
            onChange={handleChange}
            className="input"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="withholdingTaxApplicable"
          checked={formData.withholdingTaxApplicable}
          onChange={handleChange}
        />
        <label>Withholding Tax Applicable?</label>
      </div>

      {formData.withholdingTaxApplicable && (
        <>
          <div>
            <label>Withholding Receipt No.</label>
            <input
              type="text"
              name="withholdingReceiptNo"
              value={formData.withholdingReceiptNo}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label>Withholding Receipt Date</label>
            <input
              type="date"
              name="withholdingReceiptDate"
              value={formData.withholdingReceiptDate}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label>Withholding Amount</label>
            <input
              type="number"
              name="withholdingAmount"
              value={formData.withholdingAmount}
              onChange={handleChange}
              className="input"
            />
          </div>
        </>
      )}

      <div>
        <label>Receipt No.</label>
        <input
          type="text"
          name="receiptNo"
          value={formData.receiptNo}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Receipt Machine No.</label>
        <input
          type="text"
          name="receiptMachineNo"
          value={formData.receiptMachineNo}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Receipt Calendar</label>
        <select
          name="receiptCalendar"
          value={formData.receiptCalendar}
          onChange={handleChange}
          className="input"
        >
          <option value="Gregorian">Gregorian</option>
          <option value="Ethiopian">Ethiopian</option>
        </select>
      </div>

      <div>
        <label>Receipt Date</label>
        <input
          type="date"
          name="receiptDate"
          value={formData.receiptDate}
          onChange={handleChange}
          className="input"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}
