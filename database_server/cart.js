const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST", "DELETE"] },
});

app.use(cors());
app.use(express.json());

let cart = [];

// 📌 Fetch menu from Admin API (5005)
app.get('/menu', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5005/admin/menu');
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching menu from 5005:", error);
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// 📌 Get cart items
app.get('/cart', (req, res) => {
  res.json(cart);
});

// 📌 Add item to cart (🚀 FIX: No immediate stock deduction)
app.post('/cart', async (req, res) => {
  const { name, quantity } = req.body;

  try {
    // Fetch the latest stock from Admin API
    const response = await axios.get('http://localhost:5005/admin/menu');
    const menu = response.data;
    const item = menu.find(item => item.name === name);

    if (!item) {
      return res.status(404).json({ message: `Item ${name} not found` });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ message: `Not enough stock. Available: ${item.quantity}` });
    }

    // Add to cart without modifying stock
    const cartItemIndex = cart.findIndex(cartItem => cartItem.name === name);
    if (cartItemIndex !== -1) {
      cart[cartItemIndex].quantity += quantity;
    } else {
      cart.push({ name, quantity, price: item.price }); // Store price too
    }

    io.emit('cartUpdate', cart);
    res.json({ message: "Item added to cart", cart });

  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
});

// 📌 Remove item from cart (🚀 FIX: Ensure correct stock restoration)
app.post('/cart/remove', async (req, res) => {
  const { name } = req.body;
  const cartItemIndex = cart.findIndex(item => item.name === name);

  if (cartItemIndex === -1) {
    return res.status(400).json({ message: "Item not found in cart" });
  }

  cart.splice(cartItemIndex, 1); // Remove from cart (Stock is untouched until checkout)

  io.emit('cartUpdate', cart);
  res.json({ message: "Item removed from cart", cart });
});

// 📌 Checkout (🚀 FIX: Stock is reduced only at checkout)
app.post('/order', async (req, res) => {
  try {
    if (cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Reduce stock in Admin API based on final cart items
    const response = await axios.patch('http://localhost:5005/admin/menu/update-stock', { cart });

    if (response.data.success) {
      cart = []; // Clear cart after checkout
      io.emit('cartUpdate', cart);
      res.json({ message: "Order placed successfully" });
    } else {
      res.status(400).json({ message: response.data.message });
    }
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ message: "Error processing order" });
  }
});

// 📌 Listen for menu updates from Admin API (5005)
const socket5005 = require('socket.io-client')('http://localhost:5005');
socket5005.on('menuUpdate', (updatedMenu) => {
  io.emit('menuUpdate', updatedMenu);
});

// 📌 Start server
server.listen(5004, () => {
  console.log('Client server running on http://localhost:5004');
});
