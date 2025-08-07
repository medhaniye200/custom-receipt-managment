"use client";

import { useState, FormEvent, ChangeEvent } from "react";

// Define the expected structure for the POST request payload for Receipt
interface ReceiptPayload {
  receiptnumber: string;
  receiptdate: string;
  receiptmachinenumber: string;
  receiptcalendar: string;
  withholdingtaxreceiptno: string;
  withholdingtaxReceiptdate: string;
  withholdingamount: number;
  amountbeforetax: number;
}

export default function CustomClearanceForm() {
  // Initialize formData with the EXACT backend fields for Receipt
  const [formData, setFormData] = useState<ReceiptPayload>({
    receiptnumber: "",
    receiptdate: "",
    receiptmachinenumber: "",
    receiptcalendar: "",
    withholdingtaxreceiptno: "",
    withholdingtaxReceiptdate: "",
    withholdingamount: 0,
    amountbeforetax: 0,
  });

  // State for frontend UI control (withholding tax applicability)
  const [isWithholdingTaxApplicable, setIsWithholdingTaxApplicable] = useState<boolean>(false);

  const [message, setMessage] = useState<string | null>(null); // For user feedback
  // NEW STATE: To control form visibility after successful submission
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "isWithholdingTaxApplicable") {
      // Handle the boolean state for withholding tax applicability
      const isApplicable = value === "Yes";
      setIsWithholdingTaxApplicable(isApplicable);
      // If withholding is not applicable, reset the related formData fields
      if (!isApplicable) {
        setFormData((prev) => ({
          ...prev,
          withholdingtaxreceiptno: "",
          withholdingtaxReceiptdate: "",
          withholdingamount: 0,
        }));
      }
    } else {
      // For number inputs, parse the value to a float. If the value is an empty string, set it to 0.
      // For other types, use the string value directly.
      const processedValue = type === "number" ? (value === "" ? 0 : parseFloat(value)) : value;
      setFormData((prev) => ({ ...prev, [name]: processedValue }));
    }
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

    // The payload directly uses the formData which now matches backend field names
    const payload: ReceiptPayload = formData;

    try {
      // Construct the API URL dynamically with the userId
      const apiUrl = `https://customreceiptmanagement.onrender.com/api/v1/clerk/receipt/${userId}`;

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
        setMessage(data.message || "Receipt details submitted successfully! ✅");
      } else {
        // If not JSON, assume it's plain text and read it
        const successText = await response.text();
        console.log("Success (Text):", successText);
        setMessage(successText || "Receipt details submitted successfully! ✅");
      }

      // Set isSubmitted to true to hide the form and show the success message
      setIsSubmitted(true);

      // No need to reset formData here if the form is being hidden
      // setFormData({ ... });
      // setIsWithholdingTaxApplicable(false); // Reset UI state as well

    } catch (error) {
      console.error("Error submitting receipt data:", error);
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
        receiptnumber: "",
        receiptdate: "",
        receiptmachinenumber: "",
        receiptcalendar: "",
        withholdingtaxreceiptno: "",
        withholdingtaxReceiptdate: "",
        withholdingamount: 0,
        amountbeforetax: 0,
      });
      setIsWithholdingTaxApplicable(false); // Reset UI state as well
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Conditional Rendering: Show success message or the form */}
      {isSubmitted ? (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-xl border border-gray-200">
          <h2 className="text-3xl font-extrabold text-green-600 mb-4">Submission Successful! 🎉</h2>
          <p className="text-gray-700 text-lg">Your custom clearance receipt details have been successfully recorded.</p>
          <button
            onClick={() => {
              setIsSubmitted(false); // Allow submitting another form
              setMessage(null); // Clear message
              setFormData({ // Reset form data for a new submission
                receiptnumber: "",
                receiptdate: "",
                receiptmachinenumber: "",
                receiptcalendar: "",
                withholdingtaxreceiptno: "",
                withholdingtaxReceiptdate: "",
                withholdingamount: 0,
                amountbeforetax: 0,
              });
              setIsWithholdingTaxApplicable(false); // Reset UI state as well
            }}
            className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg"
          >
            Submit Another Form
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Custom Clearance Agent Fee (Receipt)
          </h2>
          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Amount Before Tax */}
            <div>
              <label
                htmlFor="amountbeforetax"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Amount Before Tax
              </label>
              <input
                type="number"
                id="amountbeforetax"
                name="amountbeforetax"
                value={formData.amountbeforetax === 0 ? "" : formData.amountbeforetax} // Display empty if 0 for better UX
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Withholding Tax Applicability (Frontend UI Control) */}
            <div>
              <label
                htmlFor="isWithholdingTaxApplicable"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Withholding Tax Applicable?
              </label>
              <select
                id="isWithholdingTaxApplicable"
                name="isWithholdingTaxApplicable" // This name is for the UI state, not backend payload
                value={isWithholdingTaxApplicable ? "Yes" : "No"}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none transition duration-200"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* Conditional Withholding Fields (Backend Fields) */}
            {isWithholdingTaxApplicable && (
              <>
                <div>
                  <label
                    htmlFor="withholdingamount"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Withholding Amount
                  </label>
                  <input
                    type="number"
                    id="withholdingamount"
                    name="withholdingamount"
                    value={formData.withholdingamount === 0 ? "" : formData.withholdingamount} // Display empty if 0 for better UX
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required={isWithholdingTaxApplicable} // Make required if applicable
                  />
                </div>

                <div>
                  <label
                    htmlFor="withholdingtaxreceiptno"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Withholding Tax Receipt No.
                  </label>
                  <input
                    type="text"
                    id="withholdingtaxreceiptno"
                    name="withholdingtaxreceiptno"
                    value={formData.withholdingtaxreceiptno}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required={isWithholdingTaxApplicable}
                  />
                </div>

                <div>
                  <label
                    htmlFor="withholdingtaxReceiptdate"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Withholding Tax Receipt Date
                  </label>
                  <input
                    type="date"
                    id="withholdingtaxReceiptdate"
                    name="withholdingtaxReceiptdate"
                    value={formData.withholdingtaxReceiptdate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required={isWithholdingTaxApplicable}
                  />
                </div>
              </>
            )}

            {/* Receipt Info */}
            <div>
              <label
                htmlFor="receiptnumber"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Receipt Number
              </label>
              <input
                type="text"
                id="receiptnumber"
                name="receiptnumber"
                value={formData.receiptnumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="receiptmachinenumber"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Receipt Machine Number
              </label>
              <input
                type="text"
                id="receiptmachinenumber"
                name="receiptmachinenumber"
                value={formData.receiptmachinenumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="receiptcalendar"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Receipt Calendar
              </label>
              <input
                type="text"
                id="receiptcalendar"
                name="receiptcalendar"
                value={formData.receiptcalendar}
                onChange={handleChange}
                placeholder="e.g. EC or GC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="receiptdate"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Receipt Date
              </label>
              <input
                type="date"
                id="receiptdate"
                name="receiptdate"
                value={formData.receiptdate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
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
      )}
    </div>
  );
}
