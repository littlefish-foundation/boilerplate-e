import React, { createContext, useContext, useState } from 'react'
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";;

const WalletContext = createContext(null);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const {
        isEnabled,
        isConnected,
        enabledWallet,
        stakeAddress,
        signMessage,
        usedAddresses,
        connect,
        disconnect,
        accountBalance,
      } = useCardano();

  return (
    <WalletContext.Provider value={{ isConnected, enabledWallet, stakeAddress, usedAddresses, connect, disconnect, accountBalance }}>
      {children}
    </WalletContext.Provider>
  );
};
