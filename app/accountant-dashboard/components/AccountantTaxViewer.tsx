"use client";

import { useEffect, useState } from "react";

// --- Type Definitions ---
type ItemInfo = {
  companyname: string;
  firstname: string;
  lastanme: string;
  hscode: string;
  itemdescription: string;
  quantity: number;
  tinnumber: string;
  unitprice: number;
};

type Declaration = {
  declarationNumber: string;
  dpvAmountPerDeclaration: number;
  dutyTax: number;
  exciseTax: number;
  scanningFee: number;
  scanningFeeVAT: number;
  socialWelfareTax: number;
  surtax: number;
  totalTaxPerDeclaration: number;
  vat: number;
  withholdingTax: number;
  iteminfo: ItemInfo;
};

type GroupedDeclarations = {
  [companyName: string]: Declaration[];
};

export default function DeclarationList() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state to track the selected company
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found in localStorage.");
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
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setDeclarations(data);
      } catch (error: any) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedDeclarations = declarations.reduce<GroupedDeclarations>((acc, dec) => {
    const companyName = dec.iteminfo.companyname;
    if (!acc[companyName]) {
      acc[companyName] = [];
    }
    acc[companyName].push(dec);
    return acc;
  }, {});

  const containerStyles: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#f9fafb",
    color: "#333",
  };

  const companyCardStyles: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1rem",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  
  const buttonStyles: React.CSSProperties = {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  };
  
  const backButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: "#d1d5db",
    color: "#4b5563",
    marginBottom: "1.5rem",
  };

  const declarationListStyles: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "1.5rem",
  };

  const declarationItemStyles: React.CSSProperties = {
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
  };
  
  const declarationHeaderStyles: React.CSSProperties = {
    color: "#4b5563",
    fontSize: "1.25rem",
    marginBottom: "1rem",
  };

  const boldLabelStyles: React.CSSProperties = {
    fontWeight: "bold",
    color: "#1f2937",
  };

  if (loading) return <p style={containerStyles}>Loading...</p>;
  if (error) return <p style={{ ...containerStyles, color: "red" }}>Error: {error}</p>;
  if (declarations.length === 0) return <p style={containerStyles}>No declarations available.</p>;

  // Conditional Rendering: Display declarations for a selected company
  if (selectedCompany) {
    const declarationsForCompany = groupedDeclarations[selectedCompany] || [];
    return (
      <div style={containerStyles}>
        <button 
          onClick={() => setSelectedCompany(null)}
          style={backButtonStyles}
        >
          &larr; Back to Companies
        </button>
        <h1 style={{fontSize: "2rem", marginBottom: "1rem"}}>Declarations for {selectedCompany}</h1>
        {declarationsForCompany.length === 0 ? (
          <p>No declarations found for this company.</p>
        ) : (
          <div style={declarationListStyles}>
            {declarationsForCompany.map((dec, index) => (
              <div
                key={`${dec.declarationNumber}-${index}`}
                style={{
                  ...declarationItemStyles,
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f3f4f6",
                }}
              >
                <h3 style={declarationHeaderStyles}>Declaration #{dec.declarationNumber}</h3>
                <ul style={{listStyleType: "none", padding: 0}}>
                  <li><span style={boldLabelStyles}>HS Code:</span> {dec.iteminfo.hscode}</li>
                  <li><span style={boldLabelStyles}>Item:</span> {dec.iteminfo.itemdescription}</li>
                  <li><span style={boldLabelStyles}>Quantity:</span> {dec.iteminfo.quantity}</li>
                  <li><span style={boldLabelStyles}>Unit Price:</span> {dec.iteminfo.unitprice.toLocaleString()}</li>
                  <li><span style={boldLabelStyles}>TIN Number:</span> {dec.iteminfo.tinnumber}</li>
                  <li><span style={boldLabelStyles}>Total Tax:</span> {dec.totalTaxPerDeclaration.toLocaleString()}</li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default view: Display a list of companies
  return (
    <div style={containerStyles}>
      <h1 style={{fontSize: "2rem", marginBottom: "1rem"}}>Declarations by Company</h1>
      {Object.entries(groupedDeclarations).map(([companyName, declarationsForCompany]) => (
        <div key={companyName} style={companyCardStyles}>
          <div>
            <h2 style={{fontSize: "1.25rem", fontWeight: "bold", margin: 0}}>{companyName}</h2>
            <p style={{color: "#6b7280", fontSize: "0.875rem"}}>{declarationsForCompany.length} declaration(s)</p>
          </div>
          <button 
            onClick={() => setSelectedCompany(companyName)}
            style={buttonStyles}
          >
            View Declarations
          </button>
        </div>
      ))}
    </div>
  );
}