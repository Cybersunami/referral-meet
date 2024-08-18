'use client'
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

let colortheme = createTheme({
  palette: {
    primary: {
      main: '#f8f8ff', // Example primary color
    },
    secondary: {
      main: '#000000', // Example secondary color
    },
    // You can add other standard colors here (e.g., error, warning)
  },
});

const logout = async (router) => {
  try {
    await signOut(auth); // Sign out the user
    router.push("/signin"); // Redirect to the sign-in page or any other page you prefer
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

const Navbarloggedin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter()

  return (
    <ThemeProvider theme={colortheme}>
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Referral Meet
        </Typography>
        {!isMobile && (
          <Box>
          <Button color="inherit" component={Link} href="/home">
            Home
          </Button>
          <Button color="inherit" component={Link} href="/support">
            Support
          </Button>
           <Button color="inherit" onClick={logout}>
            Logout
          </Button> 
          
        </Box>
        
        )}
        {isMobile && (
          <Box>
            <Button bg="white">Sign In</Button>
            <Button variant="contained" color="secondary">
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
    </ThemeProvider>
  );
};

export default Navbarloggedin;
