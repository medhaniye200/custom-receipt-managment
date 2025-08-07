"use client";

import { useState, FormEvent, ChangeEvent } from "react";

// Define the expected structure for the POST request payload for Commercial Invoice
interface CommercialInvoicePayload {
  commertialDate: string;
  invoiceno: string;
  amountcommercialinvoce: number;
}

export default function CommercialInvoiceForm() {
  // Initialize formData with the new backend fields for Commercial Invoice
  const [formData, setFormData] = useState<CommercialInvoicePayload>({
    commertialDate: "",
    invoiceno: "",
    amountcommercialinvoce: 0,
  });

  const [message, setMessage] = useState<string | null>(null); // For user feedback
  // NEW STATE: To control form visibility after successful submission
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    // For number inputs, parse the value to a float. If the value is an empty string, set it to 0.
    const processedValue = type === "number" ? (value === "" ? 0 : parseFloat(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    // Get userId and the authentication token from localStorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Assuming the token is stored under the key 'token'

    // Check if both userId and token exist
    if (!userId || !token) {
      console.error("User ID or token not found in local storage. Cannot submit form.");
      setMessage("Authentication error: User ID or token is missing. Please log in again. ❌");
      return;
    }

    const payload: CommercialInvoicePayload = formData;

    try {
      // Construct the API URL dynamically with the userId
      const apiUrl = `https://customreceiptmanagement.onrender.com/api/v1/clerk/commercialinvoice/${userId}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add the Authorization header with the token
          "Authorization": `Bearer ${token}`,
        },
        // Stringify the payload object before sending
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Error handling: Check if the response is JSON before attempting to parse it
        const contentType = response.headers.get("content-type");
        let errorMessage = `HTTP error! status: ${response.status}`;

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          // If not JSON, try to read as text or use statusText
          const errorText = await response.text();
          errorMessage = errorText || response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Success handling: Check if the response is JSON or plain text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Success (JSON):", data);
        setMessage(data.message || "Commercial invoice details submitted successfully! ✅");
      } else {
        // If not JSON, assume it's plain text and read it
        const successText = await response.text();
        console.log("Success (Text):", successText);
        setMessage(successText || "Commercial invoice details submitted successfully! ✅");
      }

      // Set isSubmitted to true to hide the form and show the success message
      setIsSubmitted(true);

      // No need to reset formData here if the form is being hidden
      // setFormData({ ... });

    } catch (error) {
      console.error("Error submitting commercial invoice data:", error);
      // Enhanced error handling for network-related issues
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setMessage("Network error: Could not connect to the server. Please check your internet connection or try again later. This might also be a CORS issue. ❌");
      } else if (error instanceof Error) {
        setMessage(`Failed to submit data. Error: ${error.message} ❌`);
      } else {
        setMessage("Failed to submit data. An unknown error occurred. ❌");
      }
      // Reset the form data on error to allow the user to try again
      setFormData({
        commertialDate: "",
        invoiceno: "",
        amountcommercialinvoce: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Conditional Rendering: Show success message or the form */}
      {isSubmitted ? (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-xl border border-gray-200">
          <h2 className="text-3xl font-extrabold text-green-600 mb-4">Submission Successful! 🎉</h2>
          <p className="text-gray-700 text-lg">Your commercial invoice details have been successfully recorded.</p>
          <button
            onClick={() => {
              setIsSubmitted(false); // Allow submitting another form
              setMessage(null); // Clear message
              setFormData({ // Reset form data for a new submission
                commertialDate: "",
                invoiceno: "",
                amountcommercialinvoce: 0,
              });
            }}
            className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg"
          >
            Submit Another Form
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-6 rounded shadow"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Commercial Invoice Form
          </h2>
          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* Commercial Date */}
          <div className="mb-4">
            <label htmlFor="commertialDate" className="block font-medium mb-1">Commercial Date</label>
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
            <label htmlFor="invoiceno" className="block font-medium mb-1">Invoice Number</label>
            <input
              type="text"
              id="invoiceno"
              name="invoiceno"
              value={formData.invoiceno}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., INV-2023-001"
              required
            />
          </div>

          {/* Amount Commercial Invoice */}
          <div className="mb-6">
            <label htmlFor="amountcommercialinvoce" className="block font-medium mb-1">Commercial Invoice Amount</label>
            <input
              type="number"
              id="amountcommercialinvoce"
              name="amountcommercialinvoce"
              value={formData.amountcommercialinvoce === 0 ? "" : formData.amountcommercialinvoce} // Display empty if 0 for better UX
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 12500.75"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Commercial Invoice Details
          </button>
        </form>
      )}
    </div>
  );
}
