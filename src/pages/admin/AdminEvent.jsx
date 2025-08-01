// src/pages/admin/AdminEvent.jsx
import React, { useState } from "react";
import { Calendar, MapPin, Tag, Store, Building, Plus } from "lucide-react";
import EventCategoryTab from "../../components/EventCategoryTab";
import EventAreaTab from "../../components/EventAreaTab";
import EventTab from "../../components/EventTab";
import EventVendorTab from "../../components/EventVendorTab";
import EventBoothTab from "../../components/EventBoothTab";

function AdminEvent() {
  const [activeTab, setActiveTab] = useState("categories");

  const tabs = [
    {
      id: "categories",
      label: "Event Categories",
      icon: Tag,
      component: EventCategoryTab,
      description: "Manage event categories and types",
    },
    {
      id: "areas",
      label: "Event Areas",
      icon: MapPin,
      component: EventAreaTab,
      description: "Manage event locations and areas",
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      component: EventTab,
      description: "Manage events and schedules",
    },
    {
      id: "vendors",
      label: "Event Vendors",
      icon: Store,
      component: EventVendorTab,
      description: "Manage vendors participating in events",
    },
    {
      id: "booths",
      label: "Event Booths",
      icon: Building,
      component: EventBoothTab,
      description: "Manage booth assignments and layouts",
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Event Management
            </h1>
            <p className="mt-1 text-gray-600">
              Manage all aspects of events, from categories to booth assignments
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex px-6 space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}>
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">{ActiveComponent && <ActiveComponent />}</div>
      </div>
    </div>
  );
}

export default AdminEvent;
