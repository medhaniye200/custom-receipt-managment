"use client";

import { useState, FormEvent, ChangeEvent } from "react";

interface BankPermitPayload {
  bankdate: string;
  bankname: string;
  bankpermitdate: string;
  permitno: string;
  permitamount: number;
  bankreference: string;
  bankservice: number;
  declarationnumber: string;
}

export default function BankServiceFeeForm() {
  const [formData, setFormData] = useState<BankPermitPayload>({
    bankdate: "",
    bankname: "",
    bankpermitdate: "",
    permitno: "",
    permitamount: 0,
    bankreference: "",
    bankservice: 0,
    declarationnumber: ""
  });

  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === "number" ? parseFloat(value) : value;

    // Remove error styling when user starts typing
    if (name === "declarationnumber" && isDuplicate) {
      setIsDuplicate(false);
      e.target.classList.remove("border-red-500", "ring-2", "ring-red-200");
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsDuplicate(false);
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Authentication error: Please log in again. ❌");
      return;
    }

    try {
      const response = await fetch(
        `https://customreceiptmanagement.onrender.com/api/v1/clerk/bankInfo/${formData.declarationnumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        
        // Handle duplicate declaration number
        if (response.status === 409 || errorData?.toLowerCase().includes("already exists")) {
          setMessage("This declaration number already exists. Please use a different one. ❌");
          setIsDuplicate(true);
          const input = document.getElementById("declarationnumber");
          input?.classList.add("border-red-500", "ring-2", "ring-red-200");
          return;
        }
        
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message || "Bank permit details submitted successfully! ✅");
      setIsSubmitted(true);

    } catch (error) {
      console.error("Submission error:", error);
      
      if (error instanceof Error) {
        setMessage(
          error.message.includes("Failed to fetch") 
            ? "Network error. Please check your connection. ❌"
            : `Error: ${error.message} ❌`
        );
      } else {
        setMessage("An unknown error occurred. ❌");
      }
      
      // Only reset form if it's not a duplicate error
      if (!isDuplicate) {
        setFormData({
          bankdate: "",
          bankname: "",
          bankpermitdate: "",
          permitno: "",
          permitamount: 0,
          bankreference: "",
          bankservice: 0,
          declarationnumber: ""
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {isSubmitted ? (
        <div className="text-center p-8 bg-white rounded shadow-lg max-w-xl">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Submission Successful!
          </h2>
          <p className="text-gray-700">
            Thank you for submitting the bank permit details.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Bank Permit Details Form
          </h2>
          
          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="bankname" className="block font-medium mb-1">
                Bank Name
              </label>
              <input
                type="text"
                id="bankname"
                name="bankname"
                value={formData.bankname}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="permitno" className="block font-medium mb-1">
                Permit Number
              </label>
              <input
                type="text"
                id="permitno"
                name="permitno"
                value={formData.permitno}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="permitamount" className="block font-medium mb-1">
                Permit Amount
              </label>
              <input
                type="number"
                id="permitamount"
                name="permitamount"
                value={formData.permitamount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="bankservice" className="block font-medium mb-1">
                Bank Service Fee
              </label>
              <input
                type="number"
                id="bankservice"
                name="bankservice"
                value={formData.bankservice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="bankreference" className="block font-medium mb-1">
              Bank Reference
            </label>
            <input
              type="text"
              id="bankreference"
              name="bankreference"
              value={formData.bankreference}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="declarationnumber" className="block font-medium mb-1">
              Declaration Number
            </label>
            <input
              type="text"
              id="declarationnumber"
              name="declarationnumber"
              value={formData.declarationnumber}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                isDuplicate ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label htmlFor="bankdate" className="block font-medium mb-1">
                Bank Date
              </label>
              <input
                type="date"
                id="bankdate"
                name="bankdate"
                value={formData.bankdate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="bankpermitdate" className="block font-medium mb-1">
                Permit Date
              </label>
              <input
                type="date"
                id="bankpermitdate"
                name="bankpermitdate"
                value={formData.bankpermitdate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit 
          </button>
        </form>
      )}
    </div>
  );
}