// src/components/admin/EventBoothTab.jsx
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

function EventBoothTab() {
  const [booths, setBooths] = useState([]); // Fixed: was setBooth, now setBooths
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooth, setEditingBooth] = useState(null);
  const [formData, setFormData] = useState({
    event_id: "",
    booth_number: "",
    booth_size: "",
    location: "",
    rental_price: "",
    vendor_id: "",
    status: "available",
  });

  // Mock data - replace with actual API calls
  const [events] = useState([
    { id: 1, title: "Summer Music Festival" },
    { id: 2, title: "Food Tasting Event" },
  ]);

  const [vendors] = useState([
    { id: 1, name: "Music Equipment Co." },
    { id: 2, name: "Local Food Truck" },
  ]);

  useEffect(() => {
    fetchBooths();
  }, []);

  const fetchBooths = async () => {
    setLoading(true);
    try {
      const mockData = [
        {
          id: 1,
          event_id: 1,
          booth_number: "A01",
          booth_size: "3x3m",
          location: "Main Stage Area",
          rental_price: 500,
          vendor_id: 1,
          status: "occupied",
        },
        {
          id: 2,
          event_id: 2,
          booth_number: "F01",
          booth_size: "4x4m",
          location: "Food Court",
          rental_price: 300,
          vendor_id: null, // This null value was causing the error
          status: "available",
        },
      ];
      setBooths(mockData); // Fixed: was setBooth, now setBooths
    } catch (error) {
      console.error("Error fetching booths:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBooth(null);
    setFormData({
      event_id: "",
      booth_number: "",
      booth_size: "",
      location: "",
      rental_price: "",
      vendor_id: "",
      status: "available",
    });
    setDialogOpen(true);
  };

  const handleEdit = (booth) => {
    setEditingBooth(booth);
    setFormData({
      ...booth,
      vendor_id: booth.vendor_id || "", // Handle null vendor_id
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the booth permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setBooths((prev) => prev.filter((booth) => booth.id !== id)); // Fixed: was setBooth
        Swal.fire("Deleted!", "Booth has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete booth.", "error");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const processedData = {
        ...formData,
        event_id: parseInt(formData.event_id),
        rental_price: parseFloat(formData.rental_price),
        vendor_id: formData.vendor_id ? parseInt(formData.vendor_id) : null,
      };

      if (editingBooth) {
        setBooths(
          (
            prev // Fixed: was setBooth
          ) =>
            prev.map((booth) =>
              booth.id === editingBooth.id
                ? { ...booth, ...processedData }
                : booth
            )
        );
        Swal.fire("Updated!", "Booth updated successfully.", "success");
      } else {
        const newBooth = { ...processedData, id: Date.now() };
        setBooths((prev) => [...prev, newBooth]); // Fixed: was setBooth
        Swal.fire("Added!", "Booth added successfully.", "success");
      }
      setDialogOpen(false);
    } catch (error) {
      Swal.fire("Error!", "Failed to save booth.", "error");
    }
  };

  // Fixed: Added null/undefined checks
  const getEventTitle = (eventId) => {
    if (!eventId) return "Unknown";
    return events.find((event) => event.id === eventId)?.title || "Unknown";
  };

  const getVendorName = (vendorId) => {
    if (!vendorId) return "Unassigned";
    return (
      vendors.find((vendor) => vendor.id === vendorId)?.name || "Unassigned"
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "event_id",
      headerName: "Event",
      width: 200,
      valueGetter: (params) => {
        // Fixed: Added null check
        return params && params.value ? getEventTitle(params.value) : "Unknown";
      },
    },
    { field: "booth_number", headerName: "Booth #", width: 100 },
    { field: "booth_size", headerName: "Size", width: 100 },
    { field: "location", headerName: "Location", width: 150 },
    {
      field: "rental_price",
      headerName: "Price",
      width: 100,
      type: "number",
      valueFormatter: (params) => {
        // Fixed: Added formatting for price display
        return params && params.value ? `$${params.value}` : "$0";
      },
    },
    {
      field: "vendor_id",
      headerName: "Assigned Vendor",
      width: 200,
      valueGetter: (params) => {
        // Fixed: Added null check
        return params && params.value
          ? getVendorName(params.value)
          : "Unassigned";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || "unknown"}
          color={
            params.value === "occupied"
              ? "error"
              : params.value === "reserved"
              ? "warning"
              : "success"
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
          <h2 className="text-lg font-semibold text-gray-900">Event Booths</h2>
          <p className="text-sm text-gray-600">
            Manage booth assignments and layouts
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Booth</span>
        </button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={booths}
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
          {editingBooth ? "Edit Booth" : "Add New Booth"}
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
              label="Booth Number"
              fullWidth
              value={formData.booth_number}
              onChange={(e) =>
                setFormData({ ...formData, booth_number: e.target.value })
              }
            />
            <TextField
              label="Booth Size"
              fullWidth
              value={formData.booth_size}
              onChange={(e) =>
                setFormData({ ...formData, booth_size: e.target.value })
              }
              placeholder="e.g., 3x3m"
            />
            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <TextField
              label="Rental Price"
              fullWidth
              type="number"
              value={formData.rental_price}
              onChange={(e) =>
                setFormData({ ...formData, rental_price: e.target.value })
              }
              InputProps={{
                startAdornment: <span className="mr-1 text-gray-500">$</span>,
              }}
            />
            <TextField
              label="Assigned Vendor"
              fullWidth
              select
              value={formData.vendor_id || ""}
              onChange={(e) =>
                setFormData({ ...formData, vendor_id: e.target.value })
              }>
              <MenuItem value="">Unassigned</MenuItem>
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <TextField
            label="Status"
            fullWidth
            select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            margin="normal">
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="reserved">Reserved</MenuItem>
            <MenuItem value="occupied">Occupied</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBooth ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EventBoothTab;
