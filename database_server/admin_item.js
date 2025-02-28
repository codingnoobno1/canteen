const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST", "DELETE", "PATCH"] },
});

app.use(cors());
app.use(express.json());

// 📌 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/menuDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 📌 Menu Schema
const MenuItem = mongoose.model("MenuItem", {
  name: String,
  price: Number,
  quantity: Number,
});

// 📌 Fetch Menu
app.get("/admin/menu", async (req, res) => {
  const menu = await MenuItem.find();
  res.json(menu);
});

// 📌 Add Item
app.post("/admin/menu", async (req, res) => {
  const { name, price, quantity } = req.body;
  const existingItem = await MenuItem.findOne({ name });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
  } else {
    const newItem = new MenuItem({ name, price, quantity });
    await newItem.save();
  }

  const menu = await MenuItem.find();
  io.emit("menuUpdate", menu);
  res.json({ message: "Item added", menu });
});

// 📌 Remove Item
app.delete("/admin/menu/:id", async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);

  const menu = await MenuItem.find();
  io.emit("menuUpdate", menu);
  res.json({ message: "Item removed", menu });
});

// 📌 Update Stock Based on Orders (Received from 5004)
app.patch("/admin/menu/update-stock", async (req, res) => {
  const { cart } = req.body;

  try {
    for (const cartItem of cart) {
      const item = await MenuItem.findOne({ name: cartItem.name });

      if (!item) {
        return res.status(400).json({ success: false, message: `Item ${cartItem.name} not found` });
      }

      if (cartItem.quantity > 0) { // Deduct stock when ordering
        if (item.quantity < cartItem.quantity) {
          return res.status(400).json({ success: false, message: `Not enough stock for ${cartItem.name}. Available: ${item.quantity}` });
        }
        item.quantity -= cartItem.quantity;
      } else { // Restore stock when removing from cart
        item.quantity += Math.abs(cartItem.quantity);
      }

      await item.save();
    }

    const menu = await MenuItem.find();
    io.emit("menuUpdate", menu);
    res.json({ success: true, message: "Stock updated", menu });

  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ success: false, message: "Error updating stock" });
  }
});

// 📌 Start Server
server.listen(5005, () => {
  console.log("Admin API running on http://localhost:5005");
});
