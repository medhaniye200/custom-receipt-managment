// app/(clerk-dashboard)/layout.tsx
import Link from "next/link";

const navItems = [
  { href: "/companies", label: "Companies" },
  // { href: "/components", label: "Components" },
  { href: "/declaration", label: "Declaration" },
  { href: "/items", label: "Items" },
  { href: "/warehouse-fee", label: "Warehouse Fee" },
  { href: "/custem-clearance", label: "Custom Clearance" },
  { href: "/bank-service", label: "Bank Service" },
  { href: "/commercial-invoice", label: "commercial invoice" },
];

export default function ClerkDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-48 flex-1 p-6 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
}
