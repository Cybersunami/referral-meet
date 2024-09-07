"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Navbarloggedin from "../components/navbarloggedin";
import { useAuthRedirect } from "../components/useauthredirect";

import { Dancing_Script } from "next/font/google";
import Image from "next/image";

// Load the Dancing Script font
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can specify the weights you need
});

export default function Support() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState([]);

  const { isAuthenticated, loading: authloading } = useAuthRedirect();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponses([...responses, { query, response: data.output }]);
      } else {
        setResponses([...responses, { query, response: data.error }]);
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      setResponses([
        ...responses,
        { query, response: "Error submitting query" },
      ]);
    }

    setQuery("");
  };

  if (!isAuthenticated) {
    return null; // This is a safeguard; user will be redirected if not authenticated
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <Box mb={10} width={"100%"}>
        <Navbarloggedin />
      </Box>

      <Typography
        variant="h4"
        component="h1"
        className={dancingScript.className}
        gutterBottom
      >
        Chat Bot
      </Typography>
      <Box
        sx={{
          width: "80%", 
          height: "500px", 
          padding: "40px", 
          backgroundColor: "#f9f9f9",
          borderRadius: "15px", 
          marginBottom: "30px",
        }}
      >
        {responses.map((res, index) => (
          <Paper
            key={index}
            sx={{
              padding: "15px", 
              marginBottom: "15px",
              height: "250px", 
              backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#f3e5f5",
            }}
          >
            <Typography variant="body1">
              <strong>You:</strong> {res.query}
            </Typography>
            <Typography variant="body2">
              <strong>Bot:</strong> {res.response}
            </Typography>
          </Paper>
        ))}
      </Box>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something..."
            sx={{ marginRight: "10px" }}
          />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </Box>
      </form>
      <Box marginTop={5}>
        <Image src={"/images/rf5.png"} width={400} height={400} />
      </Box>
      <Typography variant="h5"
      >
          Meet Chatbot!
      </Typography>
      <Typography  
       variant="h6"
      sx={{width:'80%', marginBottom:'10' }}>
      Chatbot is your friendly and positive virtual companion, created by Misa, a talented programmer. Designed to be a supportive friend, Chatbot offers kind, helpful, and uplifting advice to brighten your day and assist you with any questions or concerns. Whether you need guidance or just a cheerful conversation, Chatbot is here to help!
      </Typography>
    </Container>
  );
}
