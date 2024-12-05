"use client";
import React, { useState, useEffect } from "react";
import { Asset, useWallet } from "littlefish-nft-auth-framework/frontend";
import { BorderBeam } from "@/components/magicui/border-beam";

// Define the CardComponent function component
const CardComponent = () => {
  const { assets, isConnected, decodeHexToAscii } = useWallet(); // Destructure wallet assets, connection status, and decoding function from useWallet hook
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]); // State for storing decoded wallet assets
  const [hoverIndex, setHoverIndex] = useState<number | null>(null); // State for storing the index of the currently hovered asset

  useEffect(() => {
    try {
      if (assets && Array.isArray(assets)) {
        // Decode the assets from hex to ASCII if assets array is available
        const decodedAssets = decodeHexToAscii(assets);
        // Update the walletAssets state with the decoded assets
        setWalletAssets(decodedAssets);
      }
    } catch (error) {
      console.error("Failed to decode assets:", error); // Log any errors that occur during decoding
    }
  }, [assets]); // Effect runs whenever the assets array changes

  return isConnected ? (
    // Render the assets if the wallet is connected
    <div className="mt-16 flex flex-wrap -mx-2">
      {assets &&
        walletAssets &&
        walletAssets.map((item, index) => (
          <div
            key={index}
            // Use `w-full` for mobile and `w-1/4` for larger screens
            className="p-2 w-full md:w-1/4"
            onMouseEnter={() => setHoverIndex(index)} // Set the hover index on mouse enter
            onMouseLeave={() => setHoverIndex(null)} // Reset the hover index on mouse leave
          >
            <div
              className="relative bg-black border-2 border-purple-100 shadow-md rounded-lg px-4 py-4"
              style={{ borderColor: "rgba(168, 85, 247, 0.2)" }}
            >
              {hoverIndex === index && (
                // Render BorderBeam component if the current index matches the hover index
                <BorderBeam
                  size={200}
                  duration={12}
                  delay={0}
                  colorFrom="#8A2BE2"
                  colorTo="#DA70D6"
                />
              )}
              <h2 className="text-center font-bold text-xs mb-4 text-electric-violet-500">
                PolicyID: {item.policyID}
              </h2>
              {hoverIndex === index ? (
                // Display asset name in more detail when hovered
                <React.Fragment>
                  <p className="text-gray-600">
                    Name: {assets[index].assetName}
                  </p>
                </React.Fragment>
              ) : (
                // Display asset name normally when not hovered
                <React.Fragment>
                  <p className="text-gray-600">Name: {item.assetName}</p>
                </React.Fragment>
              )}
              <p className="text-gray-600">Amount: {item.amount}</p>
            </div>
          </div>
        ))}
    </div>
  ) : (
    // Render a message prompting the user to connect their wallet if not connected
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-center text-xl md:text-2xl lg:text-3xl">
        You need to connect a Cardano wallet to view your assets
      </h2>
    </div>
  );
};

export default CardComponent; // Export the CardComponent as the default export
