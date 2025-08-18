"use client";
import ReceiptUpload from "./ReceiptUpload";

export default function MainLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* First Column: Receipt Upload Form */}
      <div className="w-full lg:w-1/3 p-4 border-r border-gray-200 lg:h-screen lg:overflow-y-auto">
        <ReceiptUpload />
      </div>
    </div>
  );
}
