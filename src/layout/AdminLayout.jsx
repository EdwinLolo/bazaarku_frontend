// src/layout/AdminLayout.jsx
import React from "react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-64">
        {/* Content area */}
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
