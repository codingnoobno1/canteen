"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

const BackgroundContainer = styled("div")({
  backgroundImage:
    "url('https://i.pinimg.com/originals/6e/b0/3a/6eb03a3ddb7ca82a7a56fbf0c10f0bda.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100vw",
  minHeight: "100vh", // Ensures full viewport height but allows scrolling
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start", // Aligns form to the top
  padding: "20px 0",
  overflow: "auto",
});

const FormContainer = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  width: "90%",
  maxWidth: "600px",
  padding: "20px",
  background: "rgba(255, 255, 255, 0.9)",
  maxHeight: "80vh", // Ensures form doesn't exceed viewport height
  overflowY: "auto", // Enables scrolling within the form
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
});

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    uniId: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    hostler: "",
    roomNumber: "",
    department: "",
    budget: "",
    tokens: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const departments = [
    "Computer Science",
    "Mechanical",
    "Civil",
    "Electrical",
    "Electronics",
    "Biotechnology",
    "Management",
    "Others",
  ];
  const tokensOptions = ["Monthly", "Daily"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      setError("Budget must be a valid number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Registration successful!");
      setFormData({
        uniId: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        hostler: "",
        roomNumber: "",
        department: "",
        budget: "",
        tokens: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <BackgroundContainer>
      <FormContainer elevation={3}>
        <Typography variant="h5" gutterBottom>
          First Time Registration
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="University ID"
            name="uniId"
            value={formData.uniId}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            select
            fullWidth
            label="Are you a Hostler or Dayscholar?"
            name="hostler"
            value={formData.hostler}
            onChange={handleChange}
            required
            margin="normal"
          >
            <MenuItem value="Hostler">Hostler</MenuItem>
            <MenuItem value="Dayscholar">Dayscholar</MenuItem>
          </TextField>

          {formData.hostler === "Hostler" && (
            <TextField
              fullWidth
              label="Room Number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              margin="normal"
            />
          )}

          <TextField
            select
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            margin="normal"
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Budget / Pocket Money (per month)"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            margin="normal"
            type="number"
          />

          <TextField
            select
            fullWidth
            label="Tokens"
            name="tokens"
            value={formData.tokens}
            onChange={handleChange}
            required
            margin="normal"
          >
            {tokensOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </FormContainer>
    </BackgroundContainer>
  );
}
