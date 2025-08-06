'use client';

import React, { useState } from 'react';

// Type definition for the data structure you expect from the API.
// This is an example; you should adjust it to match your API's actual response.
interface ReceiptData {
  declaration_number: string;
  // Add other fields you expect to receive, for example:
  // totalTax: number;
  // items: any[];
}

export default function MyReceiptsPage() {
  const [declarationNumber, setDeclarationNumber] = useState('');
  const [data, setData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    // Basic validation to ensure the input isn't empty
    if (!declarationNumber.trim()) {
      setError('Please enter a declaration number.');
      return;
    }

    // Reset state before making a new request
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // Retrieve the authentication token from localStorage
      const token = localStorage.getItem('token');

      // Check if a token exists
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setIsLoading(false);
        return;
      }

      // Make the POST request to the API
      const response = await fetch(
        'https://local-receipt-management-system.onrender.com/RetriveImportExportRelatedReceipts/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add the Authorization header with the token
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            // The key 'declaration_number' must match what your backend expects
            declaration_number: declarationNumber,
          }),
        }
      );

      // Check for a successful HTTP status code
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      // Parse the JSON data from the response
      const json: ReceiptData = await response.json();
      setData(json);
    } catch (e: unknown) {
      // Handle and set any errors that occurred during the fetch process
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      // Ensure loading state is turned off regardless of the outcome
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Search Receipts 🧾</h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter declaration number"
            value={declarationNumber}
            onChange={(e) => setDeclarationNumber(e.target.value)}
            className="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFetch}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Fetching...' : 'Fetch'}
          </button>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {data && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-700">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}