import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import PictureLayout from './components/PictureLayout';

export default function Landingpage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <PictureLayout/>
      {/* Add more sections here */}
    </div>
  );
}
