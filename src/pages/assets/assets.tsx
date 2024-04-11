import React, { useEffect, useState } from "react";
import "../../App.css";
import { useWallet } from "../../providers/walletContext.tsx";

export default function Assets() {
  const { usedAddresses, fetchAssets, assets } = useWallet();
  const [policyID, setPolicyID] = useState("");
  const [assetName, setAssetName] = useState("");

  useEffect(() => {
    if (usedAddresses && usedAddresses.length > 0) {
      fetchAssetsForAddress(usedAddresses[0]);
    }
  }, [usedAddresses, fetchAssets]);

  const fetchAssetsForAddress = async (address) => {
    try {
      await fetchAssets(address);
    } catch (err) {
      console.error("Error fetching assets:", err);
    }
  };
  
  const arrangeUnit = (unit) => {
    if (unit !== "lovelace") {
      const firstPart = unit.substring(0, 56);
      const secondPart = unit.substring(56);
      return `PolicyID: ${firstPart} Asset Name: ${secondPart}`;
    } else {
      return [unit];
    }
  }


  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Your Assets
        </h2>
        <div className="mt-6">
          <ul>
            {assets.map((asset, index) => (
              <li key={index} className="py-4">
                <div className="flex space-x-4">
                  <div className="flex-1 min-w-0">
                    {/* Process the unit string for display */}
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {arrangeUnit(asset.unit)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {asset.quantity}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}