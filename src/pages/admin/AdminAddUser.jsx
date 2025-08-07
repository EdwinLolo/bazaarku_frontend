import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { Edit, Delete, Co2Sharp } from "@mui/icons-material";
import { Plus, UserPlus, Users } from "lucide-react";
import { getUserData, updateUser, deleteUser } from "../../models/admin";
import { signup } from "../../models/auth";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";

export default function AdminAddUser() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      confirmButtonColor: "#3085d6",
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const showErrorAlert = (message, target = null) => {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
      confirmButtonColor: "#d33",
      target: target,
    });
  };

  const showDeleteConfirmation = () => {
    return Swal.fire({
      title: "Are you sure?",
      text: `You want to delete user "${
        deleteDialog.user?.first_name || deleteDialog.user?.email
      }"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  };

  const handleAddUser = () => {
    setEditDialog({
      open: true,
      user: {
        email: "",
        first_name: "",
        last_name: "",
        role: "user",
      },
    });
  };

  // Define columns with action buttons
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "first_name", headerName: "First Name", width: 180 },
    { field: "last_name", headerName: "Last Name", width: 180 },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row)}
            title="Edit">
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row)}
            title="Delete">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserData();
      // console.log("Admin dashboard data:", data);

      const transformedData = data.map((item, index) => {
        // Extract the ID from various possible locations
        const id = item?.user_id || item.id || `temp-${index + 1}`; // fallback ID

        // Extract email from various possible locations
        const email =
          item.email || item.user?.email || item.profile?.email || "";

        // Extract name from various possible locations
        const first_name = item.first_name || item.profile?.first_name || "";

        const last_name = item.last_name || item.profile?.last_name || "";

        // Extract role from various possible locations
        const role =
          item.role || item.profile?.role || item.user?.role || "Unknown";

        return {
          id,
          email,
          first_name,
          last_name,
          role,
          originalData: item,
        };
      });

      // console.log("Transformed data:", transformedData);
      setRows(transformedData);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (user) => {
    setEditDialog({ open: true, user: { ...user } });
  };

  // Handle delete button click
  //   const handleDeleteClick = (user) => {
  //     setDeleteDialog({ open: true, user });
  //   };

  // Handle delete button click
  const handleDeleteClick = async (user) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to delete user "${user.first_name} ${user.last_name}" (${user.email})? This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        setDeleteLoading(true);
        await deleteUser(user.id);
        setDeleteLoading(false);
        // Remove the row from local state
        setRows((prevRows) => prevRows.filter((row) => row.id !== user.id));

        // Show success alert
        showSuccessAlert("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showErrorAlert(
        error.message || "Failed to delete user. Please try again."
      );
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (updatedUser) => {
    try {
      if (updatedUser.id) {
        // Editing existing user
        await updateUser(updatedUser.id, updatedUser);
        // Update the row in the local state
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === updatedUser.id ? { ...row, ...updatedUser } : row
          )
        );

        // Show success alert
        showSuccessAlert("User updated successfully!");
      } else {
        // Adding new user with password from form
        const { email, first_name, last_name, role, password } = updatedUser;

        const newUser = await signup(
          email,
          password, // Use password from form
          first_name,
          last_name,
          role
        );

        // Add the new user to the rows with separate first_name and last_name
        const userToAdd = {
          id: newUser.id || newUser.user_id || `temp-${Date.now()}`,
          email: newUser.email || email,
          first_name: first_name, // Keep separate in the UI
          last_name: last_name, // Keep separate in the UI
          role: newUser.role || role,
          originalData: newUser,
        };

        setRows((prevRows) => [...prevRows, userToAdd]);

        // Show success alert for new user
        showSuccessAlert("User added successfully!");

        // Optionally refresh data to get the latest from server
        fetchData();
      }

      // Close dialog
      setEditDialog({ open: false, user: null });
    } catch (error) {
      console.error("Error saving user:", error);

      // Show error alert
      showErrorAlert(
        error.message || "Failed to save user. Please try again.",
        "#user-form-dialog"
      );
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      // Show confirmation dialog first
      const result = await showDeleteConfirmation();

      if (result.isConfirmed) {
        await deleteUser(deleteDialog.user.id);

        // Remove the row from local state
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== deleteDialog.user.id)
        );

        setDeleteDialog({ open: false, user: null });

        // Show success alert
        showSuccessAlert("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);

      // Show error alert
      showErrorAlert(
        error.message || "Failed to delete user. Please try again."
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center px-24 pt-0 mx-auto">
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Users</h1>
            <p className="mt-1 text-gray-600">
              Manage users, roles, and permissions for your application.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center mx-auto">
        <div className="w-full flex flex-col items-end mb-4 mr-1.5">
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-colors duration-200 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg">
            <Plus size={20} />
            Add User
          </button>
        </div>
        <Paper sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            sx={{ border: 0 }}
            getRowId={(row) => {
              // console.log("Row ID:", row);
              return (
                row.id ||
                row.user?.id ||
                row.profile?.user_id ||
                row.id ||
                `fallback-${Math.random()}`
              );
            }}
          />
        </Paper>

        {/* Edit Dialog */}
        <EditUserDialog
          open={editDialog.open}
          user={editDialog.user}
          onClose={() => setEditDialog({ open: false, user: null })}
          onSubmit={handleEditSubmit}
        />

        <Dialog
          open={deleteLoading}
          PaperProps={{ className: "shadow-none bg-transparent" }}>
          <Box className="flex items-center justify-center min-h-[200px] min-w-[280px] bg-white rounded-lg shadow-lg p-8 gap-4 flex-col">
            <span
              className="inline-block w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"
              style={{ borderRightColor: "transparent" }}
            />
            <span className="text-lg font-semibold text-red-700">
              Deleting User...
            </span>
          </Box>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, user: null })}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete user "
            {deleteDialog.user?.name || deleteDialog.user?.email}"? This action
            cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialog({ open: false, user: null })}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

// Enhanced Edit User Dialog Component
// Enhanced Edit User Dialog Component
function EditUserDialog({ open, user, schools, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "user",
    password: "", // Add password field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For password visibility toggle

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "user",
        password: "", // Always empty for security (don't pre-fill existing passwords)
      });
      // Clear errors when user changes
      setErrors({});
    }
  }, [user]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Updated validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First Name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Password validation - only required for new users
    if (!user?.id) {
      // New user
      if (!formData.password.trim()) {
        newErrors.password = "Password is required for new users";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      // console.error("Form validation failed:", errors);
      // Show validation error alert
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill in all required fields correctly.",
        confirmButtonColor: "#f39c12",
        target: "#user-form-dialog",
      });
      return;
    }

    setIsSubmitting(true);
    // console.log("Submitting form data:", { ...formData, password: "***" }); // Hide password in logs

    try {
      // Prepare the updated user data
      const updatedUser = {
        ...user,
        ...formData,
      };

      // console.log("Submitting user data:", { ...updatedUser, password: "***" });
      await onSubmit(updatedUser);
      // Success is handled in the parent component
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.message || "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#d33",
        target: "#user-form-dialog",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form and errors when closing
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      id="user-form-dialog">
      <DialogTitle>{user?.id ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="First Name"
            value={formData.first_name}
            onChange={handleChange("first_name")}
            fullWidth
            error={!!errors.first_name}
            helperText={errors.first_name}
            disabled={isSubmitting}
          />

          <TextField
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange("last_name")}
            fullWidth
            error={!!errors.last_name}
            helperText={errors.last_name}
            disabled={isSubmitting}
          />

          <TextField
            label="Email"
            value={formData.email}
            onChange={handleChange("email")}
            fullWidth
            type="email"
            error={!!errors.email}
            helperText={errors.email}
            disabled={isSubmitting}
            InputProps={{
              readOnly: !!user?.id, // Only readonly when editing existing user
            }}
          />

          <TextField
            label="Role"
            value={formData.role}
            onChange={handleChange("role")}
            select
            fullWidth
            error={!!errors.role}
            helperText={errors.role}
            disabled={isSubmitting}>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="vendor">Vendor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {/* Password field - only show for new users */}
          {!user?.id && (
            <TextField
              label="Password"
              value={formData.password}
              onChange={handleChange("password")}
              fullWidth
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password || "Minimum 6 characters"}
              disabled={isSubmitting}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    size="small">
                    {showPassword ? "🙈" : "👁️"}
                  </IconButton>
                ),
              }}
            />
          )}

          {/* Show message for editing existing users */}
          {user?.id && (
            <Box
              sx={{
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                border: "1px solid #ddd",
              }}>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Note:</strong> Password can't be read or edit, make
                sure you remember the password.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
          {isSubmitting ? "Saving..." : user?.id ? "Save Changes" : "Add User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
