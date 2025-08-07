// src/components/admin/BannersTab.jsx
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
  Box,
  Typography,
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

// You'll need to create these API functions
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../models/admin";

function BannersTab() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    banner: "",
    banner_file: null,
    remove_banner: false,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await getBanners();
      console.log("Fetched Banners:", response.data);
      const bannersWithIds = (response.data || []).map((banner, index) => ({
        ...banner,
        id: banner.id || `temp-${index}-${Date.now()}`,
      }));
      setBanners(bannersWithIds);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to fetch banners.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle banner image file upload
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);

    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Please select an image smaller than 5MB.",
          target: "#banners-form-dialog",
        });
        e.target.value = "";
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please select a valid image file (JPG, PNG, GIF, etc.).",
          target: "#banners-form-dialog",
        });
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        banner_file: file,
        banner: "", // Clear URL when file is selected
        remove_banner: false,
      }));

      console.log("File set to form data:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const handleAdd = () => {
    setEditingBanner(null);
    setFormData({
      name: "",
      link: "",
      banner: "",
      banner_file: null,
      remove_banner: false,
    });
    setDialogOpen(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      name: banner.name || "",
      link: banner.link || "",
      banner: banner.banner || "",
      banner_file: null,
      remove_banner: false,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the banner permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeleteLoading(true);
        await deleteBanner(id);
        setDeleteLoading(false);
        setBanners((prev) => prev.filter((banner) => banner.id !== id));
        Swal.fire("Deleted!", "Banner has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete banner.",
        });
      }
    }
  };

  const handleSubmit = async () => {
    setAddLoading(true);
    setEditLoading(true);
    try {
      // Validation
      if (!formData.name.trim()) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Banner name is required.",
          target: "#banners-form-dialog",
        });
        return;
      }

      const hasBannerFile = formData.banner_file;
      const hasBannerUrl = formData.banner && formData.banner.trim();

      console.log("=== FRONTEND SUBMIT DEBUG ===");
      console.log("Form data:", formData);
      console.log("Has banner file:", hasBannerFile);
      console.log("Has banner URL:", hasBannerUrl);
      console.log("Is editing:", !!editingBanner);

      const safeStringTrim = (value) => {
        if (value === null || value === undefined) return "";
        return String(value).trim();
      };

      if (editingBanner) {
        // UPDATE - Always use FormData to be consistent with backend multer middleware
        const formDataToSend = new FormData();

        // Add all required fields
        formDataToSend.append("name", safeStringTrim(formData.name));
        formDataToSend.append("link", safeStringTrim(formData.link));

        // Handle image logic
        if (hasBannerFile) {
          // If uploading a new file, backend expects 'file' field name
          formDataToSend.append("banner_image", formData.banner_file);
          console.log("Added file to FormData:", {
            name: formData.banner_file,
          });
        } else if (formData.remove_banner) {
          // Only set remove_banner if explicitly removing and no new file
          formDataToSend.append("remove_banner", "true");
          console.log("Setting remove_banner to true");
        }

        console.log("=== SENDING UPDATE ===");
        console.log("Banner ID:", editingBanner.id);

        const response = await updateBanner(editingBanner.id, formDataToSend);

        // Update local state
        setBanners((prev) =>
          prev.map((banner) =>
            banner.id === editingBanner.id
              ? { ...banner, ...(response.data || response) }
              : banner
          )
        );

        Swal.fire("Updated!", "Banner updated successfully.", "success");
      } else {
        // CREATE
        if (hasBannerFile) {
          // Use FormData for file uploads
          const formDataToSend = new FormData();

          // Add all required fields
          formDataToSend.append("name", safeStringTrim(formData.name));
          formDataToSend.append("link", safeStringTrim(formData.link));

          // Backend expects 'file' field name for create operations
          formDataToSend.append("banner_image", formData.banner_file);

          console.log("Creating banner with file upload");

          const response = await createBanner(formDataToSend);

          const newBanner = response.data || response;
          setBanners((prev) => [...prev, newBanner]);
        } else {
          // Use JSON for URL-only or no-image creates
          const processedData = {
            name: safeStringTrim(formData.name),
            link: safeStringTrim(formData.link),
          };

          // Only add banner if it's provided and not empty
          if (hasBannerUrl) {
            processedData.banner = formData.banner.trim();
          }

          console.log("Creating banner with JSON data:", processedData);
          const response = await createBanner(processedData);

          const newBanner = response.data || response;
          setBanners((prev) => [...prev, newBanner]);
        }

        Swal.fire("Added!", "Banner added successfully.", "success");
      }
      setAddLoading(false);
      setEditLoading(false);

      setDialogOpen(false);

      // Refresh data to get latest from server

      fetchBanners();
    } catch (error) {
      console.error("Submit error:", error);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to save banner.",
        target: "#banners-form-dialog",
      });
    }
  };

  const handleViewImage = (imageUrl, title) => {
    if (!imageUrl) {
      Swal.fire({
        icon: "info",
        title: "No Image",
        text: "No banner image available.",
      });
      return;
    }
    setSelectedImage({ url: imageUrl, title });
    setImageDialogOpen(true);
  };

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

  const handleOpenImageNewTab = () => {
    if (selectedImage.url) {
      window.open(selectedImage.url, "_blank");
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      banner_file: null,
    }));
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Clean up quoted strings that might come from the API
  const cleanQuotedString = (str) => {
    if (!str) return str;
    // Remove surrounding quotes if they exist
    return str.replace(/^"(.*)"$/, "$1");
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Banner Name",
      width: 250,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {cleanQuotedString(params.value)}
        </Typography>
      ),
    },
    {
      field: "link",
      headerName: "Link URL",
      width: 200,
      renderCell: (params) => {
        const cleanLink = cleanQuotedString(params.value);
        return (
          <Typography variant="body2" noWrap>
            {cleanLink ? (
              <a
                href={cleanLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                title={cleanLink}>
                {cleanLink.length > 30
                  ? `${cleanLink.substring(0, 30)}...`
                  : cleanLink}
              </a>
            ) : (
              <span className="text-gray-400">No Link</span>
            )}
          </Typography>
        );
      },
    },
    {
      field: "banner",
      headerName: "Banner Image",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center space-x-1">
          {params.value ? (
            <Chip
              label="View Image"
              size="small"
              color="primary"
              icon={<ImageIcon />}
              onClick={() =>
                handleViewImage(
                  params.value,
                  cleanQuotedString(params.row.name)
                )
              }
              style={{ cursor: "pointer" }}
            />
          ) : (
            <Chip label="No Image" size="small" color="default" />
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="space-x-1">
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
            title="Edit Banner">
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
            title="Delete Banner">
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
          <h2 className="text-lg font-semibold text-gray-900">
            Banners Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage website banners and promotional content
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Banner</span>
        </button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={banners}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row.id || row.name || Math.random()}
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
        id="banners-form-dialog">
        <DialogTitle>
          {editingBanner ? "Edit Banner" : "Add New Banner"}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <TextField
              label="Banner Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!formData.name.trim()}
              helperText={
                !formData.name.trim() ? "Banner name is required" : ""
              }
            />

            <TextField
              label="Link URL"
              fullWidth
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://example.com"
              helperText="Optional: URL to redirect when banner is clicked"
            />

            {/* Banner Image Section */}
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Banner Image
              </Typography>

              {/* Current Image Display for Edit Mode */}
              {editingBanner && formData.banner && !formData.remove_banner && (
                <Box mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom>
                    Current Image:
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <img
                      src={formData.banner}
                      alt="Current banner"
                      style={{
                        width: 150,
                        height: 80,
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
                        View Current
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                          setFormData({ ...formData, remove_banner: true })
                        }>
                        Remove Current
                      </Button>
                    </div>
                  </div>
                </Box>
              )}

              {/* Show remove banner confirmation */}
              {editingBanner && formData.remove_banner && (
                <Box mb={2} p={2} border="1px solid #f44336" borderRadius={1}>
                  <Typography variant="body2" color="error" gutterBottom>
                    Current image will be removed when you save.
                  </Typography>
                  <Button
                    size="small"
                    onClick={() =>
                      setFormData({ ...formData, remove_banner: false })
                    }>
                    Keep Current Image
                  </Button>
                </Box>
              )}

              {/* Image URL Input - only show if no file selected */}
              {!formData.banner_file && (
                <TextField
                  label="Banner Image URL"
                  fullWidth
                  value={formData.banner}
                  onChange={(e) =>
                    setFormData({ ...formData, banner: e.target.value })
                  }
                  margin="normal"
                  helperText="Enter image URL or upload a file below"
                  placeholder="https://example.com/banner.jpg"
                />
              )}

              {/* File Upload */}
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Or upload a banner image:
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ marginTop: 8 }}
                  key={`file-input-${editingBanner?.id || "new"}`}
                />
                <Typography
                  variant="caption"
                  display="block"
                  color="textSecondary"
                  mt={1}>
                  Supported formats: JPG, PNG, GIF. Max size: 5MB. Recommended:
                  1200x400px
                </Typography>
              </Box>

              {/* Show selected file info */}
              {formData.banner_file && (
                <Box mt={2} p={2} border="1px solid #2196f3" borderRadius={1}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" color="primary">
                        File selected: {formData.banner_file.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Size:{" "}
                        {(formData.banner_file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                        {editingBanner && " (will replace current image)"}
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
              : editingBanner
              ? "Update Banner"
              : "Add Banner"}
          </button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth>
        <DialogTitle>
          <div className="flex items-center justify-between">
            <Typography variant="h6">
              Banner Image - {cleanQuotedString(selectedImage.title)}
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
              alt="Banner image"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
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
            </Box>
          </Box>
        </DialogContent>
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
            Deleting banner...
          </span>
        </Box>
      </Dialog>
    </div>
  );
}

export default BannersTab;
