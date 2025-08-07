// src/components/admin/RentalCategoryTab.jsx
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
  getRentalCategories,
  createRentalCategory,
  updateRentalCategory,
  deleteRentalCategory,
} from "../models/admin";

function RentalCategoryTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    banner: "",
    banner_file: null,
    remove_banner: false,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getRentalCategories();
      // console.log("Fetched Categories:", response.data);
      // Ensure all items have an ID
      const categoriesWithIds = (response.data || []).map(
        (category, index) => ({
          ...category,
          id: category.id || `temp-${index}-${Date.now()}`, // Ensure ID exists
        })
      );
      setCategories(categoriesWithIds);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle banner file upload
  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    // console.log("File selected:", file);

    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Please select an image smaller than 5MB.",
          target: "#rental-category-form-dialog",
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
          target: "#rental-category-form-dialog",
        });
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        banner_file: file,
        banner: "", // Clear banner URL when file is selected
        remove_banner: false, // Don't automatically set remove_banner
      }));

      // console.log("File set to form data:", {
      //   name: file.name,
      //   size: file.size,
      //   type: file.type,
      // });
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      banner: "",
      banner_file: null,
      remove_banner: false,
    });
    setDialogOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      banner: category.banner || "",
      banner_file: null,
      remove_banner: false,
    });
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
        setDeleteLoading(true);
        await deleteRentalCategory(id);
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete category.",
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
          text: "Category name is required.",
          target: "#rental-category-form-dialog",
        });
        return;
      }

      const hasBannerFile = formData.banner_file;
      const hasBannerUrl = formData.banner && formData.banner.trim();

      const safeStringTrim = (value) => {
        if (value === null || value === undefined) return "";
        return String(value).trim();
      };

      if (editingCategory) {
        setEditLoading(true);
        // For updates, always use FormData to ensure compatibility with multer
        const formDataToSend = new FormData();
        const fieldsToAdd = {
          name: safeStringTrim(formData.name),
        };
        if (hasBannerFile) {
          // If uploading a new file, don't send remove_banner
        } else if (formData.remove_banner && !hasBannerFile) {
          fieldsToAdd.remove_banner = "true";
        } else if (!hasBannerFile && hasBannerUrl && !formData.remove_banner) {
          fieldsToAdd.banner = safeStringTrim(formData.banner);
        }
        Object.entries(fieldsToAdd).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            formDataToSend.append(key, value);
          }
        });
        if (hasBannerFile) {
          formDataToSend.append("banner_image", formData.banner_file);
        }
        const response = await updateRentalCategory(
          editingCategory.id,
          formDataToSend
        );
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id
              ? { ...cat, ...(response.data || response) }
              : cat
          )
        );
        Swal.fire("Updated!", "Category updated successfully.", "success");
      } else {
        setAddLoading(true);
        // Create new category
        if (hasBannerFile) {
          // Use FormData for file uploads
          const formDataToSend = new FormData();
          const fieldsToAdd = {
            name: safeStringTrim(formData.name),
          };
          Object.entries(fieldsToAdd).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              formDataToSend.append(key, value);
            }
          });
          formDataToSend.append("banner_image", formData.banner_file);
          const response = await createRentalCategory(formDataToSend);
          let newCategory;
          if (response.data && response.data.id) {
            newCategory = response.data;
          } else if (response.id) {
            newCategory = {
              ...fieldsToAdd,
              id: response.id,
              banner: response.banner || response.data?.banner,
            };
          } else {
            newCategory = { ...fieldsToAdd, id: Date.now() };
          }
          setCategories((prev) => [...prev, newCategory]);
        } else {
          // Use JSON for URL-only creates
          const processedData = {
            name: formData.name.trim(),
          };
          // Only add banner if it's provided and not empty
          if (hasBannerUrl) {
            processedData.banner = formData.banner.trim();
          }
          const response = await createRentalCategory(processedData);
          let newCategory;
          if (response.data && response.data.id) {
            newCategory = response.data;
          } else if (response.id) {
            newCategory = { ...processedData, id: response.id };
          } else {
            newCategory = { ...processedData, id: Date.now() };
          }
          setCategories((prev) => [...prev, newCategory]);
        }
        Swal.fire("Added!", "Category added successfully.", "success");
      }

      setDialogOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to save category.",
        target: "#rental-category-form-dialog",
      });
    } finally {
      setAddLoading(false);
      setEditLoading(false);
      setDeleteLoading(false);
      fetchCategories(); // Refresh categories after submit
    }
  };

  // Handle banner preview
  const handleViewImage = (imageUrl, title) => {
    if (!imageUrl) {
      Swal.fire({
        icon: "info",
        title: "No Banner",
        text: "No banner image available for this category.",
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

  // Remove selected file
  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      banner_file: null,
      remove_banner: false,
    }));

    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Rental Category",
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Rental Categories
          </h2>
          <p className="text-sm text-gray-600">
            Manage rental item categories and types
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
        id="rental-category-form-dialog">
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <div className="mt-4 space-y-4">
            <TextField
              label="Category Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
              error={!formData.name.trim()}
              helperText={
                !formData.name.trim() ? "Category name is required" : ""
              }
            />

            {/* Banner Upload Section */}
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Banner Image (Optional)
              </Typography>

              {/* Current Banner Display */}
              {editingCategory &&
                formData.banner &&
                !formData.remove_banner && (
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
              {(!editingCategory ||
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
                  placeholder="https://example.com/image.jpg"
                />
              )}

              {/* File Upload for Banner */}
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Or upload an image file:
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                  style={{ marginTop: 8 }}
                  key={editingCategory?.id || "new"}
                />
                <Typography
                  variant="caption"
                  display="block"
                  color="textSecondary"
                  mt={1}>
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </Typography>
              </Box>

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
                        {editingCategory &&
                          editingCategory.banner &&
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
              : editingCategory
              ? "Update"
              : "Add"}
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
            Deleting category...
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
              alt="Category banner"
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

export default RentalCategoryTab;
