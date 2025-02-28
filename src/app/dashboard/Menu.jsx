'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

const socket = io('http://localhost:5004'); // Connect WebSocket

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  // Fetch menu on mount & listen for live updates
  useEffect(() => {
    fetchMenu();

    // Listen for real-time menu updates
    socket.on("menuUpdate", (updatedMenu) => {
      console.log("Menu updated via WebSocket:", updatedMenu);
      setMenuItems(updatedMenu);
    });

    return () => {
      socket.off("menuUpdate");
    };
  }, []);

  // Fetch menu from backend
  const fetchMenu = async () => {
    try {
      const res = await fetch('http://localhost:5004/menu');
      if (!res.ok) throw new Error("Failed to fetch menu");
      const data = await res.json();
      console.log("Fetched menu:", data);
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  // Add item to cart (send only required fields)
  const addToCart = async (item) => {
    try {
      await fetch('http://localhost:5004/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item._id,  // Ensure backend expects _id
          name: item.name,
          price: item.price,
          quantity: 1,  // Default quantity for cart
        }),
      });
      console.log(`Added ${item.name} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <Card sx={{ mt: 3, p: 2, backgroundColor: '#c8e6c9' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#1b5e20' }}>
          Cafeteria Menu
        </Typography>
        <Grid container spacing={2}>
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <Grid item xs={12} sm={6} key={item._id}>
                <Card sx={{ p: 1, backgroundColor: '#a5d6a7' }}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{item.price}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => addToCart(item)} 
                      sx={{ mt: 1 }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", width: "100%" }}>
              No menu items available.
            </Typography>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
