'use client';

import { AppBar, Toolbar, Button } from '@mui/material';

export default function Navbar() {
  const canteens = ['Main Canteen', 'Fast Food Corner', 'Juice Bar', 'Bakery', 'Coffee Shop'];

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {canteens.map((canteen, index) => (
          <Button key={index} color="inherit" sx={{ mx: 1 }}>
            {canteen}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}
