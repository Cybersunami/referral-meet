"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Dancing_Script } from "next/font/google";

// Load the Dancing Script font
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can specify the weights you need
});

let colortheme = createTheme({
  palette: {
    primary: {
      main: "#f8f8ff", // Example primary color
    },
    secondary: {
      main: "#000000", // Example secondary color
    },
    // You can add other standard colors here (e.g., error, warning)
  },
});

const Navbarloggedin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/"); // Redirect to the home page after logout
      console.log("function is being called");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <ThemeProvider theme={colortheme}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className={dancingScript.className} // Apply the font using className
            component="div"
            sx={{ flexGrow: 1 }}
          >
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
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbarloggedin;
