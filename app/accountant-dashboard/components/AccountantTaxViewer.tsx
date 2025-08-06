'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, Info, X } from 'lucide-react';

// --- Type Definitions ---
interface ItemInfo {
  companyname: string;
  firstname: string;
  lastanme: string;
  hscode: string;
  itemdescription: string;
  quantity: number;
  tinnumber: string;
  unitprice: number;
  bankServicePerItem: number;
  transitorPerItem: number;
  transportFeePerItem: number | null;
  warehousePerItem: number;
}

interface Declaration {
  declarationNumber: string;
  dpvAmountPerDeclaration: number;
  dutyTax: number;
  exciseTax: number;
  grandTotalInETB: number;
  iteminfo: ItemInfo[];
  scanningFee: number;
  scanningFeeVAT: number;
  socialWelfareTax: number;
  surtax: number;
  totalBankService: number;
  totalTaxPerDeclaration: number;
  totalTransitorFee: number;
  totalTransportFee: number | null;
  totalVat: number;
  totalWareHouseFee: number;
  totalWithholding: number;
  vat: number;
  withholdingTax: number;
}

// Helper type for grouping declarations
type GroupedDeclarations = {
  [companyName: string]: Declaration[];
};

// AlertDialog Component for custom alerts
interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

function AlertDialog({ isOpen, onClose, title, message }: AlertDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden transform transition-all sm:my-8 sm:w-full">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            <Info size={24} className="text-blue-600" /> {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 text-gray-700">
          <p className="text-base leading-relaxed">{message}</p>
        </div>
        <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DeclarationList() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the custom alert dialog
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");
  
  // New state to track the selected company for detailed view
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const openAlertDialog = useCallback((title: string, message: string) => {
    setAlertDialogTitle(title);
    setAlertDialogMessage(message);
    setAlertDialogOpen(true);
  }, []);

  const closeAlertDialog = useCallback(() => {
    setAlertDialogOpen(false);
    setAlertDialogTitle("");
    setAlertDialogMessage("");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          openAlertDialog("Authentication Error", "Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch("https://customreceiptmanagement.onrender.com/api/v1/accountant/alltax", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          let errorMessage = `API request failed with status: ${res.status}`;
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = `API request failed with status: ${res.status} ${res.statusText || ""}`;
          }
          throw new Error(errorMessage);
        }

        const data: Declaration[] = await res.json();
        setDeclarations(data);
      } catch (err: any) {
        console.error("Error fetching declarations:", err);
        openAlertDialog("Fetch Error", err.message || "An unexpected error occurred while fetching declarations.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [openAlertDialog]);

  // Group declarations by company name
  const groupedDeclarations = declarations.reduce<GroupedDeclarations>((acc, dec) => {
    // Assuming companyname is on the first item in the iteminfo array
    const companyName = dec.iteminfo[0]?.companyname; 
    if (companyName) {
      if (!acc[companyName]) {
        acc[companyName] = [];
      }
      acc[companyName].push(dec);
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600 text-lg">Loading declarations...</p>
      </div>
    );
  }

  // Conditional Rendering: Display declarations for a selected company
  if (selectedCompany) {
    const declarationsForCompany = groupedDeclarations[selectedCompany] || [];
    return (
      <div className="font-sans max-w-6xl mx-auto p-8 bg-gray-100 min-h-screen">
        <button
          onClick={() => setSelectedCompany(null)}
          className="mb-8 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <ChevronLeft size={20} /> Back to Companies
        </button>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 border-b-2 border-blue-600 pb-2">
          Declarations for {selectedCompany}
        </h1>
        {declarationsForCompany.length === 0 ? (
          <p className="text-center text-gray-500 text-xl py-10">No declarations found for this company.</p>
        ) : (
          <div className="space-y-6">
            {declarationsForCompany.map((dec, index) => (
              <div
                key={`${dec.declarationNumber}-${index}`}
                className="bg-white rounded-xl shadow-md p-6 lg:p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-700">Declaration #{dec.declarationNumber}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-gray-700 text-base">
                  <p><strong className="text-gray-900">HS Code:</strong> {dec.iteminfo[0]?.hscode}</p>
                  <p><strong className="text-gray-900">Item:</strong> {dec.iteminfo[0]?.itemdescription}</p>
                  <p><strong className="text-gray-900">Quantity:</strong> {dec.iteminfo[0]?.quantity}</p>
                  <p><strong className="text-gray-900">Unit Price:</strong> {dec.iteminfo[0]?.unitprice.toLocaleString()}</p>
                  <p><strong className="text-gray-900">TIN Number:</strong> {dec.iteminfo[0]?.tinnumber}</p>
                  <p><strong className="text-gray-900">DPV Amount:</strong> {dec.dpvAmountPerDeclaration.toLocaleString()}</p>
                  <p><strong className="text-gray-900">Duty Tax:</strong> {dec.dutyTax.toLocaleString()}</p>
                  <p><strong className="text-gray-900">Excise Tax:</strong> {dec.exciseTax.toLocaleString()}</p>
                  <p><strong className="text-gray-900">Scanning Fee:</strong> {dec.scanningFee.toLocaleString()}</p>
                  <p><strong className="text-gray-900">Scanning Fee VAT:</strong> {dec.scanningFeeVAT.toLocaleString()}</p>
                  <p><strong className="text-gray-900">Social Welfare Tax:</strong> {dec.socialWelfareTax.toLocaleString()}</p>
                  <p><strong className="text-gray-900">Surtax:</strong> {dec.surtax.toLocaleString()}</p>
                  <p><strong className="text-gray-900">VAT:</strong> {dec.vat.toLocaleString()}</p>
                  <p><strong className="text-gray-900">Withholding Tax:</strong> {dec.withholdingTax.toLocaleString()}</p>
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xl font-extrabold text-blue-700">
                      Total Tax: {dec.totalTaxPerDeclaration.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default view: Display a list of companies
  return (
    <div className="font-sans max-w-4xl mx-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-gray-900">
        Declarations by Company 🏢
      </h1>
      {Object.entries(groupedDeclarations).length === 0 ? (
        <p className="text-center text-gray-500 text-xl py-10">No companies with declarations available.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedDeclarations).map(([companyName, declarationsForCompany]) => (
            <div
              key={companyName}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-center border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{companyName}</h2>
                <p className="text-gray-600 text-sm">{declarationsForCompany.length} declaration(s)</p>
              </div>
              <button
                onClick={() => setSelectedCompany(companyName)}
                className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md"
              >
                View Declarations
              </button>
            </div>
          ))}
        </div>
      )}
      <AlertDialog
        isOpen={alertDialogOpen}
        onClose={closeAlertDialog}
        title={alertDialogTitle}
        message={alertDialogMessage}
      />
    </div>
  );
}