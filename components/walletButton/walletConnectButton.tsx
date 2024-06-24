"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import "./walletConnectButton.css";
import { Wallet, Asset } from "littlefish-nft-auth-framework/frontend";

/**
 * A component that displays a button to connect to a wallet.
 */

const WalletConnectButton: React.FC<{
  onAssetSelect: (asset: Asset) => void;
}> = ({ onAssetSelect }) => {
  // Use the wallet context to get the wallets, connection status, and connect/disconnect functions
  const {
    wallets, // The wallets available to connect to
    isConnected, // A boolean indicating if the wallet is connected
    connectWallet, // A function to connect to a wallet
    disconnectWallet, // A function to disconnect the wallet
    connectedWalletId, // The ID of the connected wallet
    assets, // The assets associated with the connected wallet
    decodeHexToAscii, // A function to decode hex strings to ASCII
  } = useWallet();
  const [decodedAssets, setDecodedAssets] = useState<Asset[]>([]);

  useEffect(() => {
    if (assets && Array.isArray(assets)) {
      setDecodedAssets(decodeHexToAscii(assets));
    }
  }, [assets]);

  // State to manage the visibility of the dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [assetDropdownVisible, setAssetDropdownVisible] = useState(false);

  // State to manage the wallet name and icon
  const [walletName, setWalletName] = useState<string>("");
  const [walletIcon, setWalletIcon] = useState<string>("");

  // Function to toggle the doropdown menu visibility
  const handleConnectClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Function to handle the wallet selection and connection
  const handleWalletClick = (wallet: Wallet) => {
    connectWallet(wallet.name);
    setWalletName(wallet.name);
    setWalletIcon(wallet.icon);
    setDropdownVisible(false); // Close the dropdown after selecting a wallet
  };

  const handleAssetDropdownClick = () => {
    setAssetDropdownVisible(!assetDropdownVisible);
  };

  const handleAssetClick = (asset: Asset) => {
    onAssetSelect(asset);
    setAssetDropdownVisible(false);
  };

  return (
    <div id="container">
      {isConnected ? (
        <>
          <button id="button" onClick={() => disconnectWallet()}>
            Disconnect {connectedWalletId}
          </button>
          {assets.length > 0 && (
            <button id="button" onClick={() => handleAssetDropdownClick()}>
              <p>You can authenticate with Asset</p>
            </button>
          )}
          {assetDropdownVisible && (
            <div id="dropdown">
              {decodedAssets.map((asset, index) => (
                <button
                  id="button"
                  key={index}
                  onClick={() => handleAssetClick(assets[index])}
                >
                  <p id="assetName">Select {asset.assetName}</p>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        // Display the connect button and the dropdown menu if the wallet is not connected
        <div>
          <button id="button" onClick={() => handleConnectClick()}>
            Connect Wallet
          </button>
          {dropdownVisible && (
            // Display the dropdown menu with the available wallets if the dropdown is visible
            <div id="dropdown">
              {wallets.map((wallet, index) => (
                <button
                  id="button"
                  key={index}
                  onClick={() => handleWalletClick(wallet)}
                >
                  <p id="walletName">
                    {wallet.name !== "typhoncip30" ? wallet.name : "typhon"}
                  </p>
                  <img id="image" src={wallet.icon} alt="wallet icon" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default WalletConnectButton;