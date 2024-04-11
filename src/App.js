import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Head from './pages/head/page.tsx';
import HomePage from './pages/home/home.tsx';
import Assets from './pages/assets/assets.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Head />} />
          <Route path="/assets" element={<Assets />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
