"use client";
import { signupWithMail, signupWithCardano} from "./signupActions";
import { useWallet } from "littlefish-nft-auth-framework-beta";
import { useState } from "react";


export default function SignUpPage() {
  const {
    isConnected,
    connectedWalletId,
    connectWallet,
    disconnectWallet,
    networkID,
    addresses,
  } = useWallet();
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for the blockchain form
    const [walletAddress, setWalletAddress] = useState('');
    const [key, setKey] = useState('');
    const [signature, setSignature] = useState('');

    function handleSignup() {
      signupWithCardano(connectedWalletId, isConnected, addresses[0], networkID);
      //console.log(signMessage(connectedWalletId, isConnected, addresses[0], networkID));
    }
  return (
    <div>
        {isConnected ? (
          <div>
            <button onClick={() => handleSignup()}>Signup with Wallet</button>
            <p>Connected Wallet: {connectedWalletId}</p>
            <button onClick={() => disconnectWallet()}>
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button onClick={() => connectWallet("nami")}>Connect Wallet</button>
        )}
    </div>
  );
}

interface BlockchainData {
  walletAddress: string;
  networkID: number;
}