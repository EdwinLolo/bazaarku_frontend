// src/components/admin/EventRatingTab.jsx
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
  Box,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  getEventRatings,
  createEventRating,
  updateEventRating,
  deleteEventRating,
  getEventData2,
} from "../models/admin";

function EventRatingTab() {
  const [ratings, setRatings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    review: "",
    event_id: "",
    rating_star: 5,
  });

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const ratingResp = await getEventRatings();
      const eventResp = await getEventData2();
      setRatings(ratingResp.data || []);
      setEvents(eventResp.data || []);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRating(null);
    setFormData({ name: "", review: "", event_id: "", rating_star: 5 });
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setEditingRating(row);
    setFormData({
      name: row.name || "",
      review: row.review || "",
      event_id: row.event_id || "",
      rating_star: row.rating_star || 5,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the rating permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        setDeleteLoading(true);
        await deleteEventRating(id);
        setRatings((prev) => prev.filter((r) => r.id !== id));
        Swal.fire("Deleted!", "Rating has been deleted.", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete rating.",
        });
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim() || !formData.event_id || !formData.rating_star) {
      Swal.fire({
        icon: "warning",
        title: "Missing Data",
        text: "Name, event, and rating star are required.",
      });
      return;
    }
    if (formData.rating_star < 1 || formData.rating_star > 5) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Rating",
        text: "Rating star must be between 1 and 5.",
      });
      return;
    }
    try {
      setAddLoading(true);
      setEditLoading(true);
      if (editingRating) {
        await updateEventRating(editingRating.id, formData);
        setRatings((prev) =>
          prev.map((r) =>
            r.id === editingRating.id ? { ...r, ...formData } : r
          )
        );
        Swal.fire("Updated!", "Rating updated successfully.", "success");
      } else {
        const resp = await createEventRating(formData);
        if (resp.data) {
          setRatings((prev) => [resp.data, ...prev]);
        } else {
          // fallback if API returns whole object differently
          fetchRatings();
        }
        Swal.fire("Added!", "Rating added successfully.", "success");
      }
      setDialogOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to save rating.",
      });
    } finally {
      setAddLoading(false);
      setEditLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 160 },
    { field: "event_id", headerName: "Event ID", width: 100 },
    {
      field: "rating_star",
      headerName: "Rating",
      width: 110,
      renderCell: (params) => (
        <span style={{ color: "#f5b400", fontWeight: 600 }}>
          {params.value} ★
        </span>
      ),
    },
    {
      field: "review",
      headerName: "Review",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div
          title={params.value}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}>
          {params.value || "-"}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="space-x-1">
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
            title="Edit Rating">
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
            title="Delete Rating">
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
          <h2 className="text-lg font-semibold text-gray-900">Event Ratings</h2>
          <p className="text-sm text-gray-600">
            Manage user ratings for events
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Rating</span>
        </button>
      </div>

      {/* Data Grid */}
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={ratings}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: "id", sort: "desc" }] },
          }}
          pageSizeOptions={[5, 10, 25]}
          getRowId={(row) => row.id}
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
          {editingRating ? "Edit Rating" : "Add New Rating"}
        </DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            label="Event"
            select
            fullWidth
            value={formData.event_id}
            onChange={(e) =>
              setFormData({ ...formData, event_id: e.target.value })
            }
            margin="normal"
            required>
            {events.map((ev) => (
              <MenuItem key={ev.id} value={ev.id}>
                {ev.name || ev.title || `Event #${ev.id}`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Rating Star (1-5)"
            type="number"
            fullWidth
            inputProps={{ min: 1, max: 5 }}
            value={formData.rating_star}
            onChange={(e) =>
              setFormData({ ...formData, rating_star: Number(e.target.value) })
            }
            margin="normal"
            required
          />
          <TextField
            label="Review (optional)"
            fullWidth
            multiline
            minRows={2}
            value={formData.review}
            onChange={(e) =>
              setFormData({ ...formData, review: e.target.value })
            }
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
              ? "Saving..."
              : editLoading
              ? "Saving..."
              : deleteLoading
              ? "Deleting..."
              : editingRating
              ? "Update Rating"
              : "Add Rating"}
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
            Deleting Rating...
          </span>
        </Box>
      </Dialog>
    </div>
  );
}

export default EventRatingTab;
