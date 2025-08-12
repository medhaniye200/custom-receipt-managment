"use client";
import { useState, FormEvent, ChangeEvent } from "react";

interface CommercialInvoicePayload {
  commertialDate: string;
  invoiceno: string;
  amountcommercialinvoce: number;
}

export default function CommercialInvoiceForm() {
  const [formData, setFormData] = useState<CommercialInvoicePayload>({
    commertialDate: "",
    invoiceno: "",
    amountcommercialinvoce: 0,
  });

  const [declarationnumber, setDeclarationNumber] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name === "declarationnumber") {
      setDeclarationNumber(value);
      if (isDuplicate) {
        setIsDuplicate(false);
        e.target.classList.remove("border-red-500", "ring-2", "ring-red-200");
      }
    } else {
      const processedValue = type === "number" ? (value === "" ? 0 : parseFloat(value)) : value;
      setFormData(prev => ({
        ...prev,
        [name]: processedValue,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsDuplicate(false);
    
    if (!declarationnumber) {
      setMessage("Declaration number is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication error: Please log in again. ❌");
      return;
    }

    try {
      const response = await fetch(
        `https://customreceiptmanagement.onrender.com/api/v1/clerk/commercialinvoice/${declarationnumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textData = await response.text();
        data = { message: textData };
      }

      if (!response.ok) {
        if (response.status === 409 || data.message?.toLowerCase().includes("already exists")) {
          setMessage("This declaration number already exists. Please use a different one. ❌");
          setIsDuplicate(true);
          const input = document.getElementById("declarationnumber");
          input?.classList.add("border-red-500", "ring-2", "ring-red-200");
          return;
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setMessage(data.message || "Commercial invoice submitted successfully! ✅");
      setFormSubmitted(true);

      // Reset form
      setFormData({
        commertialDate: "",
        invoiceno: "",
        amountcommercialinvoce: 0,
      });
      setDeclarationNumber("");

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit data. Please try again. ❌"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white p-6 rounded shadow">
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {!formSubmitted ? (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Commercial Invoice
            </h2>

            {/* Declaration Number */}
            <div className="mb-4">
              <label htmlFor="declarationnumber" className="block font-medium mb-1">
                Declaration Number
              </label>
              <input
                type="text"
                id="declarationnumber"
                name="declarationnumber"
                value={declarationnumber}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isDuplicate ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
                }`}
                placeholder="D123456"
                required
              />
            </div>

            {/* Commercial Date */}
            <div className="mb-4">
              <label htmlFor="commertialDate" className="block font-medium mb-1">
                Commercial Date
              </label>
              <input
                type="date"
                id="commertialDate"
                name="commertialDate"
                value={formData.commertialDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Invoice Number */}
            <div className="mb-4">
              <label htmlFor="invoiceno" className="block font-medium mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                id="invoiceno"
                name="invoiceno"
                value={formData.invoiceno}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Commercial Invoice Amount */}
            <div className="mb-6">
              <label htmlFor="amountcommercialinvoce" className="block font-medium mb-1">
                Commercial Invoice Amount
              </label>
              <input
                type="number"
                id="amountcommercialinvoce"
                name="amountcommercialinvoce"
                value={formData.amountcommercialinvoce || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              ✅ Form Submitted Successfully!
            </h2>
            <button
              onClick={() => {
                setFormSubmitted(false);
                setMessage(null);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}