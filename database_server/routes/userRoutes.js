const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/cafe_users");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { uniId, name, email, password, phone, hostler, roomNumber, department, budget, tokens } = req.body;

    // Validate input
    if (!uniId || !name || !email || !password || !phone || !department || !tokens) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Validate budget (if provided)
    if (budget && isNaN(budget)) {
      return res.status(400).json({ message: "Budget must be a valid number" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      uni_id: uniId, // Fixed naming
      name,
      email,
      password: hashedPassword, // Store hashed password
      phone,
      hostler,
      room_no: roomNumber, // Fixed naming
      department,
      budget: budget ? parseFloat(budget) : undefined, // Convert budget to number
      tokens
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error in /register:", err);
    
    // Handle specific Mongoose errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", error: err.message });
    }
    
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
