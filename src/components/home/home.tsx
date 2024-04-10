import React, { useState } from 'react';
import '../../App.css';
import SignMessage from '../signMessage.tsx';
import getInstalledWallets from '../wallet/GetInstalledWallets.tsx';

function HomePage() {
    const InstalledWallets = getInstalledWallets();
  
    return (
      <SignMessage />
    );
    }

export default HomePage;