// src/components/admin/RentalTab.jsx
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
  Box,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

function RentalTab() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    price_per_day: "",
    quantity_available: "",
    quantity_total: "",
    condition: "excellent",
    status: "available",
    specifications: "",
    image_url: "",
  });

  // Mock categories - replace with actual API calls
  const [categories] = useState([
    { id: 1, name: "Audio Equipment" },
    { id: 2, name: "Furniture" },
    { id: 3, name: "Lighting" },
    { id: 4, name: "Catering Equipment" },
  ]);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const mockData = [
        {
          id: 1,
          name: "Wireless Microphone Set",
          description: "Professional wireless microphone system",
          category_id: 1,
          price_per_day: 25.0,
          quantity_available: 8,
          quantity_total: 10,
          condition: "excellent",
          status: "available",
          specifications: "Frequency: 2.4GHz, Range: 100m, Battery: 8 hours",
          image_url: "https://example.com/mic.jpg",
        },
        {
          id: 2,
          name: "Round Table (8-seater)",
          description: "Elegant round dining table",
          category_id: 2,
          price_per_day: 15.0,
          quantity_available: 0,
          quantity_total: 20,
          condition: "good",
          status: "rented",
          specifications: "Diameter: 150cm, Height: 75cm, Material: Wood",
          image_url: "https://example.com/table.jpg",
        },
        {
          id: 3,
          name: "LED Spotlight",
          description: "High-power LED spotlight for events",
          category_id: 3,
          price_per_day: 35.0,
          quantity_available: 5,
          quantity_total: 6,
          condition: "excellent",
          status: "available",
          specifications: "Power: 200W, Color: RGB, DMX Compatible",
          image_url: "https://example.com/light.jpg",
        },
        {
          id: 4,
          name: "Food Warmer",
          description: "Electric food warming tray",
          category_id: 4,
          price_per_day: 12.0,
          quantity_available: 3,
          quantity_total: 5,
          condition: "fair",
          status: "maintenance",
          specifications: "Capacity: 5L, Temperature: 60-80°C, Power: 300W",
          image_url: "https://example.com/warmer.jpg",
        },
      ];
      setRentals(mockData);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRental(null);
    setFormData({
      name: "",
      description: "",
      category_id: "",
      price_per_day: "",
      quantity_available: "",
      quantity_total: "",
      condition: "excellent",
      status: "available",
      specifications: "",
      image_url: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (rental) => {
    setEditingRental(rental);
    setFormData(rental);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the rental item permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setRentals((prev) => prev.filter((rental) => rental.id !== id));
        Swal.fire("Deleted!", "Rental item has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete rental item.", "error");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const processedData = {
        ...formData,
        category_id: parseInt(formData.category_id),
        price_per_day: parseFloat(formData.price_per_day),
        quantity_available: parseInt(formData.quantity_available),
        quantity_total: parseInt(formData.quantity_total),
      };

      if (editingRental) {
        setRentals((prev) =>
          prev.map((rental) =>
            rental.id === editingRental.id
              ? { ...rental, ...processedData }
              : rental
          )
        );
        Swal.fire("Updated!", "Rental item updated successfully.", "success");
      } else {
        const newRental = { ...processedData, id: Date.now() };
        setRentals((prev) => [...prev, newRental]);
        Swal.fire("Added!", "Rental item added successfully.", "success");
      }
      setDialogOpen(false);
    } catch (error) {
      Swal.fire("Error!", "Failed to save rental item.", "error");
    }
  };

  const getCategoryName = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "success";
      case "rented":
        return "warning";
      case "maintenance":
        return "error";
      default:
        return "default";
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "excellent":
        return "success";
      case "good":
        return "info";
      case "fair":
        return "warning";
      case "poor":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Item Name", width: 200 },
    {
      field: "category_id",
      headerName: "Category",
      width: 150,
      renderCell: (params) => (
        <span>{getCategoryName(params.row.category_id)}</span>
      ),
    },
    {
      field: "price_per_day",
      headerName: "Price/Day",
      width: 120,
      type: "number",
      valueFormatter: (params) => {
        return params && params.value ? `$${params.value.toFixed(2)}` : "$0.00";
      },
    },
    {
      field: "quantity_info",
      headerName: "Quantity",
      width: 120,
      renderCell: (params) => (
        <span
          className={
            params.row.quantity_available === 0
              ? "text-red-600 font-medium"
              : ""
          }>
          {params.row.quantity_available}/{params.row.quantity_total}
        </span>
      ),
    },
    {
      field: "condition",
      headerName: "Condition",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getConditionColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
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
          <h2 className="text-lg font-semibold text-gray-900">Rental Items</h2>
          <p className="text-sm text-gray-600">
            Manage rental items and inventory
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Rental Item</span>
        </button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rentals}
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
          {editingRental ? "Edit Rental Item" : "Add New Rental Item"}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <TextField
              label="Item Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="Category"
              fullWidth
              select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Price per Day"
              fullWidth
              type="number"
              step="0.01"
              value={formData.price_per_day}
              onChange={(e) =>
                setFormData({ ...formData, price_per_day: e.target.value })
              }
              InputProps={{
                startAdornment: <span className="mr-1 text-gray-500">$</span>,
              }}
            />
            <TextField
              label="Total Quantity"
              fullWidth
              type="number"
              value={formData.quantity_total}
              onChange={(e) =>
                setFormData({ ...formData, quantity_total: e.target.value })
              }
            />
            <TextField
              label="Available Quantity"
              fullWidth
              type="number"
              value={formData.quantity_available}
              onChange={(e) =>
                setFormData({ ...formData, quantity_available: e.target.value })
              }
            />
            <TextField
              label="Condition"
              fullWidth
              select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }>
              <MenuItem value="excellent">Excellent</MenuItem>
              <MenuItem value="good">Good</MenuItem>
              <MenuItem value="fair">Fair</MenuItem>
              <MenuItem value="poor">Poor</MenuItem>
            </TextField>
            <TextField
              label="Status"
              fullWidth
              select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="rented">Rented</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="discontinued">Discontinued</MenuItem>
            </TextField>
            <TextField
              label="Image URL"
              fullWidth
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
            />
          </div>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Specifications"
            fullWidth
            multiline
            rows={3}
            value={formData.specifications}
            onChange={(e) =>
              setFormData({ ...formData, specifications: e.target.value })
            }
            margin="normal"
            placeholder="Technical specifications, dimensions, features..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRental ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RentalTab;
