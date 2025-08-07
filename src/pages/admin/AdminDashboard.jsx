import React from "react";
import BannersTab from "../../components/BannersTab";

function AdminDashboard() {
  return (
    <>
      <div className="admin-dashboard">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Users</h1>
              <p className="mt-1 text-gray-600">
                Manage users, roles, and permissions for your application.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <BannersTab />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
