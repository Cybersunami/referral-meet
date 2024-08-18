'use client'
import React from 'react';
import { Container, Typography, Button, Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#f8f8ff', 
    },
    secondary: {
      main: '#000000', 
    },
  
  },
  
});


const Hero = () => {
  return (
    <ThemeProvider theme={theme}>
    <Box
      sx={{
        backgroundColor: 'lightslategrey',
        color: 'whitesmoke',
        padding: '100px 0',
        textAlign: 'center',
      }}
    >
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Referral Meet!
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
        A space for student referrals, networking, and connections. Connect with fellow students, expand your network, and unlock new opportunities.
        </Typography>
        <Button variant="contained" color="secondary" size="large" sx={{ mt: 3 }}>
          Get Started
        </Button>
      </Container>
    </Box>
    </ThemeProvider>
  );
};

export default Hero;
