

"use client";


import TransportFeeForm from "../components/transportForm";
import WarehouseFeeForm from "../components/transportFileViewer";
export default function MainLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* First Column: Receipt Upload Form */}
      <div className="w-full lg:w-1/3 p-4 border-r border-gray-200 lg:h-screen lg:overflow-y-auto">
        <TransportFeeForm />
      </div>

      {/* Second Column: Warehouse File Viewer */}
      <div className="w-full lg:w-2/3 p-4 lg:h-screen lg:overflow-y-auto">
        <WarehouseFeeForm />
      </div>
    </div>
  );
}
