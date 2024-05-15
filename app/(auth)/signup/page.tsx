"use client"
import { signupWithMail, signupWithCardano, generateNonce } from "./signupActions";
import { signMessage, WalletConnectButton } from "littlefish-nft-auth-framework-beta/frontend";
import { useWallet } from "littlefish-nft-auth-framework-beta";
import { useState } from "react";

async function handleSign(walletID: string, isConnected: boolean, walletAddress: string): Promise<[string, string] | void> {
  const nonceResponse = await generateNonce();
  if (!nonceResponse) {
    console.error("Failed to generate nonce");
    return;
  }
  
  const nonce = nonceResponse;
  
  try {
    const signResponse = await signMessage(walletID, isConnected, nonce, walletAddress);
    if (!signResponse) {
      console.error("Failed to sign message");
      return;
    }
    const [key, signature] = signResponse;
    return [key, signature];
  } catch (error) {
    console.error("Error signing message:", error);
  }
}

export default function SignUpPage() {
  const { isConnected, connectedWalletId, connectWallet, disconnectWallet, networkID, addresses, wallets } = useWallet();
  console.log(networkID);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [key, setKey] = useState('');
  const [signature, setSignature] = useState('');

  async function handleCardanoSignup() {
    if (connectedWalletId !== null) {
      try {
        const signResponse = await handleSign(connectedWalletId, isConnected, addresses[0]);
        if (signResponse) {
          const [key, signature] = signResponse;
          await signupWithCardano(connectedWalletId, isConnected, addresses[0], networkID, key, signature);
        }
      } catch (error) {
        console.error("Error signing message:", error);
      }
    }
  }

  async function handleEmailSignup() {
    try {
      await signupWithMail(email, password);
    } catch (error) {
      console.error("Email signup failed:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <WalletConnectButton />
      <form className="w-full max-w-sm p-4 bg-gray-800 rounded shadow-md">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
      <button 
        onClick={handleEmailSignup}
        className="w-full max-w-sm p-2 mt-4 font-semibold text-white bg-blue-500 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Signup with Email
      </button>
      {isConnected ? (
        <div className="w-full max-w-sm mt-4 p-4 bg-gray-800 rounded shadow-md">
          <button 
            onClick={() => handleCardanoSignup()}
            className="w-full p-2 mb-2 font-semibold text-white bg-green-500 rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Signup with Wallet
          </button>
        </div>
      ) : (
        <h1 className="text-center text-xl mt-4">Connect your wallet to signup</h1>
      )}
    </div>
  );
  
}
