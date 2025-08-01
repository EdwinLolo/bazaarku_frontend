// src/components/admin/EventVendorTab.jsx
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

function EventVendorTab() {
  const [eventVendors, setEventVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    event_id: "",
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
    booth_preference: "",
    products_services: "",
    status: "pending",
  });

  // Mock events - replace with actual API calls
  const [events] = useState([
    { id: 1, title: "Summer Music Festival" },
    { id: 2, title: "Food Tasting Event" },
  ]);

  useEffect(() => {
    fetchEventVendors();
  }, []);

  const fetchEventVendors = async () => {
    setLoading(true);
    try {
      const mockData = [
        {
          id: 1,
          event_id: 1,
          vendor_name: "Music Equipment Co.",
          vendor_email: "contact@musicequip.com",
          vendor_phone: "+1234567890",
          booth_preference: "Stage Area",
          products_services: "Sound systems, lighting",
          status: "approved",
        },
        {
          id: 2,
          event_id: 2,
          vendor_name: "Local Food Truck",
          vendor_email: "info@foodtruck.com",
          vendor_phone: "+1234567891",
          booth_preference: "Food Court",
          products_services: "Street food, beverages",
          status: "pending",
        },
      ];
      setEventVendors(mockData);
    } catch (error) {
      console.error("Error fetching event vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingVendor(null);
    setFormData({
      event_id: "",
      vendor_name: "",
      vendor_email: "",
      vendor_phone: "",
      booth_preference: "",
      products_services: "",
      status: "pending",
    });
    setDialogOpen(true);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the vendor from the event!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        setEventVendors((prev) => prev.filter((vendor) => vendor.id !== id));
        Swal.fire("Removed!", "Vendor has been removed from event.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to remove vendor.", "error");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const processedData = {
        ...formData,
        event_id: parseInt(formData.event_id),
      };

      if (editingVendor) {
        setEventVendors((prev) =>
          prev.map((vendor) =>
            vendor.id === editingVendor.id
              ? { ...vendor, ...processedData }
              : vendor
          )
        );
        Swal.fire("Updated!", "Event vendor updated successfully.", "success");
      } else {
        const newVendor = { ...processedData, id: Date.now() };
        setEventVendors((prev) => [...prev, newVendor]);
        Swal.fire("Added!", "Event vendor added successfully.", "success");
      }
      setDialogOpen(false);
    } catch (error) {
      Swal.fire("Error!", "Failed to save event vendor.", "error");
    }
  };

  const getEventTitle = (eventId) => {
    return events.find((event) => event.id === eventId)?.title || "Unknown";
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "event_id",
      headerName: "Event",
      width: 200,
      valueGetter: (params) => getEventTitle(params.value),
    },
    { field: "vendor_name", headerName: "Vendor Name", width: 200 },
    { field: "vendor_email", headerName: "Email", width: 200 },
    { field: "vendor_phone", headerName: "Phone", width: 150 },
    { field: "booth_preference", headerName: "Booth Preference", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "approved"
              ? "success"
              : params.value === "rejected"
              ? "error"
              : "warning"
          }
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="space-x-1">
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary">
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error">
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Event Vendors</h2>
          <p className="text-sm text-gray-600">
            Manage vendors participating in events
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Vendor</span>
        </button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={eventVendors}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>
          {editingVendor ? "Edit Event Vendor" : "Add Event Vendor"}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <TextField
              label="Event"
              fullWidth
              select
              value={formData.event_id}
              onChange={(e) =>
                setFormData({ ...formData, event_id: e.target.value })
              }>
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Vendor Name"
              fullWidth
              value={formData.vendor_name}
              onChange={(e) =>
                setFormData({ ...formData, vendor_name: e.target.value })
              }
            />
            <TextField
              label="Vendor Email"
              fullWidth
              type="email"
              value={formData.vendor_email}
              onChange={(e) =>
                setFormData({ ...formData, vendor_email: e.target.value })
              }
            />
            <TextField
              label="Vendor Phone"
              fullWidth
              value={formData.vendor_phone}
              onChange={(e) =>
                setFormData({ ...formData, vendor_phone: e.target.value })
              }
            />
            <TextField
              label="Booth Preference"
              fullWidth
              value={formData.booth_preference}
              onChange={(e) =>
                setFormData({ ...formData, booth_preference: e.target.value })
              }
            />
            <TextField
              label="Status"
              fullWidth
              select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </div>
          <TextField
            label="Products/Services"
            fullWidth
            multiline
            rows={3}
            value={formData.products_services}
            onChange={(e) =>
              setFormData({ ...formData, products_services: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVendor ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EventVendorTab;
