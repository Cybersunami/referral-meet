'use client'
import React, { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import Navbarloggedin from '../components/navbarloggedin';

export default function Support() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: query })
      });

      const data = await res.json();

      if (res.ok) {
        setResponses([...responses, { query, response: data.output }]);
      } else {
        setResponses([...responses, { query, response: data.error }]);
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      setResponses([...responses, { query, response: 'Error submitting query' }]);
    }

    setQuery('');
  };

  return (
   
    <Container
    
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff',
        padding: '20px',
      }}
    >
      <Box mb={10} width={'100%'}>
      <Navbarloggedin />

      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        Chat Support
      </Typography>
      <Box
        sx={{
          width: '100%',
          maxHeight: '60vh',
          overflowY: 'auto',
          padding: '10px',
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          marginBottom: '20px',
        }}
      >
        {responses.map((res, index) => (
          <Paper
            key={index}
            sx={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: index % 2 === 0 ? '#e3f2fd' : '#f3e5f5',
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
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something..."
            sx={{ marginRight: '10px' }}
          />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </Box>
      </form>
    </Container>
  );
}
