"use client"
import { Box, Grid, Typography } from '@mui/material';
import React from 'react'

export default function PictureLayout() {
  const data = [
    {
      id: 1,
      imgSrc: '/images/rf1.png',
      text: 'A place for student referrals.',
    },
    {
      id: 2,
      imgSrc: '/images/rf2.png',
      text: 'Network and connect with your peers.',
    },
    {
      id: 3,
      imgSrc: '/images/rf3.png',
      text: 'Collaboration',
    },
    {
      id: 4,
      imgSrc: '/images/rf4.png',
      text: 'Personal Growth.',
    },
  ];

  return (
    <Box sx={{ padding: 2, marginTop:5, background: '#FDA172' }}>
    {data.map((item, index) => (
      <Grid
        container
        spacing={2}
        alignItems="center"
        key={item.id}
        direction={index % 2 === 0 ? 'row' : 'row-reverse'}
        sx={{ marginBottom: 4 }}
      >
        <Grid item xs={12} md={6}>
          <Box component="img" src={item.imgSrc} alt={`Picture ${item.id}`} width="100%" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{color:'white'}} variant="h4">{item.text}</Typography>
        </Grid>
      </Grid>
    ))}
  </Box>
  );
}
