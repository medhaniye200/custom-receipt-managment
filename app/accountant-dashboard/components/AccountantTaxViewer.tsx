"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Printer } from "lucide-react";

interface TaxAmountPerItem {
  dpvAmountPerDeclaration: number | null;
  dutyTax: number | null;
  exciseTax: number | null;
  scanningFee: number | null;
  scanningFeeVAT: number | null;
  socialWelfareTax: number | null;
  surtax: number | null;
  totalTaxPerDeclaration: number | null;
  vat: number | null;
  withholdingTax: number | null;
}

interface ItemInfo {
  bankServicePerItem: number | null;
  companyname: string;
  firstname: string;
  lastanme: string;
  hscode: string;
  itemdescription: string;
  quantity: number;
  tinnumber: string;
  transitorPerItem: number | null;
  transportFeePerItem: number | null;
  warehousePerItem: number | null;
  unitprice: number;
  taxAmountPerItem: TaxAmountPerItem[];
}

interface TaxData {
  declarationNumber: string;
  grandTotalInETB: number;
  iteminfo: ItemInfo[];
  totalBankService: number;
  totalTaxPerDeclaration: number;
  totalVatPerDeclaration: number;
  totalTransitorFee: number | null;
  totalTransportFee: number | null;
  totalWareHouseFee: number | null;
  totalWithholding: number | null;
  totaldpvAmountPerDeclaration: number | null;
  totaldutyTax: number | null;
  totalexciseTax: number | null;
  totalscanningFee: number | null;
  totalscanningFeeVAT: number | null;
  totalsocialWelfareTax: number | null;
  totalsurtax: number | null;
  totalvat: number | null;
  totalwithholdingTax: number | null;
}

export default function AllTaxViewer() {
  const [data, setData] = useState<TaxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDeclarations, setExpandedDeclarations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<TaxData[]>(
          "https://customreceiptmanagement.onrender.com/api/v1/accountant/alltax",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
        const initialExpandedState = res.data.reduce((acc, item) => {
          acc[item.declarationNumber] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setExpandedDeclarations(initialExpandedState);
      } catch (err) {
        console.error(err);
        setError("Failed to load tax data ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleDeclaration = (declarationNumber: string) => {
    setExpandedDeclarations(prev => ({
      ...prev,
      [declarationNumber]: !prev[declarationNumber]
    }));
  };

  const printDeclaration = (declarationNumber: string) => {
    const printWindow = window.open('', '', 'width=900,height=650');
    const declaration = data.find(d => d.declarationNumber === declarationNumber);
    
    if (printWindow && declaration) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Tax Declaration ${declarationNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .declaration-number { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .company-name { font-size: 16px; margin-bottom: 5px; }
              .summary-section { margin-bottom: 20px; }
              .section-title { font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin: 15px 0 10px 0; }
              .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
              .summary-card { border: 1px solid #ddd; padding: 12px; border-radius: 5px; }
              .card-title { font-weight: bold; margin-bottom: 8px; color: #333; }
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .items-table th { background-color: #f5f5f5; }
              .tax-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
              .tax-item { border: 1px solid #eee; padding: 8px; border-radius: 4px; font-size: 14px; }
              .tax-label { font-weight: 600; color: #555; }
              .total-row { font-weight: bold; background-color: #f9f9f9; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
                .page-break { page-break-after: always; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="declaration-number">Declaration #${declarationNumber}</div>
              <div class="company-name">${declaration.iteminfo[0]?.companyname || 'Unknown Company'}</div>
              <div>${new Date().toLocaleDateString()}</div>
            </div>

            <div class="summary-section">
              <div class="section-title">Financial Summary</div>
              <div class="summary-grid">
                <div class="summary-card">
                  <div class="card-title">Totals</div>
                  <div>Grand Total: ${declaration.grandTotalInETB?.toLocaleString()} ETB</div>
                  <div>Total Tax: ${declaration.totalTaxPerDeclaration?.toLocaleString()} ETB</div>
                  <div>Total VAT: ${declaration.totalVatPerDeclaration?.toLocaleString()} ETB</div>
                </div>
                <div class="summary-card">
                  <div class="card-title">Tax Breakdown</div>
                  <div>Duty Tax: ${declaration.totaldutyTax?.toLocaleString()} ETB</div>
                  <div>Excise Tax: ${declaration.totalexciseTax?.toLocaleString()} ETB</div>
                  <div>Social Welfare: ${declaration.totalsocialWelfareTax?.toLocaleString()} ETB</div>
                </div>
                <div class="summary-card">
                  <div class="card-title">Fees & Charges</div>
                  <div>Bank Service: ${declaration.totalBankService?.toLocaleString()} ETB</div>
                  <div>Transit Fee: ${declaration.totalTransitorFee?.toLocaleString()} ETB</div>
                  <div>Warehouse Fee: ${declaration.totalWareHouseFee?.toLocaleString()} ETB</div>
                </div>
              </div>
            </div>

            <div class="section-title">Items Details</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>HS Code</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>TIN</th>
                </tr>
              </thead>
              <tbody>
                ${declaration.iteminfo.map(item => `
                  <tr>
                    <td>${item.itemdescription}</td>
                    <td>${item.hscode}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitprice?.toLocaleString()} ETB</td>
                    <td>${item.tinnumber}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="section-title">Tax Details</div>
            <div class="tax-grid">
              ${declaration.iteminfo.flatMap(item => 
                item.taxAmountPerItem?.map((tax, index) => 
                  Object.entries(tax).map(([key, value]) => 
                    value !== null ? `
                      <div class="tax-item">
                        <div class="tax-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div>${typeof value === 'number' ? value.toLocaleString() : value || 'N/A'} ETB</div>
                      </div>
                    ` : ''
                  ).join('')
                ).join('')
              ).join('')}
            </div>

            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 200);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 bg-red-50 text-red-600 rounded-lg mx-4 my-6">
      {error}
    </div>
  );

  if (!loading && !error && data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No tax declarations found
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tax Declarations</h1>
      
      {data.map((declaration) => (
        <div key={declaration.declarationNumber} className="border rounded-lg shadow-sm bg-white overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b"
            onClick={() => toggleDeclaration(declaration.declarationNumber)}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-md">
                <span className="font-medium">#{declaration.declarationNumber}</span>
              </div>
              <div>
                <h2 className="font-semibold">
                  {declaration.iteminfo[0]?.companyname || 'Unknown Company'}
                </h2>
                <p className="text-sm text-gray-600">
                  {declaration.iteminfo.length} item(s) • Total: {declaration.grandTotalInETB?.toLocaleString()} ETB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  printDeclaration(declaration.declarationNumber);
                }}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50"
                title="Print this declaration"
              >
                <Printer size={18} />
                <span className="text-sm hidden md:inline">Print</span>
              </button>
              <div className="text-gray-500">
                {expandedDeclarations[declaration.declarationNumber] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </div>

          {expandedDeclarations[declaration.declarationNumber] && (
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Summary Card */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-3">Financial Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-gray-600">Grand Total:</span>
                      <span className="font-medium">{declaration.grandTotalInETB?.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-gray-600">Total Tax:</span>
                      <span className="font-medium">{declaration.totalTaxPerDeclaration?.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Total VAT:</span>
                      <span className="font-medium">{declaration.totalVatPerDeclaration?.toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>

                {/* Taxes Card */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800 mb-3">Tax Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-green-100">
                      <span className="text-gray-600">Duty Tax:</span>
                      <span className="font-medium">{declaration.totaldutyTax?.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-green-100">
                      <span className="text-gray-600">Excise Tax:</span>
                      <span className="font-medium">{declaration.totalexciseTax?.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Social Welfare:</span>
                      <span className="font-medium">{declaration.totalsocialWelfareTax?.toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>

                {/* Fees Card */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-3">Fees & Charges</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-purple-100">
                      <span className="text-gray-600">Bank Service:</span>
                      <span className="font-medium">{declaration.totalBankService?.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-purple-100">
                      <span className="text-gray-600">Transit Fee:</span>
                      <span className="font-medium">{declaration.totalTransitorFee?.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Warehouse Fee:</span>
                      <span className="font-medium">{declaration.totalWareHouseFee?.toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Items Details</h3>
                  <span className="text-sm text-gray-500">{declaration.iteminfo.length} items</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HS Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIN</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {declaration.iteminfo.map((item, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemdescription}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.hscode}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.unitprice?.toLocaleString()} ETB</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.companyname}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.tinnumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Details Section */}
              {declaration.iteminfo.some(item => item.taxAmountPerItem?.length > 0) && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {declaration.iteminfo.flatMap(item => 
                      item.taxAmountPerItem?.map((tax, index) => 
                        Object.entries(tax).map(([key, value]) => 
                          value !== null && (
                            <div key={`${key}-${index}`} className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
                              <h4 className="font-medium text-gray-700 capitalize text-sm mb-1">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-gray-900 font-semibold">
                                {typeof value === 'number' ? value.toLocaleString() : value || 'N/A'} ETB
                              </p>
                            </div>
                          )
                        )
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}