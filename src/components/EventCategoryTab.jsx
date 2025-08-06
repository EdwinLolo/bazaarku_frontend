// src/components/admin/EventCategoryTab.jsx
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
  Chip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  getEventData,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "../models/admin";

function EventCategoryTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const mockData = await getEventData();
      console.log("Fetched categories:", mockData);
      setCategories(mockData.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", color: "#3B82F6" });
    setDialogOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData(category);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteEventCategory(id);
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete category.",
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        // Update existing
        await updateEventCategory(editingCategory.id, formData);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, ...formData } : cat
          )
        );
        Swal.fire("Updated!", "Category updated successfully.", "success");
      } else {
        // Add new
        const submitResponse = await createEventCategory(formData);
        const newCategory = { ...formData, id: submitResponse.data.id }; // Mock ID, replace with actual response ID
        setCategories((prev) => [...prev, newCategory]);
        Swal.fire("Added!", "Category added successfully.", "success");
      }
      setDialogOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save category.",
        target: "#event-category-form-dialog",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Event Categories
          </h2>
          <p className="text-sm text-gray-600">
            Manage event categories and types
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Data Grid */}
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={categories}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        id="event-category-form-dialog">
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            label="Category Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCategory ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EventCategoryTab;
