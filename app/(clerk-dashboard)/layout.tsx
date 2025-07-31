"use client";
import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/companies", label: "Companies" },
  { href: "/declaration", label: "Declaration" },
  { href: "/items", label: "Items" },
  { href: "/warehouse-fee", label: "Warehouse Fee" },
  { href: "/custem-clearance", label: "Custom Clearance" },
  { href: "/bank-service", label: "Bank Service" },
  { href: "/commercial-invoice", label: "Commercial Invoice" },
];

export default function ClerkDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showDocuments, setShowDocuments] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-48 h-screen fixed top-0 left-0 bg-gray-900 text-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Clerk Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              {label}
            </Link>
          ))}

          {/* Documents Dropdown */}
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className="block text-left px-3 py-2 rounded hover:bg-gray-700 transition focus:outline-none"
          >
            Documents ▾
          </button>
          {showDocuments && (
            <div className="ml-4 space-y-2">
              <Link
                href="/documentsViewer"
                className="block px-3 py-1 rounded hover:bg-gray-700 text-sm"
              >
                custom
              </Link>
              <Link
                href="/wareHouseFileViewer"
                className="block px-3 py-1 rounded hover:bg-gray-700 text-sm"
              >
                wareHouse
              </Link>
              <Link
                href="/transportFileViewer"
                className="block px-3 py-1 rounded hover:bg-gray-700 text-sm"
              >
                transport
              </Link>
              <Link
                href="/clearanceFileViewer"
                className="block px-3 py-1 rounded hover:bg-gray-700 text-sm"
              >
                clearance{" "}
              </Link>
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-48 flex-1 p-6 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
}
