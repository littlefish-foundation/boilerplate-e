import React, { useState } from 'react';
import './App.css';
import Wallet from './components/wallet/Wallet.tsx';
import getInstalledWallets from './components/wallet/GetInstalledWallets.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Head from './components/head/page.tsx';
import HomePage from './components/home/home.tsx';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
    <Route path="/head" element={<Head />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
