import React from "react";
import BannersTab from "../../components/BannersTab";

function AdminDashboard() {
  return (
    <>
      <div className="admin-dashboard">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="tabs">
          <BannersTab />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
