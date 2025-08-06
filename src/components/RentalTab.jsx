// src/components/admin/RentalTab.jsx
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
import {
  getRentalProducts,
  createRentalProduct,
  updateRentalProduct,
  deleteRentalProduct,
  getRentalCategories,
} from "../models/admin";

function RentalTab() {
  const [categories, setCategories] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });
  const [editingRental, setEditingRental] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    rental_id: "",
    location: "",
    contact: "",
    is_ready: "true",
    banner: "",
    banner_file: null, // For storing the actual file
    remove_banner: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchRentals();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getRentalCategories();
      console.log("Fetched Categories:", response.data);
      const categoriesWithIds = (response.data || []).map(
        (category, index) => ({
          ...category,
          id: category.id || `temp-${index}-${Date.now()}`,
        })
      );
      setCategories(categoriesWithIds);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const response = await getRentalProducts();
      console.log("Fetched Rentals:", response.data);
      const rentalsWithIds = (response.data || []).map((rental, index) => ({
        ...rental,
        id: rental.id || `temp-${index}-${Date.now()}`,
      }));
      setRentals(rentalsWithIds);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle image file upload
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
          target: "#rental-form-dialog",
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
          target: "#rental-form-dialog",
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

      console.log("File set to form data:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const handleAdd = () => {
    setEditingRental(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      rental_id: "",
      location: "",
      contact: "",
      is_ready: "true",
      banner: "",
      banner_file: null, // For storing the actual file
      remove_banner: false,
    });
    setDialogOpen(true);
  };

  const handleEdit = (rental) => {
    setEditingRental(rental);
    setFormData({
      name: rental.name || "",
      description: rental.description || "",
      price: rental.price || "",
      rental_id: rental.rental_id || "",
      location: rental.location || "",
      contact: rental.contact || "",
      is_ready:
        rental.is_ready !== undefined ? String(rental.is_ready) : "true",
      banner: rental.banner || "",
      banner_file: null,
      remove_banner: false,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the rental item permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteRentalProduct(id);
        setRentals((prev) => prev.filter((rental) => rental.id !== id));
        Swal.fire("Deleted!", "Rental item has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete rental item.",
        });
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
          text: "Item name is required.",
          target: "#rental-form-dialog",
        });
        return;
      }
      if (!formData.rental_id) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Please select a category.",
          target: "#rental-form-dialog",
        });
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Please enter a valid price.",
          target: "#rental-form-dialog",
        });
        return;
      }

      const hasBannerFile = formData.banner_file;
      const hasBannerUrl = formData.banner && formData.banner.trim();

      console.log("=== FRONTEND SUBMIT DEBUG ===");
      console.log("Form data:", formData);
      console.log("Has banner file:", hasBannerFile);
      console.log("Has banner URL:", hasBannerUrl);
      console.log("Is editing:", !!editingRental);
      console.log("Remove banner:", formData.remove_banner);

      const safeStringTrim = (value) => {
        if (value === null || value === undefined) return "";
        return String(value).trim();
      };

      if (editingRental) {
        // Always use FormData to be consistent with backend multer middleware
        const formDataToSend = new FormData();

        const fieldsToAdd = {
          name: safeStringTrim(formData.name),
          description: safeStringTrim(formData.description),
          price: formData.price,
          rental_id: formData.rental_id,
          location: safeStringTrim(formData.location),
          contact: safeStringTrim(formData.contact),
          is_ready: formData.is_ready,
        };

        // Fixed banner logic
        if (hasBannerFile) {
          // If uploading a new file, don't send remove_banner
          // The backend will handle replacing the old banner
          console.log("Uploading new file - not setting remove_banner");
        } else if (formData.remove_banner && !hasBannerFile) {
          // Only set remove_banner if explicitly removing and no new file
          fieldsToAdd.remove_banner = "true";
          console.log("Setting remove_banner to true");
        } else if (!hasBannerFile && hasBannerUrl && !formData.remove_banner) {
          // Updating with URL only
          fieldsToAdd.banner = safeStringTrim(formData.banner);
          console.log("Setting banner URL:", fieldsToAdd.banner);
        }

        // Append all fields to FormData
        Object.entries(fieldsToAdd).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            formDataToSend.append(key, value);
            console.log(`Added to FormData: ${key} = ${value}`);
          }
        });

        // Add the file if present
        if (hasBannerFile) {
          formDataToSend.append("product_image", formData.banner_file);
          console.log("Added file to FormData:", {
            name: formData.banner_file,
          });
        }

        console.log("=== SENDING UPDATE ===");
        console.log("Category ID:", editingRental.id);
        console.log("FormData entries:");
        for (let [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name})`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }

        const response = await updateRentalProduct(
          editingRental.id,
          formDataToSend
        );

        // Update local state
        setRentals((prev) =>
          prev.map((cat) =>
            cat.id === editingRental.id
              ? { ...cat, ...(response.data || response) }
              : cat
          )
        );

        Swal.fire("Updated!", "Rental item updated successfully.", "success");
      } else {
        // Create new category
        if (hasBannerFile) {
          // Use FormData for file uploads
          const formDataToSend = new FormData();

          const fieldsToAdd = {
            name: safeStringTrim(formData.name),
            description: safeStringTrim(formData.description),
            price: formData.price,
            rental_id: formData.rental_id,
            location: safeStringTrim(formData.location),
            contact: safeStringTrim(formData.contact),
            is_ready: formData.is_ready,
          };

          Object.entries(fieldsToAdd).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              formDataToSend.append(key, value);
            }
          });

          formDataToSend.append("product_image", formData.banner_file);

          console.log("Creating category with file upload");
          const response = await createRentalProduct(formDataToSend);

          let newProduct;
          if (response.data && response.data.id) {
            newProduct = response.data;
          } else if (response.id) {
            newProduct = {
              ...fieldsToAdd,
              id: response.id,
              banner: response.banner || response.data?.banner,
            };
          } else {
            newProduct = { ...fieldsToAdd, id: Date.now() };
          }

          setRentals((prev) => [...prev, newProduct]);
        } else {
          // Use JSON for URL-only creates
          const processedData = {
            name: safeStringTrim(formData.name),
            description: safeStringTrim(formData.description),
            price: formData.price,
            rental_id: formData.rental_id,
            location: safeStringTrim(formData.location),
            contact: safeStringTrim(formData.contact),
            is_ready: formData.is_ready,
          };

          // Only add banner if it's provided and not empty
          if (hasBannerUrl) {
            processedData.banner = formData.banner.trim();
          }

          console.log("Creating category with JSON data:", processedData);
          const response = await createRentalProduct(processedData);

          let newCategory;
          if (response.data && response.data.id) {
            newCategory = response.data;
          } else if (response.id) {
            newCategory = { ...processedData, id: response.id };
          } else {
            newCategory = { ...processedData, id: Date.now() };
          }

          setRentals((prev) => [...prev, newCategory]);
        }

        Swal.fire("Added!", "Rental item added successfully.", "success");
      }

      setDialogOpen(false);

      // Refresh data to get latest from server
      fetchRentals();
    } catch (error) {
      console.error("Submit error:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      }

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message ||
          error.message ||
          "Failed to save rental item.",
        target: "#rental-form-dialog",
      });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleViewImage = (imageUrl, title) => {
    if (!imageUrl) {
      Swal.fire({
        icon: "info",
        title: "No Image",
        text: "No product image available for this item.",
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
      link.download = `${selectedImage.title}_image.jpg`;
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
      imageFile: null,
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
      headerName: "Item Name",
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "rental_id",
      headerName: "Category",
      width: 150,
      renderCell: (params) => (
        <span>{getCategoryName(params.row.rental_id)}</span>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params) => <span>${params.value || 0}</span>,
    },
    {
      field: "location",
      headerName: "Location",
      width: 120,
      renderCell: (params) => <span>{params.value || "No Location"}</span>,
    },
    {
      field: "contact",
      headerName: "Contact",
      width: 120,
      renderCell: (params) => <span>{params.value || "No Contact"}</span>,
    },
    {
      field: "is_ready",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Ready" : "Not Ready"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "banner",
      headerName: "Image",
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
            <Chip label="No Image" size="small" color="default" />
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
          <h2 className="text-lg font-semibold text-gray-900">Rental Items</h2>
          <p className="text-sm text-gray-600">
            Manage rental items and inventory
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          <span>Add Rental Item</span>
        </button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rentals}
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
        id="rental-form-dialog">
        <DialogTitle>
          {editingRental ? "Edit Rental Item" : "Add New Rental Item"}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <TextField
              label="Item Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!formData.name.trim()}
              helperText={!formData.name.trim() ? "Item name is required" : ""}
            />

            <TextField
              label="Category"
              fullWidth
              select
              required
              value={formData.rental_id}
              onChange={(e) =>
                setFormData({ ...formData, rental_id: e.target.value })
              }
              error={!formData.rental_id}
              helperText={!formData.rental_id ? "Category is required" : ""}>
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Price"
              fullWidth
              type="number"
              required
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              error={!formData.price || parseFloat(formData.price) <= 0}
              helperText={
                !formData.price || parseFloat(formData.price) <= 0
                  ? "Valid price is required"
                  : ""
              }
              InputProps={{
                startAdornment: <span className="mr-1 text-gray-500">$</span>,
              }}
            />

            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Item location"
            />

            <TextField
              label="Contact"
              fullWidth
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              placeholder="Contact information"
            />

            <TextField
              label="Status"
              fullWidth
              select
              value={formData.is_ready}
              onChange={(e) =>
                setFormData({ ...formData, is_ready: e.target.value })
              }>
              <MenuItem value="true">Ready</MenuItem>
              <MenuItem value="false">Not Ready</MenuItem>
            </TextField>

            {/* Image Section */}
            <div className="col-span-2">
              <Typography variant="subtitle2" gutterBottom>
                Product Image (Optional)
              </Typography>

              {/* Current Image Display for Edit Mode */}
              {editingRental && formData.banner && (
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
                      alt="Current product"
                      style={{
                        width: 100,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() =>
                        handleViewImage(formData.banner, formData.name)
                      }>
                      View Current
                    </Button>
                  </div>
                </Box>
              )}

              {/* Image URL Input - only show if no file selected */}
              {!formData.imageFile && (
                <TextField
                  label="Product Image URL"
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

              {/* File Upload */}
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Or upload an image file:
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ marginTop: 8 }}
                  key={`file-input-${editingRental?.id || "new"}`}
                />
                <Typography
                  variant="caption"
                  display="block"
                  color="textSecondary"
                  mt={1}>
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </Typography>
              </Box>

              {/* Show selected file info */}
              {formData.imageFile && (
                <Box mt={2} p={2} border="1px solid #2196f3" borderRadius={1}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" color="primary">
                        File selected: {formData.imageFile.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Size:{" "}
                        {(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB
                        {editingRental && " (will replace current image)"}
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
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            placeholder="Describe the rental item..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRental ? "Update" : "Add"}
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
              Product Image - {selectedImage.title}
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
              alt="Product image"
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
                Failed to load product image
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RentalTab;
