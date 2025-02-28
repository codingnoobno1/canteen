'use client';

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { 
  Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Paper, Grid, Snackbar, Alert 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const socket = io("http://localhost:5005"); // WebSocket connection to Admin API

const AdminMenu = () => {
  const [menu, setMenu] = useState([]);  // Stores menu items
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch menu items when component mounts
  useEffect(() => {
    fetchMenu();

    // Listen for menu updates via WebSocket
    socket.on("menuUpdate", (updatedMenu) => {
      setMenu(updatedMenu);
    });

    return () => socket.off("menuUpdate");
  }, []);

  // Fetch menu from backend
  const fetchMenu = async () => {
    try {
      const res = await fetch("http://localhost:5005/admin/menu");
      const data = await res.json();
      setMenu(data);
    } catch (error) {
      showSnackbar("Error fetching menu!", "error");
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Add item to menu
  const addItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.quantity) {
      showSnackbar("All fields are required!", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:5005/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItem.name,
          price: Number(newItem.price),
          quantity: Number(newItem.quantity),
        }),
      });

      if (response.ok) {
        setNewItem({ name: "", price: "", quantity: "" }); // Clear input fields
        showSnackbar("Item added successfully!", "success");
      } else {
        showSnackbar("Error adding item!", "error");
      }
    } catch (error) {
      showSnackbar("Server error!", "error");
    }
  };

  // Remove item from menu
  const removeItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`http://localhost:5005/admin/menu/${id}`, { method: "DELETE" });

      if (response.ok) {
        showSnackbar("Item removed successfully!", "success");
      } else {
        showSnackbar("Error removing item!", "error");
      }
    } catch (error) {
      showSnackbar("Server error!", "error");
    }
  };

  // Show Snackbar for notifications
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Admin Menu</Typography>

      {/* Add Item Form */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Item Name"
              name="name"
              value={newItem.name}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={newItem.price}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={newItem.quantity}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" fullWidth onClick={addItem}>
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Menu List */}
      <List>
        {menu.map((item) => (
          <ListItem key={item._id} secondaryAction={
            <IconButton edge="end" color="error" onClick={() => removeItem(item._id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={`${item.name} - ₹${item.price} (${item.quantity} in stock)`} />
          </ListItem>
        ))}
      </List>

      {/* Snackbar Notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminMenu;
