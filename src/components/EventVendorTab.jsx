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
import imageCompression from "browser-image-compression";
import {
  getEventVendors,
  createEventVendor,
  updateEventVendor,
  deleteEventVendor,
  getUserData,
} from "../models/admin";

function EventVendorTab() {
  const [vendors, setVendors] = useState([]);
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
    location: "",
    user_id: "",
    banner: "",
    banner_file: null,
    remove_banner: false,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
    fetchUsers();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getEventVendors();
      // console.log("Fetched vendors:", response.data);
      setVendors(response.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUserData();
      // console.log("Fetched users:", response);

      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        // console.warn("Unexpected user data format:", response);
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
      // console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      // console.log(
      //   `Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
      // );
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  // Handle banner file upload
  const handleBannerFileChange = async (e) => {
    const file = e.target.files[0];
    // console.log("File selected:", file);

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Please select an image smaller than 10MB.",
          target: "#event-vendor-form-dialog",
        });
        e.target.value = "";
        return;
      }

      try {
        Swal.fire({
          title: "Processing Image...",
          text: "Compressing image for upload",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const compressedFile = await compressImage(file);
        // console.log("Compressed file:", compressedFile);

        setFormData((prev) => ({
          ...prev,
          banner_file: compressedFile,
          banner: "", // Clear banner URL when file is selected
          remove_banner: editingVendor && editingVendor.banner ? true : false, // Set to true if replacing existing banner
        }));

        Swal.close();
      } catch (error) {
        console.error("Compression error:", error);
        Swal.fire({
          icon: "error",
          title: "Compression Failed",
          text: "Failed to process the image. Please try a different image.",
          target: "#event-vendor-form-dialog",
        });
      }
    }
  };

  const handleAdd = () => {
    setEditingVendor(null);
    setFormData({
      name: "",
      desc: "",
      phone: "", // Ensure it's a string
      insta: "",
      location: "",
      user_id: "",
      banner: "",
      banner_file: null,
      remove_banner: false,
    });
    setDialogOpen(true);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || "",
      desc: vendor.desc || "",
      phone: vendor.phone ? String(vendor.phone) : "", // Convert to string
      insta: vendor.insta || "",
      location: vendor.location || "",
      user_id: vendor.user_id || "",
      banner: vendor.banner || "",
      banner_file: null,
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
        setDeleteLoading(true);
        await deleteEventVendor(id);
        setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
        Swal.fire("Deleted!", "Vendor has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete vendor.",
        });
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Vendor name is required.",
          target: "#event-vendor-form-dialog",
        });
        return;
      }
      if (!formData.user_id) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Please select a user for this vendor.",
          target: "#event-vendor-form-dialog",
        });
        return;
      }

      const hasBannerFile = formData.banner_file;
      const hasBannerUrl = formData.banner && formData.banner.trim();

      // Banner validation logic
      if (!editingVendor && !hasBannerFile && !hasBannerUrl) {
        Swal.fire(
          "Error!",
          "Banner is required. Please provide either a banner URL or upload a banner image.",
          "error"
        );
        return;
      }

      if (
        editingVendor &&
        !hasBannerFile &&
        !hasBannerUrl &&
        (!editingVendor.banner || formData.remove_banner)
      ) {
        Swal.fire(
          "Error!",
          "Banner is required. Please provide either a banner URL or upload a banner image.",
          "error"
        );
        return;
      }

      if (editingVendor) {
        setEditLoading(true);
        // For updates, always use FormData to ensure compatibility with multer
        const formDataToSend = new FormData();

        // Helper function to safely convert to string and trim
        const safeStringTrim = (value) => {
          if (value === null || value === undefined) return "";
          return String(value).trim();
        };

        // Add all text fields with safe string conversion
        const fieldsToAdd = {
          name: safeStringTrim(formData.name),
          desc: safeStringTrim(formData.desc),
          phone: safeStringTrim(formData.phone),
          insta: safeStringTrim(formData.insta),
          location: safeStringTrim(formData.location),
          user_id: formData.user_id,
        };

        // Handle banner logic
        if (hasBannerFile) {
          // If uploading a new file, remove the old banner
          fieldsToAdd.remove_banner = "true";
          // console.log(
          //   "Setting remove_banner to true because new file is being uploaded"
          // );
        } else if (formData.remove_banner) {
          // If explicitly removing banner
          fieldsToAdd.remove_banner = "true";
          // console.log(
          //   "Setting remove_banner to true because user explicitly removed banner"
          // );
        } else if (hasBannerUrl) {
          // If updating with URL
          fieldsToAdd.banner = safeStringTrim(formData.banner);
          fieldsToAdd.remove_banner = "false";
          // console.log("Setting banner URL and remove_banner to false");
        } else {
          // Keep existing banner
          fieldsToAdd.remove_banner = "false";
          // console.log("Keeping existing banner, remove_banner set to false");
        }

        // console.log("Banner logic:", {
        //   hasBannerFile,
        //   hasBannerUrl,
        //   formDataRemoveBanner: formData.remove_banner,
        //   finalRemoveBanner: fieldsToAdd.remove_banner,
        //   existingBanner: editingVendor.banner,
        // });

        // Append all fields to FormData
        Object.entries(fieldsToAdd).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            formDataToSend.append(key, value);
            // console.log(`Added to FormData: ${key} = ${value}`);
          }
        });

        // Add the file if present
        if (hasBannerFile) {
          formDataToSend.append("banner_image", formData.banner_file);
          // console.log("Added file to FormData:", {
          //   fieldName: "banner_image",
          //   name: formData.banner_file.name,
          //   size: formData.banner_file.size,
          //   type: formData.banner_file.type,
          // });
        }

        // console.log("=== SENDING UPDATE ===");
        // console.log("Vendor ID:", editingVendor.id);
        // console.log("FormData entries:");
        // for (let [key, value] of formDataToSend.entries()) {
        //   if (value instanceof File) {
        //     console.log(`${key}: File(${value.name})`);
        //   } else {
        //     console.log(`${key}: ${value}`);
        //   }
        // }

        await updateEventVendor(editingVendor.id, formDataToSend);
      } else {
        setAddLoading(true);
        // For creating new vendors
        if (hasBannerFile) {
          // Use FormData for file uploads
          const formDataToSend = new FormData();

          // Helper function for safe string conversion
          const safeStringTrim = (value) => {
            if (value === null || value === undefined) return "";
            return String(value).trim();
          };

          const fieldsToAdd = {
            name: safeStringTrim(formData.name),
            desc: safeStringTrim(formData.desc),
            phone: safeStringTrim(formData.phone),
            insta: safeStringTrim(formData.insta),
            location: safeStringTrim(formData.location),
            user_id: formData.user_id,
          };

          Object.entries(fieldsToAdd).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              formDataToSend.append(key, value);
            }
          });

          formDataToSend.append("banner_image", formData.banner_file);
          await createEventVendor(formDataToSend);
        } else {
          // Use JSON for URL-only creates
          const processedData = {
            name: formData.name.trim(),
            desc: formData.desc ? formData.desc.trim() : "",
            phone: formData.phone
              ? parseInt(String(formData.phone).trim())
              : null,
            insta: formData.insta ? formData.insta.trim() : "",
            location: formData.location ? formData.location.trim() : "",
            user_id: formData.user_id,
            banner: formData.banner ? formData.banner.trim() : "",
          };
          await createEventVendor(processedData);
        }
      }

      Swal.fire(
        editingVendor ? "Updated!" : "Added!",
        `Vendor ${editingVendor ? "updated" : "added"} successfully.`,
        "success"
      );
      setDialogOpen(false);
      fetchVendors();
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to save vendor.",
        target: "#event-vendor-form-dialog",
      });
    } finally {
      setAddLoading(false);
      setEditLoading(false);
    }
  };

  // Add this function to clear the selected file
  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      banner_file: null,
      remove_banner: false, // Reset remove_banner when removing file selection
    }));

    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle banner preview
  const handleViewImage = (imageUrl, title) => {
    if (!imageUrl) {
      Swal.fire({
        icon: "info",
        title: "No Banner",
        text: "No banner image available for this vendor.",
      });
      return;
    }
    setSelectedImage({ url: imageUrl, title });
    setImageDialogOpen(true);
  };

  // Handle image download
  const handleDownloadImage = () => {
    if (selectedImage.url) {
      const link = document.createElement("a");
      link.href = selectedImage.url;
      link.download = `${selectedImage.title}_banner.jpg`;
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
      field: "user",
      headerName: "User Info",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
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
              onClick={() => handleViewImage(params.value, params.row.name)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <Chip label="No Banner" size="small" color="default" />
          )}
        </div>
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
          rows={vendors}
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
        fullWidth
        id="event-vendor-form-dialog">
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
                          handleViewImage(formData.banner, formData.name)
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

              {/* Banner URL Input */}
              {(!editingVendor ||
                !formData.banner ||
                formData.remove_banner ||
                !formData.banner_file) && (
                <TextField
                  label="Banner URL"
                  fullWidth
                  required={!editingVendor && !formData.banner_file}
                  value={formData.banner}
                  onChange={(e) =>
                    setFormData({ ...formData, banner: e.target.value })
                  }
                  margin="normal"
                  helperText={
                    !editingVendor
                      ? "Required: Enter image URL or upload a file below"
                      : "Enter image URL or upload a file below"
                  }
                  error={
                    !editingVendor &&
                    !formData.banner_file &&
                    !formData.banner.trim()
                  }
                />
              )}

              {/* File Upload for Banner */}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerFileChange}
                style={{
                  marginTop: 8,
                  cursor: "pointer",
                  background: "#f5f5f5",
                  borderRadius: 4,
                  padding: "4px 8px",
                }}
                key={editingVendor?.id || "new"} // Add this to reset file input
              />
              {formData.banner_file && (
                <Box mt={1} p={2} border="1px solid #2196f3" borderRadius={1}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" color="primary">
                        New file selected: {formData.banner_file.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Size:{" "}
                        {(formData.banner_file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                        {editingVendor &&
                          editingVendor.banner &&
                          " (will replace current banner)"}
                      </Typography>
                    </div>
                    <Button
                      size="small"
                      color="error"
                      onClick={handleRemoveFile}>
                      Remove File
                    </Button>
                  </div>
                </Box>
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
              : editingVendor
              ? "Update Vendor"
              : "Add Vendor"}
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
            Deleting vendor...
          </span>
        </Box>
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
              alt="Vendor banner"
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
                Failed to load banner image
              </Typography>
              <Typography variant="body2" color="textSecondary">
                The image URL might be invalid or the image might not be
                accessible.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventVendorTab;
