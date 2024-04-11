import React from "react";
import { GetAssets } from "../../components/wallet/getAssets.tsx";
import { useWallet } from "../../providers/walletContext.tsx";
import "../../App.css";

function HomePage() {
  const { usedAddresses } = useWallet();
  const [assets, setAssets] = useState([]);
  console.log(usedAddresses);


    return (
      <div>
        hehe
      </div>
    );
  }


export default HomePage;