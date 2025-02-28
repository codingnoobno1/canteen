'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    fetch('http://localhost:5004/cart')
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(err => console.error("Error fetching cart:", err));
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5004/cart/${itemId}`, { method: 'DELETE' });

      if (response.ok) {
        setCartItems(cartItems.filter(item => item._id !== itemId));
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const checkout = async () => {
    try {
      const response = await fetch('http://localhost:5004/checkout', { method: 'POST' });

      if (response.ok) {
        setCartItems([]); // Clear cart after successful checkout
        console.log("Checkout successful, stock updated!");
      } else {
        console.error("Checkout failed");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <Card sx={{ mt: 3, p: 2, backgroundColor: '#ffebee' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#b71c1c' }}>
          Shopping Cart
        </Typography>
        {cartItems.length === 0 ? (
          <Typography variant="body1">Your cart is empty</Typography>
        ) : (
          <Grid container spacing={2}>
            {cartItems.map((item) => (
              <Grid item xs={12} key={item._id}>
                <Card sx={{ p: 1, backgroundColor: '#ffcdd2' }}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{item.price} x {item.quantity}
                    </Typography>
                    <IconButton color="error" onClick={() => removeFromCart(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {cartItems.length > 0 && (
          <Button variant="contained" color="primary" onClick={checkout} sx={{ mt: 2 }}>
            Checkout
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
