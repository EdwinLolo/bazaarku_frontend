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
  Typography,
  Box,
} from "@mui/material";
import { Edit, Delete, CheckCircle, Cancel } from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  getBooth,
  createBooth,
  updateBooth,
  deleteBooth,
  getEventProduct,
} from "../models/admin";

function EventBoothTab() {
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooth, setEditingBooth] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    event_id: "",
    desc: "",
  });
  const [events, setEvents] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await getEventProduct();
      console.log("Events API response:", response);

      if (response && response.data && Array.isArray(response.data)) {
        setEvents(response.data);
      } else if (response && Array.isArray(response)) {
        setEvents(response);
      } else {
        console.error("Unexpected events data format:", response);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchBooths();
    fetchEvents();
  }, []);

  const fetchBooths = async () => {
    setLoading(true);
    try {
      const response = await getBooth();
      console.log("Fetched booth applications:", response.data);
      setBooths(response.data || []);
    } catch (error) {
      console.error("Error fetching booth applications:", error);
      setBooths([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBooth(null);
    setFormData({
      name: "",
      phone: "",
      event_id: "",
      desc: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (booth) => {
    setEditingBooth(booth);
    setFormData({
      name: booth.name || "",
      phone: booth.phone ? String(booth.phone) : "",
      event_id: booth.event_id || "",
      desc: booth.desc || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the booth application permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeleteLoading(true);
        await deleteBooth(id);
        setBooths((prev) => prev.filter((booth) => booth.id !== id));
        Swal.fire("Deleted!", "Booth application has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete booth application.",
        });
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleStatusChange = async (boothId, newStatus) => {
    try {
      const updateData = { is_acc: newStatus };
      await updateBooth(boothId, updateData);

      setBooths((prev) =>
        prev.map((booth) =>
          booth.id === boothId ? { ...booth, is_acc: newStatus } : booth
        )
      );

      Swal.fire(
        "Updated!",
        `Booth application ${newStatus.toLowerCase()}.`,
        "success"
      );
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update status.",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Applicant name is required.",
          target: "#event-booth-form-dialog",
        });
        return;
      }
      if (!formData.event_id) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Please select an event.",
          target: "#event-booth-form-dialog",
        });
        return;
      }
      if (!formData.phone.trim()) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Phone number is required.",
          target: "#event-booth-form-dialog",
        });
        return;
      }

      // Prepare data for submission
      const processedData = {
        name: formData.name.trim(),
        phone: parseInt(formData.phone.trim()),
        event_id: parseInt(formData.event_id),
        desc: formData.desc ? formData.desc.trim() : "",
      };

      // Add status - use the current status from editingBooth or default to PENDING
      if (editingBooth) {
        processedData.is_acc = editingBooth.is_acc || "PENDING";
        setEditLoading(true);
      } else {
        processedData.is_acc = "PENDING";
        setAddLoading(true);
      }

      if (editingBooth) {
        // Update existing booth application
        const response = await updateBooth(editingBooth.id, processedData);
        setBooths((prev) =>
          prev.map((booth) =>
            booth.id === editingBooth.id
              ? { ...booth, ...processedData }
              : booth
          )
        );
        Swal.fire(
          "Updated!",
          "Booth application updated successfully.",
          "success"
        );
      } else {
        // Create new booth application
        const response = await createBooth(processedData);
        const newBooth = {
          ...processedData,
          id: response.id || response.data?.id || Date.now(),
        };
        setBooths((prev) => [...prev, newBooth]);
        Swal.fire(
          "Added!",
          "Booth application submitted successfully.",
          "success"
        );
      }

      setDialogOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to save booth application.",
        target: "#event-booth-form-dialog",
      });
    } finally {
      setAddLoading(false);
      setEditLoading(false);
      fetchBooths(); // Refresh booth list after submit
    }
  };

  const getEventTitle = (eventId) => {
    console.log("Getting event title for ID:", eventId);
    console.log("Available events:", events);

    if (!eventId) return "No Event";

    const event = events.find((event) => event.id === eventId);
    console.log("Found event:", event);

    if (!event) return "Unknown Event";

    // Try different possible property names for the event title
    return (
      event.title ||
      event.name ||
      event.event_name ||
      event.event_title ||
      "Unknown Event"
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
      default:
        return "warning";
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "event_id",
      headerName: "Event",
      width: 200,
      renderCell: (params) => {
        const eventTitle = getEventTitle(params.value);
        console.log(
          "Rendering event for booth:",
          params.row.id,
          "Event ID:",
          params.value,
          "Title:",
          eventTitle
        );
        return <span>{eventTitle}</span>;
      },
    },
    {
      field: "name",
      headerName: "Booth Name",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value || "No Name"}
        </Typography>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 130,
      renderCell: (params) => (
        <span>{params.value ? `+${params.value}` : "No Phone"}</span>
      ),
    },
    {
      field: "desc",
      headerName: "Description",
      width: 200,
      renderCell: (params) => (
        <div className="truncate" title={params.value}>
          {params.value || "No Description"}
        </div>
      ),
    },
    {
      field: "is_acc",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || "PENDING"}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {/* Status Action Buttons */}
          {params.row.is_acc === "PENDING" && (
            <>
              <IconButton
                size="small"
                onClick={() => handleStatusChange(params.row.id, "APPROVED")}
                color="success"
                title="Approve">
                <CheckCircle />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleStatusChange(params.row.id, "REJECTED")}
                color="error"
                title="Reject">
                <Cancel />
              </IconButton>
            </>
          )}

          {/* Edit Button */}
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
            title="Edit">
            <Edit />
          </IconButton>

          {/* Delete Button */}
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
            title="Delete">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Booth Applications
          </h2>
          <p className="text-sm text-gray-600">
            Manage booth applications and approvals for events
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Application</span>
        </button>
      </div>

      <div style={{ height: 600, width: "100%" }}>
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
        fullWidth
        id="event-booth-form-dialog">
        <DialogTitle>
          {editingBooth
            ? "Edit Booth Application"
            : "Add New Booth Application"}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <TextField
              label="Event"
              fullWidth
              select
              required
              value={formData.event_id}
              onChange={(e) =>
                setFormData({ ...formData, event_id: e.target.value })
              }
              helperText="Select the event for this booth application"
              className="col-span-2"
              error={!formData.event_id}
              SelectProps={{
                displayEmpty: true,
              }}>
              <MenuItem value="">
                <em>Select an event</em>
              </MenuItem>
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.name} -{" "}
                  {new Date(event.start_date).toLocaleDateString()}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Applicant Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter applicant/company name"
              helperText="Name of the person or company applying"
              error={!formData.name.trim()}
            />

            <TextField
              label="Phone Number"
              fullWidth
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="628123456789"
              helperText="Contact phone number"
              error={!formData.phone.trim()}
            />

            {/* Status dropdown - show for both editing and creating */}
            <div className="col-span-2">
              <TextField
                label="Application Status"
                fullWidth
                select
                value={
                  editingBooth ? editingBooth.is_acc || "PENDING" : "PENDING"
                }
                onChange={(e) => {
                  if (editingBooth) {
                    // Update the editing booth status
                    setEditingBooth((prev) => ({
                      ...prev,
                      is_acc: e.target.value,
                    }));
                  }
                }}
                helperText={
                  editingBooth
                    ? "Change the status of this application"
                    : "New applications start as PENDING"
                }
                disabled={!editingBooth} // Only allow changes when editing
                SelectProps={{
                  displayEmpty: true,
                }}>
                <MenuItem value="PENDING">
                  <div className="flex items-center gap-2">
                    <Chip label="PENDING" color="warning" size="small" />
                    <span>Pending Review</span>
                  </div>
                </MenuItem>
                <MenuItem value="APPROVED">
                  <div className="flex items-center gap-2">
                    <Chip label="APPROVED" color="success" size="small" />
                    <span>Approved</span>
                  </div>
                </MenuItem>
                <MenuItem value="REJECTED">
                  <div className="flex items-center gap-2">
                    <Chip label="REJECTED" color="error" size="small" />
                    <span>Rejected</span>
                  </div>
                </MenuItem>
              </TextField>
            </div>

            <div className="col-span-2">
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
                placeholder="Describe the booth purpose, products, or services to be offered"
                helperText="Additional details about the booth application (optional)"
              />
            </div>

            {/* Application Info Section - only show when editing */}
            {editingBooth && (
              <div className="col-span-2 p-4 mt-4 rounded-lg bg-gray-50">
                <Typography variant="subtitle2" gutterBottom>
                  Application Information
                </Typography>
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <div>
                    <span className="font-medium">Application ID:</span> #
                    {editingBooth.id}
                  </div>
                  <div>
                    <span className="font-medium">Current Status:</span>{" "}
                    <Chip
                      label={editingBooth.is_acc || "PENDING"}
                      color={getStatusColor(editingBooth.is_acc)}
                      size="small"
                    />
                  </div>
                  <div>
                    <span className="font-medium">Event:</span>{" "}
                    {getEventTitle(editingBooth.event_id)}
                  </div>
                  <div>
                    <span className="font-medium">Contact:</span>{" "}
                    {editingBooth.phone ? `+${editingBooth.phone}` : "No phone"}
                  </div>
                </div>
              </div>
            )}
          </div>
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
              ${
                editLoading
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : ""
              }
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
              : editingBooth
              ? "Update Application"
              : "Submit Application"}
          </button>
        </DialogActions>
      </Dialog>

      {/* Delete Loading Dialog */}
      <Dialog
        open={deleteLoading}
        PaperProps={{ className: "shadow-none bg-transparent" }}>
        <Box className="flex items-center justify-center min-h-[200px] min-w-[280px] bg-white rounded-lg shadow-lg p-8 gap-4 flex-col">
          <span
            className="inline-block w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"
            style={{ borderRightColor: "transparent" }}
          />
          <span className="text-lg font-semibold text-red-700">
            Deleting booth application...
          </span>
        </Box>
      </Dialog>
    </div>
  );
}

export default EventBoothTab;
