"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBuilding, // General building, could be replaced for specific services
  FaFileInvoice, // Good for invoices
  FaFileSignature, // Good for declarations/signatures
  FaWarehouse, // Good for warehouse
  FaCheckCircle, // Good for clearance/approval
  FaUniversity, // Good for bank/education
  FaFileAlt, // Good for general documents
  FaCaretDown, // Good for dropdown
  FaCar, // New: For transport
  FaClipboardCheck, // Alternative for clearance
} from "react-icons/fa";

const navItems = [
  // Changed icon to FaCar for Transport Fee
  { href: "/transport", label: "Transport Fee", icon: <FaCar /> },
  { href: "/declaration", label: "Declaration", icon: <FaFileSignature /> },
  { href: "/warehouse-fee", label: "Warehouse Fee", icon: <FaWarehouse /> },
  {
    href: "/custom-clearance",
    label: "Custom Clearance",
    icon: <FaCheckCircle />, // Keeping FaCheckCircle as it's clear for 'clearance'
  },
  { href: "/bank-service", label: "Bank Service", icon: <FaUniversity /> },
  {
    href: "/commercial-invoice",
    label: "Commercial Invoice",
    icon: <FaFileInvoice />,
  },
];

export default function ClerkDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showDocuments, setShowDocuments] = useState(false);
  const pathname = usePathname();

  return (
    // Overall container with a pure white background
    <div className="flex min-h-screen bg-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 h-screen fixed top-0 left-0 bg-slate-900 shadow-xl text-white p-4 flex flex-col overflow-y-auto border-r border-slate-700">
        <div className="flex-shrink-0 mb-8 mt-2">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Clerk Panel
          </h2>
          <p className="text-sm text-slate-400 mt-1">Document Management</p>
        </div>
        <nav className="flex-grow flex flex-col space-y-2">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === href
                  ? "bg-slate-700 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="mr-3 text-lg">{icon}</span>
              <span className="font-semibold">{label}</span>
            </Link>
          ))}

          {/* Documents Dropdown */}
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 ${
              pathname.includes("FileViewer") // Check for any path including "FileViewer"
                ? "bg-slate-700 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="flex items-center">
              <span className="mr-3 text-lg">
                <FaFileAlt />
              </span>
              <span className="font-semibold">Documents</span>
            </span>
            <FaCaretDown
              className={`transform transition-transform duration-200 ${
                showDocuments ? "rotate-180" : ""
              }`}
            />
          </button>
          {showDocuments && (
            <div className="ml-6 space-y-1 mt-1 border-l-2 border-slate-600 pl-2">
              <Link
                href="/customFileViewer"
                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  pathname === "/customFileViewer"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Custom
              </Link>
              <Link
                href="/wareHouseFileViewer"
                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  pathname === "/wareHouseFileViewer"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Warehouse
              </Link>
              <Link
                href="/transportFileViewer"
                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  pathname === "/transportFileViewer"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Transport
              </Link>
              <Link
                href="/clearanceFileViewer"
                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  pathname === "/clearanceFileViewer"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Clearance
              </Link>
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8 bg-white overflow-auto">
        {children}
      </main>
    </div>
  );
}
