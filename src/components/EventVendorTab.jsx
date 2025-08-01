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
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Image as ImageIcon,
  Close,
} from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression"; // Add this import
import {
  getEventVendors,
  createEventVendor,
  updateEventVendor,
  deleteEventVendor,
  getUserData,
} from "../models/admin";

function EventVendorTab() {
  const [eventVendors, setEventVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    phone: "",
    insta: "",
    banner: "",
    banner_file: null, // Add for file upload
    location: "",
    user_id: "",
    remove_banner: false, // Add for banner removal
  });

  useEffect(() => {
    fetchEventVendors();
    fetchUsers();
  }, []);

  const fetchEventVendors = async () => {
    setLoading(true);
    try {
      const response = await getEventVendors();
      console.log("Fetched vendors:", response.data);
      setEventVendors(response.data || []);
    } catch (error) {
      console.error("Error fetching event vendors:", error);
      setEventVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUserData();
      console.log("Fetched users:", response);

      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response && response.users && Array.isArray(response.users)) {
        setUsers(response.users);
      } else {
        console.warn("Unexpected user data format:", response);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  // Image compression function
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg",
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(
        `Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
      );
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  // Handle banner file upload
  const handleBannerFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Please select an image smaller than 10MB.",
        });
        e.target.value = "";
        return;
      }

      try {
        // Show compression loading
        Swal.fire({
          title: "Processing Image...",
          text: "Compressing image for upload",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const compressedFile = await compressImage(file);

        setFormData({
          ...formData,
          banner_file: compressedFile,
          banner: "", // Clear URL if file is selected
          remove_banner: false,
        });

        Swal.close();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Compression Failed",
          text: "Failed to process the image. Please try a different image.",
        });
      }
    }
  };

  const handleAdd = () => {
    setEditingVendor(null);
    setFormData({
      name: "",
      desc: "",
      phone: "",
      insta: "",
      banner: "",
      banner_file: null,
      location: "",
      user_id: "",
      remove_banner: false,
    });
    setDialogOpen(true);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || "",
      desc: vendor.desc || "",
      phone: vendor.phone || "",
      insta: vendor.insta || "",
      banner: vendor.banner || "",
      banner_file: null, // Reset file field
      location: vendor.location || "",
      user_id: vendor.user_id || "",
      remove_banner: false,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the vendor permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteEventVendor(id);
        setEventVendors((prev) => prev.filter((vendor) => vendor.id !== id));
        Swal.fire("Deleted!", "Vendor has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete vendor.", "error");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        Swal.fire("Error!", "Vendor name is required.", "error");
        return;
      }

      if (!formData.user_id) {
        Swal.fire("Error!", "Please select a user for this vendor.", "error");
        return;
      }

      // Check if we have files to upload
      const hasFiles = formData.banner_file;

      if (hasFiles) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();

        // Add text fields
        const fieldsToAdd = {
          name: formData.name,
          desc: formData.desc,
          phone: formData.phone,
          insta: formData.insta,
          location: formData.location,
          user_id: formData.user_id,
          remove_banner: formData.remove_banner || false,
        };

        Object.keys(fieldsToAdd).forEach((key) => {
          if (fieldsToAdd[key] !== null && fieldsToAdd[key] !== undefined) {
            formDataToSend.append(key, fieldsToAdd[key]);
          }
        });

        // Add banner file
        if (formData.banner_file) {
          formDataToSend.append("banner_image", formData.banner_file);
        }

        if (editingVendor) {
          await updateEventVendor(editingVendor.id, formDataToSend);
        } else {
          await createEventVendor(formDataToSend);
        }
      } else {
        // Use regular JSON for text-only updates
        const processedData = {
          name: formData.name,
          desc: formData.desc,
          phone: formData.phone ? parseInt(formData.phone) : null,
          insta: formData.insta,
          banner: formData.banner,
          location: formData.location,
          user_id: formData.user_id,
          remove_banner: formData.remove_banner,
        };

        if (editingVendor) {
          await updateEventVendor(editingVendor.id, processedData);
        } else {
          await createEventVendor(processedData);
        }
      }

      Swal.fire(
        editingVendor ? "Updated!" : "Added!",
        `Vendor ${editingVendor ? "updated" : "added"} successfully.`,
        "success"
      );

      setDialogOpen(false);
      fetchEventVendors(); // Refresh to get updated data
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire("Error!", error.message || "Failed to save vendor.", "error");
    }
  };

  // Handle banner preview
  const handleViewBanner = (bannerUrl, vendorName) => {
    if (!bannerUrl) {
      Swal.fire({
        icon: "info",
        title: "No Banner",
        text: "No banner image available for this vendor.",
      });
      return;
    }
    setSelectedImage({ url: bannerUrl, title: vendorName });
    setImageDialogOpen(true);
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : "Unknown User";
  };

  // Get user email by ID
  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.email : "No email";
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "name",
      headerName: "Vendor Name",
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "banner",
      headerName: "Banner",
      width: 120,
      renderCell: (params) => (
        <div className="flex items-center space-x-1">
          {params.value ? (
            <Chip
              label="View"
              size="small"
              color="primary"
              icon={<ImageIcon />}
              onClick={() => handleViewBanner(params.value, params.row.name)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <Chip label="No Banner" size="small" color="default" />
          )}
        </div>
      ),
    },
    {
      field: "desc",
      headerName: "Description",
      width: 200,
      renderCell: (params) => (
        <div className="truncate" title={params.value}>
          {params.value || "No description"}
        </div>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => (
        <span>{params.value ? `+${params.value}` : "No phone"}</span>
      ),
    },
    {
      field: "insta",
      headerName: "Instagram",
      width: 150,
      renderCell: (params) => (
        <span>{params.value ? `@${params.value}` : "No Instagram"}</span>
      ),
    },
    { field: "location", headerName: "Location", width: 150 },
    {
      field: "user",
      headerName: "User Info",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" space={1}>
          <Avatar
            sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
            style={{ marginRight: 8 }}>
            {params.row.user?.first_name?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {params.row.user
                ? `${params.row.user.first_name} ${params.row.user.last_name}`
                : getUserName(params.row.user_id)}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.user?.email || getUserEmail(params.row.user_id)}
            </Typography>
          </Box>
        </Box>
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
          <h2 className="text-lg font-semibold text-gray-900">Vendors</h2>
          <p className="text-sm text-gray-600">
            Manage vendors and their information
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Vendor</span>
        </button>
      </div>

      <div style={{ height: 600, width: "100%" }}>
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>
          {editingVendor ? "Edit Vendor" : "Add New Vendor"}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <TextField
              label="Vendor Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <TextField
              label="User"
              fullWidth
              select
              required
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              helperText="Select the user who owns this vendor">
              <MenuItem value="">
                <em>Select a user</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Phone Number"
              fullWidth
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="628123456789"
            />

            <TextField
              label="Instagram Username"
              fullWidth
              value={formData.insta}
              onChange={(e) =>
                setFormData({ ...formData, insta: e.target.value })
              }
              placeholder="vendorusername"
              helperText="Without @ symbol"
            />

            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Jakarta, Indonesia"
            />

            {/* Banner Upload Section */}
            <div className="col-span-2">
              <Typography variant="subtitle2" gutterBottom>
                Banner Image
              </Typography>

              {/* Current Banner Display */}
              {editingVendor && formData.banner && !formData.remove_banner && (
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
                          handleViewBanner(formData.banner, formData.name)
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

              {/* Banner URL Input (for new vendors or when no banner exists) */}
              {(!editingVendor ||
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
                onChange={handleBannerFileChange}
                style={{ marginTop: 8 }}
              />
              {formData.banner_file && (
                <Typography variant="body2" color="primary" mt={1}>
                  File selected: {formData.banner_file.name}(
                  {(formData.banner_file.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </div>
          </div>

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            margin="normal"
            placeholder="Describe the vendor's business, specialties, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVendor ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Banner Preview Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>
          <div className="flex items-center justify-between">
            <Typography variant="h6">
              Banner Preview - {selectedImage.title}
            </Typography>
            <IconButton onClick={() => setImageDialogOpen(false)}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "300px" }}>
            <img
              src={selectedImage.url}
              alt="Vendor banner"
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "8px",
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
              style={{ minHeight: "300px" }}>
              <ImageIcon style={{ fontSize: 64, color: "#ccc" }} />
              <Typography variant="body1" color="textSecondary" mt={2}>
                Failed to load banner image
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventVendorTab;
