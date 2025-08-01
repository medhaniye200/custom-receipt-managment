"use client";
import { useEffect, useState, useMemo } from "react";

// Interfaces for the API response and our processed data
interface TaxDetail {
  itemdescription: string;
  quantity: number;
  companyname: string;
  firstname: string;
  lastanme: string;
  unitprice: number;
  tinnumber: string;
  hscode: string;
  dutyTax: number;
  exciseTax: number;
  scanningFee: number;
  scanningFeeVAT: number;
  socialWelfareTax: number;
  surtax: number;
  vat: number;
  withholdingtax: number;
}

interface TaxData {
  taxDetails: TaxDetail[];
  totalPages: number;
  currentPage: number;
  totalTaxPerUser: Record<string, number>;
}

interface CompanyTaxSummary {
  companyName: string;
  tinNumber: string;
  totalVAT: number;
  totalDutyTax: number;
  totalExciseTax: number;
  totalScanningFee: number;
  totalScanningFeeVAT: number;
  totalSocialWelfareTax: number;
  totalSurtax: number;
  totalWithholdingTax: number;
  items: TaxDetail[];
}

// Reusable Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/6 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// Main Component
export default function AccountantTaxViewer() {
  const [companySummaries, setCompanySummaries] = useState<CompanyTaxSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // State to manage which company summary is expanded
  const [expandedTIN, setExpandedTIN] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://customreceiptmanagement.onrender.com/api/v1/accountant/alltax",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch tax data: ${response.status} - ${errorText}`
          );
        }

        const data: TaxData = await response.json();
        
        const companyMap = new Map<string, CompanyTaxSummary>();

        data.taxDetails.forEach((detail) => {
          const key = `${detail.companyname}|${detail.tinnumber}`;
          if (!companyMap.has(key)) {
            companyMap.set(key, {
              companyName: detail.companyname,
              tinNumber: detail.tinnumber,
              totalVAT: 0,
              totalDutyTax: 0,
              totalExciseTax: 0,
              totalScanningFee: 0,
              totalScanningFeeVAT: 0,
              totalSocialWelfareTax: 0,
              totalSurtax: 0,
              totalWithholdingTax: 0,
              items: [],
            });
          }

          const company = companyMap.get(key)!;
          company.totalVAT += detail.vat;
          company.totalDutyTax += detail.dutyTax;
          company.totalExciseTax += detail.exciseTax;
          company.totalScanningFee += detail.scanningFee;
          company.totalScanningFeeVAT += detail.scanningFeeVAT;
          company.totalSocialWelfareTax += detail.socialWelfareTax;
          company.totalSurtax += detail.surtax;
          company.totalWithholdingTax += detail.withholdingtax;
          company.items.push(detail);
        });

        setCompanySummaries(Array.from(companyMap.values()));

      } catch (err: any) {
        console.error("Error fetching tax data:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaxData();
  }, []);

  // Toggle the expanded state of a company summary
  const toggleExpand = (tinNumber: string) => {
    setExpandedTIN(expandedTIN === tinNumber ? null : tinNumber);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB', // Change to your currency code if needed
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const globalTotals = useMemo(() => {
    return companySummaries.reduce(
      (acc, summary) => {
        acc.totalVAT += summary.totalVAT;
        acc.totalDutyTax += summary.totalDutyTax;
        acc.totalExciseTax += summary.totalExciseTax;
        acc.totalWithholdingTax += summary.totalWithholdingTax;
        return acc;
      },
      {
        totalVAT: 0,
        totalDutyTax: 0,
        totalExciseTax: 0,
        totalWithholdingTax: 0,
      }
    );
  }, [companySummaries]);

  const filteredSummaries = useMemo(() => {
    if (!searchQuery) {
      return companySummaries;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return companySummaries.filter(
      (summary) =>
        summary.companyName.toLowerCase().includes(lowerCaseQuery) ||
        summary.tinNumber.toLowerCase().includes(lowerCaseQuery)
    );
  }, [companySummaries, searchQuery]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-black" >Tax Summary Dashboard</h2>

      {/* Global Summary Section */}
    

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by company name or TIN number..."
          className="w-full p-3 rounded-lg border-2 border-gray-700 bg-white-900 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Company Summaries Section */}
      {filteredSummaries.length > 0 ? (
        <div className="space-y-6">
          {filteredSummaries.map((summary) => (
            <div key={summary.tinNumber} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div 
                className="flex justify-between items-center bg-gray-700 text-white px-4 py-3 border-b-2 border-gray-600 cursor-pointer"
                onClick={() => toggleExpand(summary.tinNumber)}
              >
                <div>
                  <h3 className="font-bold text-lg">{summary.companyName}</h3>
                  <p className="text-sm">TIN: {summary.tinNumber}</p>
                </div>
                {/* Chevron icon to indicate expand/collapse state */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transform transition-transform duration-200 ${
                    expandedTIN === summary.tinNumber ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Conditional rendering of the detailed section */}
              {expandedTIN === summary.tinNumber && (
                <div className="p-4 transition-all duration-300 ease-in-out">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
                    <div className="bg-blue-900 p-3 rounded">
                      <p className="text-sm font-medium text-gray-300">VAT</p>
                      <p className="text-lg font-bold text-blue-300">{formatCurrency(summary.totalVAT)}</p>
                    </div>
                    <div className="bg-green-900 p-3 rounded">
                      <p className="text-sm font-medium text-gray-300">Duty Tax</p>
                      <p className="text-xl font-bold text-green-300">{formatCurrency(summary.totalDutyTax)}</p>
                    </div>
                    <div className="bg-yellow-900 p-3 rounded">
                      <p className="text-sm font-medium text-gray-300">Excise Tax</p>
                      <p className="text-xl font-bold text-yellow-300">{formatCurrency(summary.totalExciseTax)}</p>
                    </div>
                    <div className="bg-purple-900 p-3 rounded">
                      <p className="text-sm font-medium text-gray-300">Withholding Tax</p>
                      <p className="text-xl font-bold text-purple-300">{formatCurrency(summary.totalWithholdingTax)}</p>
                    </div>
                  </div>

                  <h4 className="font-bold mb-2 text-white mt-6">All Items:</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Qty</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Unit Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">VAT</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Duty Tax</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Excise Tax</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {summary.items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="hover:bg-gray-700 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{item.itemdescription}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(item.unitprice)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(item.vat)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(item.dutyTax)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(item.exciseTax)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-blue-900 border border-blue-700 text-blue-200 px-4 py-3 rounded">
          No matching tax information found.
        </div>
      )}
    </div>
  );
}