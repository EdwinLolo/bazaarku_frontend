// src/components/admin/EventAreaTab.jsx
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
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  getAreaData,
  createArea,
  updateArea,
  deleteArea,
} from "../models/admin";

function EventAreaTab() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const mockData = await getAreaData();
      setAreas(mockData.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingArea(null);
    setFormData({
      name: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData(area);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the area permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeleteLoading(true);
        await deleteArea(id);
        setDeleteLoading(false);

        setAreas((prev) => prev.filter((area) => area.id !== id));
        Swal.fire("Deleted!", "Area has been deleted.", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete area.",
        });
      }
    }
  };

  const handleSubmit = async () => {
    setAddLoading(true);
    setEditLoading(true);
    try {
      if (editingArea) {
        await updateArea(editingArea.id, formData);
        setAreas((prev) =>
          prev.map((area) =>
            area.id === editingArea.id ? { ...area, ...formData } : area
          )
        );
        Swal.fire("Updated!", "Area updated successfully.", "success");
      } else {
        const areaResponse = await createArea(formData);
        const newArea = {
          ...formData,
          id: areaResponse.data.id,
          capacity: parseInt(formData.capacity),
        };
        setAreas((prev) => [...prev, newArea]);
        Swal.fire("Added!", "Area added successfully.", "success");
      }
      setDialogOpen(false);
      setAddLoading(false);
      setEditLoading(false);

      // Refresh data to get latest from server
      fetchAreas();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save area.",
        target: "#event-area-form-dialog",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Area Name", width: 200 },
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
          <h2 className="text-lg font-semibold text-gray-900">Event Areas</h2>
          <p className="text-sm text-gray-600">
            Manage event locations and venues
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Area</span>
        </button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={areas}
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
        maxWidth="sm"
        fullWidth
        id="event-area-form-dialog">
        <DialogTitle>{editingArea ? "Edit Area" : "Add New Area"}</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            label="Area Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={addLoading || editLoading || deleteLoading}
            className={`
      flex items-center gap-2 px-6 py-2 rounded-md font-semibold
      transition-colors
      ${addLoading ? "bg-green-600 hover:bg-green-700 text-white" : ""}
      ${editLoading ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
      ${deleteLoading ? "bg-red-600 hover:bg-red-700 text-white" : ""}
      ${
        !addLoading && !editLoading && !deleteLoading
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : ""
      }
      disabled:opacity-60 disabled:cursor-not-allowed
    `}>
            {(addLoading || editLoading || deleteLoading) && (
              <span
                className={`
          animate-spin inline-block w-4 h-4 border-2 rounded-full
          ${addLoading ? "border-white border-t-green-200" : ""}
          ${editLoading ? "border-white border-t-yellow-200" : ""}
          ${deleteLoading ? "border-white border-t-red-200" : ""}
        `}
                style={{ borderRightColor: "transparent" }}
              />
            )}
            {addLoading
              ? "Adding..."
              : editLoading
              ? "Updating..."
              : deleteLoading
              ? "Deleting..."
              : editingArea
              ? "Update Area"
              : "Add Area"}
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteLoading}
        PaperProps={{ className: "shadow-none bg-transparent" }}>
        <Box className="flex items-center justify-center min-h-[200px] min-w-[280px] bg-white rounded-lg shadow-lg p-8 gap-4 flex-col">
          <span
            className="inline-block w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"
            style={{ borderRightColor: "transparent" }}
          />
          <span className="text-lg font-semibold text-red-700">
            Deleting Event Category...
          </span>
        </Box>
      </Dialog>
    </div>
  );
}

export default EventAreaTab;
