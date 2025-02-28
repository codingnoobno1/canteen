"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMenu, updateMenuInDB } from "@/redux/slices/menuSlice";
import { Button, Container, Typography, Select, MenuItem, TextField } from "@mui/material";

const AdminMenuPage = () => {
  const dispatch = useDispatch();
  const { menuData, loading, error } = useSelector((state) => state.menu);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [mealType, setMealType] = useState("Breakfast");
  const [mealValue, setMealValue] = useState("");

  useEffect(() => {
    dispatch(fetchMenu()); // Load menu data on component mount
  }, [dispatch]);

  const handleUpdateMenu = () => {
    if (!mealValue.trim()) return alert("Meal cannot be empty!");

    dispatch(updateMenuInDB({ menuData: mealValue, day: selectedDay }));
    setMealValue(""); // Clear input field
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Admin Menu Control Panel 🍽️
      </Typography>

      {loading && <Typography>Loading menu...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {/* Dropdown for selecting the day */}
      <Select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} sx={{ mb: 2, mr: 2 }}>
        {Object.keys(menuData).map((day) => (
          <MenuItem key={day} value={day}>
            {day}
          </MenuItem>
        ))}
      </Select>

      {/* Input for meal entry */}
      <TextField
        label="Enter Meal"
        variant="outlined"
        value={mealValue}
        onChange={(e) => setMealValue(e.target.value)}
        sx={{ mb: 2, mr: 2 }}
      />

      {/* Button to update the menu */}
      <Button variant="contained" color="primary" onClick={handleUpdateMenu}>
        Add Meal
      </Button>

      {/* Display the current menu */}
      <Container sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h5">Current Menu</Typography>
        {Object.entries(menuData).map(([day, meals]) => (
          <div key={day}>
            <Typography variant="h6">{day}</Typography>
            {meals.length > 0 ? (
              meals.map((meal, index) => <Typography key={index}>🍽️ {meal}</Typography>)
            ) : (
              <Typography color="textSecondary">No meals added yet</Typography>
            )}
          </div>
        ))}
      </Container>
    </Container>
  );
};

export default AdminMenuPage;
