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
      console.log("Fetched events:", mockData.data);
      setEvents(mockData.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
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
        await deleteEvent(id);
        setEvents((prev) => prev.filter((event) => event.id !== id));
        Swal.fire("Deleted!", "Event has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete event.", "error");
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
        Swal.fire("Error!", "Please fill in all required fields.", "error");
        return;
      }

      // For create event, files are required
      if (!editingEvent && (!formData.banner_file || !formData.permit_file)) {
        Swal.fire(
          "Error!",
          "Banner image and permit document are required for new events.",
          "error"
        );
        return;
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

        console.log("Selected category:", selectedCategory);
        console.log("Category name:", categoryName);

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
          location: formData.location,
          contact: formData.contact,
        };

        console.log("Fields to add:", fieldsToAdd);

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
        console.log("Sending FormData:");
        for (let pair of formDataToSend.entries()) {
          if (pair[1] instanceof File) {
            console.log(pair[0] + ": [File: " + pair[1].name + "]");
          } else {
            console.log(pair[0] + ": " + pair[1]);
          }
        }

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
          contact: formData.contact,
          banner: formData.banner,
          permit_img: formData.permit_img,
          remove_banner: formData.remove_banner,
          remove_permit: formData.remove_permit,
        };

        console.log("Sending JSON data:", jsonData);

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
      Swal.fire("Error!", error.message || "Failed to save event.", "error");
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
    { field: "contact", headerName: "Contact", width: 120 },
    { field: "start_date", headerName: "Start Date", width: 120 },
    { field: "end_date", headerName: "End Date", width: 120 },
    {
      field: "price",
      headerName: "Price",
      width: 100,
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
      width: 200,
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
                style={{ marginTop: 8 }}
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
                style={{ marginTop: 8 }}
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
          <Button onClick={handleSubmit} variant="contained">
            {editingEvent ? "Update" : "Add"}
          </Button>
        </DialogActions>
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
                                onClick={() => {
                                  console.log(
                                    "Approve application:",
                                    application.id
                                  );
                                }}>
                                Approve
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => {
                                  console.log(
                                    "Reject application:",
                                    application.id
                                  );
                                }}>
                                Reject
                              </Button>
                            </>
                          )}
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              console.log("View details:", application);
                            }}>
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
