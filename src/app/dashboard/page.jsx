'use client';

import Navbar from './navbar';
import Cart from './cart';
import Profile from './profile';
import Menu from './Menu';
import HealthMeals from './healthMeals';
import { Container, Typography, Box } from '@mui/material';

export default function Dashboard() {
  return (
    <Box
      sx={{
        backgroundImage: 'url(https://www.school-news.com.au/wp-content/uploads/2022/05/c-sveta-adobe-stock_kitchen-1.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Navbar />
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
          Welcome to the Cafeteria Management System
        </Typography>
        <Profile />
        <Menu />
        <HealthMeals />
        <Cart />
      </Box>
    </Box>
  );
}