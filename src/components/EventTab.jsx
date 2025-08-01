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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

function EventTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    area_id: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    max_capacity: "",
    entry_fee: "",
    status: "upcoming",
  });

  // Mock categories and areas - replace with actual API calls
  const [categories] = useState([
    { id: 1, name: "Music Festival" },
    { id: 2, name: "Food Fair" },
    { id: 3, name: "Art Exhibition" },
  ]);

  const [areas] = useState([
    { id: 1, name: "Main Hall" },
    { id: 2, name: "Outdoor Plaza" },
    { id: 3, name: "Conference Room" },
  ]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const mockData = [
        {
          id: 1,
          title: "Summer Music Festival",
          description: "Annual music festival",
          category_id: 1,
          area_id: 2,
          start_date: "2024-07-15",
          end_date: "2024-07-17",
          start_time: "10:00",
          end_time: "22:00",
          max_capacity: 1000,
          entry_fee: 50,
          status: "upcoming",
        },
        {
          id: 2,
          title: "Food Tasting Event",
          description: "Local cuisine showcase",
          category_id: 2,
          area_id: 1,
          start_date: "2024-06-20",
          end_date: "2024-06-20",
          start_time: "12:00",
          end_time: "18:00",
          max_capacity: 500,
          entry_fee: 25,
          status: "active",
        },
      ];
      setEvents(mockData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      category_id: "",
      area_id: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      max_capacity: "",
      entry_fee: "",
      status: "upcoming",
    });
    setDialogOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
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
        setEvents((prev) => prev.filter((event) => event.id !== id));
        Swal.fire("Deleted!", "Event has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete event.", "error");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const processedData = {
        ...formData,
        max_capacity: parseInt(formData.max_capacity),
        entry_fee: parseFloat(formData.entry_fee),
        category_id: parseInt(formData.category_id),
        area_id: parseInt(formData.area_id),
      };

      if (editingEvent) {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === editingEvent.id
              ? { ...event, ...processedData }
              : event
          )
        );
        Swal.fire("Updated!", "Event updated successfully.", "success");
      } else {
        const newEvent = { ...processedData, id: Date.now() };
        setEvents((prev) => [...prev, newEvent]);
        Swal.fire("Added!", "Event added successfully.", "success");
      }
      setDialogOpen(false);
    } catch (error) {
      Swal.fire("Error!", "Failed to save event.", "error");
    }
  };

  const getCategoryName = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown";
  };

  const getAreaName = (areaId) => {
    return areas.find((area) => area.id === areaId)?.name || "Unknown";
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Event Title", width: 200 },
    {
      field: "category_id",
      headerName: "Category",
      width: 150,
      valueGetter: (params) => getCategoryName(params.value),
    },
    {
      field: "area_id",
      headerName: "Area",
      width: 150,
      valueGetter: (params) => getAreaName(params.value),
    },
    { field: "start_date", headerName: "Start Date", width: 120 },
    { field: "end_date", headerName: "End Date", width: 120 },
    {
      field: "max_capacity",
      headerName: "Capacity",
      width: 100,
      type: "number",
    },
    { field: "entry_fee", headerName: "Entry Fee", width: 100, type: "number" },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "active"
              ? "bg-green-100 text-green-800"
              : params.value === "upcoming"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}>
          {params.value}
        </span>
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

      <div style={{ height: 500, width: "100%" }}>
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
              label="Event Title"
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextField
              label="Category"
              fullWidth
              select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
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
            <TextField
              label="Status"
              fullWidth
              select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
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
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="time"
              fullWidth
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Max Capacity"
              type="number"
              fullWidth
              value={formData.max_capacity}
              onChange={(e) =>
                setFormData({ ...formData, max_capacity: e.target.value })
              }
            />
            <TextField
              label="Entry Fee"
              type="number"
              fullWidth
              value={formData.entry_fee}
              onChange={(e) =>
                setFormData({ ...formData, entry_fee: e.target.value })
              }
            />
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
    </div>
  );
}

export default EventTab;
