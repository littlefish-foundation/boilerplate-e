import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Head from './components/head/page.tsx';
import HomePage from './components/home/home.tsx';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/head" element={<HomePage />} />
    <Route path="/" element={<Head />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
