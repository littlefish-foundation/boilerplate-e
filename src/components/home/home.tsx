import React, { useState } from 'react';
import '../../App.css';
import Wallet from '../wallet/Wallet.tsx';
import getInstalledWallets from '../wallet/GetInstalledWallets.tsx';

function HomePage() {
    const [selectedWallet, setSelectedWallet] = useState(null);
    const InstalledWallets = getInstalledWallets();
  
    const handleClick = (wallet) => {
      setSelectedWallet(wallet);
    }
      return (
      <div>
    <div className="walletList">
            {InstalledWallets.map((item) => (
              <a key={item} className="walletLink" onClick={() => handleClick(item.name)}>
                {item.icon && <img src={item.icon} alt={`${item.name} icon`} style={{ marginRight: '8px', verticalAlign: 'middle', width: '24px', height: '24px' }} />}
                {item.name}
              </a>
            ))}
      </div>
      <h1>hehe</h1>
      <Wallet name={selectedWallet} />
      </div>
    );
    }

export default HomePage;