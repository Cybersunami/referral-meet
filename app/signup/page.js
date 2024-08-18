'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { handleRegister } from '../firebasefunctions/auth';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Use useRouter from Next.js

  const userdata = {
    email: email,
    password: password,
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await handleRegister(userdata); // Handle user registration logic
      router.push('/home'); // Navigate to homepage after successful registration
    } catch (error) {
      // Handle error (e.g., display error message)
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Signup
        </Typography>
        <Box component="form" onSubmit={onsubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
