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

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
          <Button color="inherit" component={Link} href="/support">
            Support
          </Button>
          <Button color="inherit" component={Link} href="/signin">
            Sign In
          </Button>
          <Button variant="contained" color="secondary" component={Link} href="/signup">
            Sign Up
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

export default Navbar;
