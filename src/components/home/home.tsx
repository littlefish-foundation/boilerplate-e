import React, { useState, useEffect } from "react";
import "../../App.css";
import SignMessage from "../signMessage.tsx";
import getInstalledWallets from "../wallet/GetInstalledWallets.tsx";
import { GetAssets } from "../wallet/getAssets.tsx";

function HomePage() {
  const [addressAssets, setAddressAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exampleAddress =
    "addr1qyu66554686zyvpm5nvjdgdqn5f093t6l33kaqxlw2f2kx2rmeztpaqyw96kmf3wtq55ckpmugsugcx9kcwcgq22laas5zvnnw";

    const handleFetchAssets = async () => {
      setLoading(true);
      setError("");
      try {
        const assets = await GetAssets(exampleAddress);
        console.log(assets);
  
        // Transforming the fetched assets to the desired structure
        const transformedAssets = assets.flatMap(asset =>
          asset.amount.map(amt => ({
            unit: amt.unit,
            quantity: amt.quantity
          }))
        );
  
        setAddressAssets(transformedAssets);
      } catch (err) {
        console.error("Error fetching assets:", err);
        setError("Failed to fetch assets");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <button onClick={handleFetchAssets}>Fetch Assets</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div>
          {addressAssets.map((asset, index) => (
            <div key={index}>
              <h4>Asset {index + 1}</h4>
              <p>Unit: {asset.unit}, Quantity: {asset.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }


export default HomePage;