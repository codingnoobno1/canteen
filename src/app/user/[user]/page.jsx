"use client";

import { useState } from "react";
import { TextField, Button, MenuItem, Typography, Container, Paper, FormControl, InputLabel, Select, OutlinedInput, Chip, Box } from "@mui/material";
import { styled } from "@mui/system";

const BackgroundContainer = styled("div")({
  backgroundImage: "url('https://i.pinimg.com/originals/6e/b0/3a/6eb03a3ddb7ca82a7a56fbf0c10f0bda.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "auto",
});

const FormContainer = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  width: "90%",
  maxWidth: "600px",
  padding: "20px",
  background: "rgba(255, 255, 255, 0.9)",
});

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    uniId: "",
    hostler: "",
    roomNumber: "",
    cafeteriaId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    budget: "",
    department: "",
    tokens: "",
    foodItems: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const foodOptions = ["Oats", "Sprouts", "Boiled Eggs", "Salad", "Fresh Juice", "Milk", "Dry Fruits", "Yogurt"];
  const departments = ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics", "Biotechnology", "Management", "Others"];
  const tokensOptions = ["Monthly", "Daily"];

  const generateCafeteriaId = (uniId) => {
    const randomNum = Math.floor(100 + Math.random() * 900); // Generates a random 3-digit number
    return `food4snack2025${randomNum}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      cafeteriaId: name === "uniId" ? generateCafeteriaId(value) : prev.cafeteriaId,
    }));
  };

  const handleFoodChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      foodItems: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      
      setSuccess("Registration successful!");
      setFormData({ uniId: "", hostler: "", roomNumber: "", cafeteriaId: "", name: "", email: "", password: "", phone: "", budget: "", department: "", tokens: "", foodItems: [] });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <BackgroundContainer>
      <FormContainer elevation={3}>
        <Typography variant="h5" gutterBottom>First Time Registration</Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="University ID" name="uniId" value={formData.uniId} onChange={handleChange} required margin="normal" />
          <TextField select fullWidth label="Are you a Hostler or Dayscholar?" name="hostler" value={formData.hostler} onChange={handleChange} required margin="normal">
            <MenuItem value="Hostler">Hostler</MenuItem>
            <MenuItem value="Dayscholar">Dayscholar</MenuItem>
          </TextField>
          {formData.hostler === "Hostler" && (
            <TextField fullWidth label="Room Number" name="roomNumber" value={formData.roomNumber} onChange={handleChange} margin="normal" />
          )}
          <TextField fullWidth label="Cafeteria ID" name="cafeteriaId" value={formData.cafeteriaId} disabled margin="normal" />
          <TextField fullWidth label="Budget / Pocket Money (per month)" name="budget" value={formData.budget} onChange={handleChange} margin="normal" type="number" />
          <TextField select fullWidth label="Department" name="department" value={formData.department} onChange={handleChange} required margin="normal">
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </TextField>
          <TextField select fullWidth label="Tokens" name="tokens" value={formData.tokens} onChange={handleChange} required margin="normal">
            {tokensOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <FormControl fullWidth margin="normal">
            <InputLabel>Daily Servable Items</InputLabel>
            <Select multiple value={formData.foodItems} onChange={handleFoodChange} input={<OutlinedInput label="Daily Servable Items" />} renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{selected.map((value) => <Chip key={value} label={value} />)}</Box>
            )}>
              {foodOptions.map((food) => (
                <MenuItem key={food} value={food}>{food}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
        </form>
      </FormContainer>
    </BackgroundContainer>
  );
}
