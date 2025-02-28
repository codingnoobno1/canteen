const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware to verify Clerk JWT
const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.CLERK_SECRET_KEY);
    req.userId = decoded.sub;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

// Register User
router.post("/register", verifyJWT, async (req, res) => {
  const { userId, email, fullName } = req.body;

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    user = await User.create({ clerkId: userId, email, fullName });
  }

  res.json({ message: "User registered", user });
});

// Login User (Verify Clerk JWT)
router.get("/login", verifyJWT, async (req, res) => {
  const user = await User.findOne({ clerkId: req.userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: "User logged in", user });
});

module.exports = router;
