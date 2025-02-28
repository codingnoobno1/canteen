'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';

const BackgroundContainer = styled('div')({
  backgroundImage:
    "url('https://i.pinimg.com/originals/6e/b0/3a/6eb03a3ddb7ca82a7a56fbf0c10f0bda.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: '100vw',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '20px 0',
  overflow: 'auto',
});

const FormContainer = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  width: '90%',
  maxWidth: '400px',
  padding: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
});

export default function LoginForm() {
  const { user, isSignedIn } = useUser();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      syncUserWithMongo();
    }
  }, [isSignedIn]);

  const syncUserWithMongo = async () => {
    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'GET',
        credentials: 'include',
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sync user');
  
      dispatch(loginSuccess({ token: data.token, user: data.user })); // Store token & user
      setSuccess('Login successful!');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <BackgroundContainer>
      <FormContainer elevation={3}>
        <Typography variant="h5" gutterBottom>
          {isSignedIn ? 'Welcome' : 'Login'}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login with Clerk
            </Button>
          </SignInButton>
        ) : (
          <SignOutButton>
            <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
              Logout
            </Button>
          </SignOutButton>
        )}
      </FormContainer>
    </BackgroundContainer>
  );
}
