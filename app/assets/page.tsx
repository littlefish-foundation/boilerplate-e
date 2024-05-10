"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "littlefish-nft-auth-framework-beta";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Asset } from "next/font/google";

const CardComponent = () => {
  const { assets, isConnected, decodeHexToAscii } = useWallet();
  const [walletAssets, setWalletAssets] = useState([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    setWalletAssets(decodeHexToAscii(assets) || []);
  }, [assets]);

  return isConnected ? (
    <div className="mt-16 flex flex-wrap -mx-2">
      {assets && walletAssets && walletAssets.map((item, index) => (
        <div
          key={index}
          // Change here: Use `w-full` for mobile and `w-1/4` for larger screens
          className="p-2 w-full md:w-1/4"
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <div
            className="relative bg-black border-2 border-purple-100 shadow-md rounded-lg px-4 py-4"
            style={{ borderColor: "rgba(168, 85, 247, 0.2)" }}
          >
            {hoverIndex === index && (
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
              <React.Fragment>
                <p className="text-gray-600">Name: {assets[index].assetName}</p>
              </React.Fragment>
            ) : (
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
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-center text-xl md:text-2xl lg:text-3xl">
        You need to connect a Cardano wallet to view your assets
      </h2>
    </div>
  );
};

export default CardComponent;
