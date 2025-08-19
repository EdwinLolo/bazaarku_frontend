// src/components/admin/EventTab.jsx
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CardMedia,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Image as ImageIcon,
  Close,
  Download,
  OpenInNew,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  getEventProduct,
  createEvent,
  updateEvent,
  deleteEvent,
  getAreaData,
  getEventData,
  getEventVendors,
  updateBooth,
} from "../models/admin";

function EventTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [boothDialogOpen, setBoothDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false); // New state for image dialog
  const [selectedEventBooths, setSelectedEventBooths] = useState(null);
  const [selectedImage, setSelectedImage] = useState({
    url: "",
    title: "",
    type: "",
  }); // New state for selected image
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "", // ✅ Add this for category name
    event_category_id: "", // This is for event_category_id
    location: "",
    booth_slot: 10, // Default booth slot
    contact: "",
    start_date: "",
    end_date: "",
    area_id: "",
    vendor_id: "",
    banner: "",
    permit_img: "",
    banner_file: null,
    permit_file: null,
    remove_banner: false,
    remove_permit: false,
  });

  // Mock categories and areas - replace with actual API calls
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const EventCategory = await getEventData();
      setCategories(EventCategory.data || []);

      const areaData = await getAreaData();
      setAreas(areaData.data || []);

      const vendorData = await getEventVendors();
      setVendors(vendorData.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const mockData = await getEventProduct();
      // console.log("Fetched events:", mockData.data);
      setEvents(mockData.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add these functions in your EventTab component
  const handleBoothStatusUpdate = async (
    applicationId,
    newStatus,
    applicationName
  ) => {
    try {
      const result = await Swal.fire({
        title: `${
          newStatus === "APPROVED" ? "Approve" : "Reject"
        } Application?`,
        text: `Are you sure you want to ${newStatus.toLowerCase()} "${applicationName}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: newStatus === "APPROVED" ? "#10B981" : "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: `Yes, ${newStatus.toLowerCase()} it!`,
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: "Updating...",
          text: "Please wait while we update the application status.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Update the booth status
        await updateBooth(applicationId, { is_acc: newStatus });

        // Close loading and show success
        Swal.close();

        // Update the local state to reflect the change
        setSelectedEventBooths((prev) => {
          if (!prev?.booth?.applications) return prev;

          const updatedApplications = prev.booth.applications.map((app) =>
            app.id === applicationId ? { ...app, is_acc: newStatus } : app
          );

          // Recalculate statistics
          const newStats = {
            total: updatedApplications.length,
            pending: updatedApplications.filter(
              (app) => app.is_acc === "PENDING"
            ).length,
            approved: updatedApplications.filter(
              (app) => app.is_acc === "APPROVED"
            ).length,
            rejected: updatedApplications.filter(
              (app) => app.is_acc === "REJECTED"
            ).length,
          };

          return {
            ...prev,
            booth: {
              ...prev.booth,
              applications: updatedApplications,
              statistics: newStats,
              count: updatedApplications.length,
            },
          };
        });

        // Also update the main events list to reflect changes
        setEvents((prev) =>
          prev.map((event) => {
            if (event.id === selectedEventBooths.id) {
              const updatedApplications = event.booth.applications.map((app) =>
                app.id === applicationId ? { ...app, is_acc: newStatus } : app
              );

              const newStats = {
                total: updatedApplications.length,
                pending: updatedApplications.filter(
                  (app) => app.is_acc === "PENDING"
                ).length,
                approved: updatedApplications.filter(
                  (app) => app.is_acc === "APPROVED"
                ).length,
                rejected: updatedApplications.filter(
                  (app) => app.is_acc === "REJECTED"
                ).length,
              };

              return {
                ...event,
                booth: {
                  ...event.booth,
                  applications: updatedApplications,
                  statistics: newStats,
                  count: updatedApplications.length,
                },
              };
            }
            return event;
          })
        );

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Application has been ${newStatus.toLowerCase()} successfully.`,
          timer: 2000,
          timerProgressBar: true,
        });
      }
      setBoothDialogOpen(true);
    } catch (error) {
      console.error("Error updating booth status:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.message ||
          "Failed to update application status. Please try again.",
      });
    }
  };

  const handleApproveApplication = (applicationId, applicationName) => {
    setBoothDialogOpen(false);
    handleBoothStatusUpdate(applicationId, "APPROVED", applicationName);
  };

  const handleRejectApplication = (applicationId, applicationName) => {
    setBoothDialogOpen(false);
    handleBoothStatusUpdate(applicationId, "REJECTED", applicationName);
  };

  const handleViewApplicationDetails = (application) => {
    setBoothDialogOpen(false);
    Swal.fire({
      title: "Application Details",
      html: `
      <div style="text-align: left; margin: 20px 0;">
        <p><strong>ID:</strong> ${application.id}</p>
        <p><strong>Booth Name:</strong> ${application.name}</p>
        <p><strong>Phone:</strong> ${
          application.phone ? `+${application.phone}` : "No phone provided"
        }</p>
        <p><strong>Status:</strong> <span style="color: ${
          application.is_acc === "APPROVED"
            ? "#10B981"
            : application.is_acc === "REJECTED"
            ? "#EF4444"
            : "#F59E0B"
        };">${application.is_acc || "PENDING"}</span></p>
        <p><strong>Description:</strong></p>
        <div style="background: #f9fafb; padding: 10px; border-radius: 6px; margin-top: 8px;">
          ${application.desc || "No description provided"}
        </div>
      </div>
    `,
      confirmButtonText: "Close",
      width: "500px",
    });
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: "",
      description: "",
      event_category_id: "",
      category: "", // ✅ Add this
      area_id: "",
      vendor_id: "",
      start_date: "",
      end_date: "",
      price: "",
      location: "",
      booth_slot: 10, // Default booth slot
      contact: "",
      banner: "",
      permit_img: "",
      banner_file: null,
      permit_file: null,
      remove_banner: false,
      remove_permit: false,
      status: "upcoming",
    });
    setDialogOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);

    // Extract category name from the event data
    const categoryName = event.event_category?.name || event.category || "";

    setFormData({
      name: event.name || "",
      description: event.description || "",
      event_category_id: event.event_category_id || "",
      category: categoryName, // ✅ Add this
      area_id: event.area_id || "",
      vendor_id: event.vendor_id || "",
      start_date: event.start_date || "",
      end_date: event.end_date || "",
      price: event.price || "",
      location: event.location || "",
      booth_slot: event.booth_slot || 10, // Default booth slot
      contact: event.contact || "",
      banner: event.banner || "",
      permit_img: event.permit_img || "",
      banner_file: null,
      permit_file: null,
      remove_banner: false,
      remove_permit: false,
      status: event.status || "upcoming",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the event permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeleteLoading(true);
        await deleteEvent(id);
        setEvents((prev) => prev.filter((event) => event.id !== id));
        Swal.fire("Deleted!", "Event has been deleted.", "success");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete event.",
        });
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Validation: Check required fields before sending
      if (
        !formData.name ||
        !formData.description ||
        !formData.event_category_id
      ) {
        Swal.fire({
          target: document.getElementById("event-dialog"),
          title: "Error!",
          text: "Please fill in all required fields.",
          icon: "error",
        });
        return;
      }

      // For create event, files are required
      if (!editingEvent && (!formData.banner_file || !formData.permit_file)) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Banner image and permit document are required for new events.",
          target: "#event-dialog",
        });
        return;
      }

      if (editingEvent) {
        setEditLoading(true);
      } else {
        setAddLoading(true);
      }

      const hasFiles = formData.banner_file || formData.permit_file;

      if (hasFiles) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();

        // Get category name from selected category
        const selectedCategory = categories.find(
          (cat) => cat.id == formData.event_category_id
        );
        const categoryName = selectedCategory ? selectedCategory.name : "";

        // console.log("Selected category:", selectedCategory);
        // console.log("Category name:", categoryName);

        // Add all required fields that backend expects
        const fieldsToAdd = {
          name: formData.name,
          description: formData.description,
          event_category_id: formData.event_category_id,
          category: categoryName, // ✅ Add this - backend requires it
          area_id: formData.area_id || "",
          vendor_id: formData.vendor_id || "",
          start_date: formData.start_date,
          end_date: formData.end_date,
          price: formData.price,
          booth_slot: formData.booth_slot || 10, // Default booth slot
          location: formData.location,
          contact: formData.contact,
        };

        // console.log("Fields to add:", fieldsToAdd);

        // Add all fields to FormData
        Object.keys(fieldsToAdd).forEach((key) => {
          if (fieldsToAdd[key] !== null && fieldsToAdd[key] !== undefined) {
            formDataToSend.append(key, fieldsToAdd[key]);
          }
        });

        // Add files
        if (formData.banner_file) {
          formDataToSend.append("banner_image", formData.banner_file);
        }
        if (formData.permit_file) {
          formDataToSend.append("permit_img", formData.permit_file);
        }

        // Debug: Log what we're sending
        // console.log("Sending FormData:");
        // for (let pair of formDataToSend.entries()) {
        //   if (pair[1] instanceof File) {
        //     console.log(pair[0] + ": [File: " + pair[1].name + "]");
        //   } else {
        //     console.log(pair[0] + ": " + pair[1]);
        //   }
        // }

        if (editingEvent) {
          await updateEvent(editingEvent.id, formDataToSend);
        } else {
          await createEvent(formDataToSend);
        }
      } else {
        // Use regular JSON for text-only updates
        const selectedCategory = categories.find(
          (cat) => cat.id == formData.event_category_id
        );
        const categoryName = selectedCategory ? selectedCategory.name : "";

        const jsonData = {
          name: formData.name,
          description: formData.description,
          event_category_id: formData.event_category_id,
          category: categoryName, // ✅ Add this
          area_id: formData.area_id || null,
          vendor_id: formData.vendor_id || null,
          start_date: formData.start_date,
          end_date: formData.end_date,
          price: formData.price,
          location: formData.location,
          booth_slot: formData.booth_slot || 10, // Default booth slot
          contact: formData.contact,
          banner: formData.banner,
          permit_img: formData.permit_img,
          remove_banner: formData.remove_banner,
          remove_permit: formData.remove_permit,
        };

        // console.log("Sending JSON data:", jsonData);

        if (editingEvent) {
          await updateEvent(editingEvent.id, jsonData);
        } else {
          await createEvent(jsonData);
        }
      }

      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent?.id ? { ...event, ...formData } : event
        )
      );

      Swal.fire(
        editingEvent ? "Updated!" : "Added!",
        `Event ${editingEvent ? "updated" : "added"} successfully.`,
        "success"
      );

      setDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        target: document.getElementById("event-dialog"),
        title: "Error!",
        text: error.message || "Failed to save event.",
        icon: "error",
      });
    } finally {
      setAddLoading(false);
      setEditLoading(false);
    }
  };

  // Handle booth applications view
  const handleViewBooths = (event) => {
    setSelectedEventBooths(event);
    setBoothDialogOpen(true);
  };

  // Handle image preview
  const handleViewImage = (imageUrl, title, type) => {
    if (!imageUrl) {
      Swal.fire({
        icon: "info",
        title: "No Image",
        text: `No ${type} image available for this event.`,
      });
      return;
    }
    setSelectedImage({ url: imageUrl, title, type });
    setImageDialogOpen(true);
  };

  // Handle image download
  const handleDownloadImage = () => {
    if (selectedImage.url) {
      const link = document.createElement("a");
      link.href = selectedImage.url;
      link.download = `${selectedImage.title}_${selectedImage.type}.jpg`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle open image in new tab
  const handleOpenImageNewTab = () => {
    if (selectedImage.url) {
      window.open(selectedImage.url, "_blank");
    }
  };

  // Get status color for booth applications
  const getBoothStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  // Fixed columns with proper value extraction
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Event Title", width: 200 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => {
        if (typeof params.row.category === "string") {
          return params.row.category;
        }
        return (
          params.row.event_category?.name || params.row.category || "Unknown"
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params) => (
        <div className="truncate" title={params.value}>
          {params.value || "No description"}
        </div>
      ),
    },
    { field: "location", headerName: "Location", width: 120 },
    { field: "booth_slot", headerName: "Booth Slot", width: 120 },
    { field: "contact", headerName: "Contact", width: 120 },
    { field: "start_date", headerName: "Start Date", width: 120 },
    { field: "end_date", headerName: "End Date", width: 120 },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      renderCell: (params) => (
        <span>
          {params.value ? `Rp ${params.value.toLocaleString()}` : "Free"}
        </span>
      ),
    },
    {
      field: "banner",
      headerName: "Banner",
      width: 120,
      renderCell: (params) => (
        <div className="flex items-center space-x-1">
          {params.value ? (
            <>
              <Chip
                label="View"
                size="small"
                color="primary"
                icon={<ImageIcon />}
                onClick={() =>
                  handleViewImage(params.value, params.row.name, "banner")
                }
                style={{ cursor: "pointer" }}
              />
            </>
          ) : (
            <Chip label="No Banner" size="small" color="default" />
          )}
        </div>
      ),
    },
    {
      field: "permit_img",
      headerName: "Permit Image",
      width: 140,
      renderCell: (params) => (
        <div className="flex items-center space-x-1">
          {params.value ? (
            <>
              <Chip
                label="View"
                size="small"
                color="secondary"
                icon={<ImageIcon />}
                onClick={() =>
                  handleViewImage(params.value, params.row.name, "permit")
                }
                style={{ cursor: "pointer" }}
              />
            </>
          ) : (
            <Chip label="No Permit" size="small" color="default" />
          )}
        </div>
      ),
    },
    {
      field: "area",
      headerName: "Area",
      width: 150,
      renderCell: (params) => {
        return params.row.area?.name || "Unknown Area";
      },
    },
    {
      field: "vendor",
      headerName: "Vendor",
      width: 150,
      renderCell: (params) => {
        return params.row.vendor?.name || "No Vendor";
      },
    },
    {
      field: "booth",
      headerName: "Booth Applications",
      width: 250,
      renderCell: (params) => {
        const booth = params.row.booth;
        if (!booth || booth.count === 0) {
          return <Chip label="No Applications" size="small" color="default" />;
        }

        return (
          <div className="flex items-center space-x-1">
            <Chip label={`${booth.count} Total`} size="small" color="primary" />
            {booth.statistics.pending > 0 && (
              <Chip
                label={`${booth.statistics.pending} Pending`}
                size="small"
                color="warning"
              />
            )}
            {booth.statistics.approved > 0 && (
              <Chip
                label={`${booth.statistics.approved} Approved`}
                size="small"
                color="success"
              />
            )}
            <IconButton
              size="small"
              onClick={() => handleViewBooths(params.row)}
              color="info"
              title="View Applications">
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "ongoing"
              ? "success"
              : params.value === "upcoming"
              ? "info"
              : params.value === "completed"
              ? "default"
              : "error"
          }
          size="small"
        />
      ),
    },
    {
      field: "average_rating",
      headerName: "Rating",
      width: 110,
      renderCell: (params) => {
        const avgRaw = params.row.average_rating;
        const hasValue =
          avgRaw !== null && avgRaw !== undefined && avgRaw !== "";
        if (!hasValue || Number(avgRaw) === 0) {
          return <span style={{ color: "#888" }}>-</span>;
        }
        const avg = Number(avgRaw);
        return (
          <div
            style={{ display: "flex", alignItems: "center", gap: 4 }}
            title={`Average rating ${avg.toFixed(2)} / 5`}>
            <span>{avg.toFixed(2)}</span>
            <span style={{ color: "#f5b400" }}>★</span>
          </div>
        );
      },
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
          <h2 className="text-lg font-semibold text-gray-900">Events</h2>
          <p className="text-sm text-gray-600">Manage events and schedules</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Event</span>
        </button>
      </div>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={events}
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

      {/* Event Edit/Add Dialog */}
      <Dialog
        id="event-dialog"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>
          {editingEvent ? "Edit Event" : "Add New Event"}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <TextField
              label="Event Name"
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
              value={formData.event_category_id}
              onChange={(e) =>
                setFormData({ ...formData, event_category_id: e.target.value })
              }>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Area"
              fullWidth
              select
              value={formData.area_id}
              onChange={(e) =>
                setFormData({ ...formData, area_id: e.target.value })
              }>
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Add Vendor Selection */}
            <TextField
              label="Vendor (Optional)"
              fullWidth
              select
              value={formData.vendor_id}
              onChange={(e) =>
                setFormData({ ...formData, vendor_id: e.target.value })
              }>
              <MenuItem value="">
                <em>No Vendor Selected</em>
              </MenuItem>
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
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
              label="Booth Slot"
              fullWidth
              value={formData.booth_slot}
              onChange={(e) =>
                setFormData({ ...formData, booth_slot: e.target.value })
              }
            />
            <TextField
              label="Contact"
              fullWidth
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            {/* Banner Upload Section */}
            <div className="col-span-2">
              <Typography variant="subtitle2" gutterBottom>
                Banner Image
              </Typography>

              {/* Current Banner Display */}
              {editingEvent && formData.banner && !formData.remove_banner && (
                <Box mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom>
                    Current Banner:
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <img
                      src={formData.banner}
                      alt="Current banner"
                      style={{
                        width: 100,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() =>
                          handleViewImage(
                            formData.banner,
                            formData.name,
                            "banner"
                          )
                        }>
                        View
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                          setFormData({ ...formData, remove_banner: true })
                        }>
                        Remove
                      </Button>
                    </div>
                  </div>
                </Box>
              )}

              {/* Banner Upload Input */}
              {(!editingEvent ||
                !formData.banner ||
                formData.remove_banner) && (
                <TextField
                  label="Banner URL"
                  fullWidth
                  value={formData.banner}
                  onChange={(e) =>
                    setFormData({ ...formData, banner: e.target.value })
                  }
                  margin="normal"
                  helperText="Enter image URL or upload a file below"
                />
              )}

              {/* File Upload for Banner */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({
                      ...formData,
                      banner_file: file,
                      banner: "", // Clear URL if file is selected
                      remove_banner: false,
                    });
                  }
                }}
                style={{
                  marginTop: 8,
                  cursor: "pointer",
                  background: "#f5f5f5",
                  borderRadius: 4,
                  padding: "4px 8px",
                }}
              />
              {formData.banner_file && (
                <Typography variant="body2" color="primary" mt={1}>
                  New file selected: {formData.banner_file.name}
                </Typography>
              )}
            </div>

            {/* Permit Upload Section */}
            <div className="col-span-2">
              <Typography variant="subtitle2" gutterBottom>
                Permit Document
              </Typography>

              {/* Current Permit Display */}
              {editingEvent &&
                formData.permit_img &&
                !formData.remove_permit && (
                  <Box mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom>
                      Current Permit:
                    </Typography>
                    <div className="flex items-center space-x-2">
                      <img
                        src={formData.permit_img}
                        alt="Current permit"
                        style={{
                          width: 100,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() =>
                            handleViewImage(
                              formData.permit_img,
                              formData.name,
                              "permit"
                            )
                          }>
                          View
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() =>
                            setFormData({ ...formData, remove_permit: true })
                          }>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Box>
                )}

              {/* Permit Upload Input */}
              {(!editingEvent ||
                !formData.permit_img ||
                formData.remove_permit) && (
                <TextField
                  label="Permit Image URL"
                  fullWidth
                  value={formData.permit_img}
                  onChange={(e) =>
                    setFormData({ ...formData, permit_img: e.target.value })
                  }
                  margin="normal"
                  helperText="Enter image URL or upload a file below"
                />
              )}

              {/* File Upload for Permit */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({
                      ...formData,
                      permit_file: file,
                      permit_img: "", // Clear URL if file is selected
                      remove_permit: false,
                    });
                  }
                }}
                style={{
                  marginTop: 8,
                  cursor: "pointer",
                  background: "#f5f5f5",
                  borderRadius: 4,
                  padding: "4px 8px",
                }}
              />
              {formData.permit_file && (
                <Typography variant="body2" color="primary" mt={1}>
                  New file selected: {formData.permit_file.name}
                </Typography>
              )}
            </div>
          </div>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
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
                            ${
                              addLoading
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : ""
                            }
                            ${
                              editLoading
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : ""
                            }
                            ${
                              deleteLoading
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : ""
                            }
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
                                    ${
                                      addLoading
                                        ? "border-white border-t-green-200"
                                        : ""
                                    }
                                    ${
                                      editLoading
                                        ? "border-white border-t-yellow-200"
                                        : ""
                                    }
                                    ${
                                      deleteLoading
                                        ? "border-white border-t-red-200"
                                        : ""
                                    }
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
              : editingEvent
              ? "Update Event"
              : "Add Event"}
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
            Deleting event...
          </span>
        </Box>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>
          <div className="flex items-center justify-between">
            <Typography variant="h6">
              {selectedImage.title} -{" "}
              {selectedImage.type === "banner" ? "Banner" : "Permit Image"}
            </Typography>
            <div className="flex space-x-1">
              <IconButton
                onClick={handleDownloadImage}
                color="primary"
                title="Download Image"
                size="small">
                <Download />
              </IconButton>
              <IconButton
                onClick={handleOpenImageNewTab}
                color="primary"
                title="Open in New Tab"
                size="small">
                <OpenInNew />
              </IconButton>
              <IconButton
                onClick={() => setImageDialogOpen(false)}
                size="small">
                <Close />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "300px" }}>
            <CardMedia
              component="img"
              image={selectedImage.url}
              alt={`${selectedImage.title} ${selectedImage.type}`}
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <Box
              display="none"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "300px" }}>
              <ImageIcon style={{ fontSize: 64, color: "#ccc" }} />
              <Typography variant="body1" color="textSecondary" mt={2}>
                Failed to load image
              </Typography>
              <Typography variant="body2" color="textSecondary">
                The image URL might be invalid or the image might not be
                accessible.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Booth Applications Dialog (keeping existing code) */}
      <Dialog
        open={boothDialogOpen}
        onClose={() => setBoothDialogOpen(false)}
        maxWidth="lg"
        fullWidth>
        <DialogTitle>
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h6">
                Booth Applications for "{selectedEventBooths?.name}"
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Event ID: {selectedEventBooths?.id} | Duration:{" "}
                {selectedEventBooths?.start_date} to{" "}
                {selectedEventBooths?.end_date}
              </Typography>
            </div>
            <div className="flex space-x-2">
              <Chip
                label={`${
                  selectedEventBooths?.booth?.count || 0
                } Total Applications`}
                color="primary"
                size="small"
              />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedEventBooths?.booth?.applications?.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Booth Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Phone</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedEventBooths.booth.applications.map((application) => (
                    <TableRow key={application.id} hover>
                      <TableCell>{application.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {application.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {application.phone
                            ? `+${application.phone}`
                            : "No phone"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={application.desc}>
                          {application.desc || "No description"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={application.is_acc || "PENDING"}
                          color={getBoothStatusColor(application.is_acc)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {application.is_acc === "PENDING" && (
                            <>
                              <Button
                                size="small"
                                color="success"
                                variant="outlined"
                                onClick={() =>
                                  handleApproveApplication(
                                    application.id,
                                    application.name
                                  )
                                }
                                startIcon={<CheckIcon />}>
                                Approve
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() =>
                                  handleRejectApplication(
                                    application.id,
                                    application.name
                                  )
                                }
                                startIcon={<CloseIcon />}>
                                Reject
                              </Button>
                            </>
                          )}
                          {application.is_acc !== "PENDING" && (
                            <Chip
                              label={`${application.is_acc} ✓`}
                              color={getBoothStatusColor(application.is_acc)}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleViewApplicationDetails(application)
                            }
                            title="View Details">
                            <Visibility />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={4}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Booth Applications
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No vendors have applied for booths in this event yet.
              </Typography>
            </Box>
          )}

          {selectedEventBooths?.booth?.statistics && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Application Statistics:
              </Typography>
              <div className="flex space-x-2">
                <Chip
                  label={`${selectedEventBooths.booth.statistics.total} Total`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={`${selectedEventBooths.booth.statistics.pending} Pending`}
                  color="warning"
                  size="small"
                />
                <Chip
                  label={`${selectedEventBooths.booth.statistics.approved} Approved`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`${selectedEventBooths.booth.statistics.rejected} Rejected`}
                  color="error"
                  size="small"
                />
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBoothDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EventTab;
