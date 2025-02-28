// dashboard/profile.jsx
'use client';

import { useState } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'absolute', top: 20, right: 20 }}>
      <IconButton onClick={() => setIsOpen(!isOpen)}>
        <AccountCircleIcon fontSize="large" />
      </IconButton>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ position: 'absolute', top: 50, right: 0, zIndex: 10 }}
        >
          <Card sx={{ p: 2, width: 200 }}>
            <CardContent>
              <Typography variant="h6">Profile</Typography>
              <Typography variant="body2">Name: Tushar Herono</Typography>
              <Typography variant="body2">Email: tusharherono1@gmail.com</Typography>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
