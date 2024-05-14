"use client";
import { loginWithMail, loginWithCardano, generateNonce } from "./loginActions";
import { useWallet } from "littlefish-nft-auth-framework-beta";
import { signMessage } from "littlefish-nft-auth-framework-beta/frontend";
import { useState } from "react";
import { string } from "zod";

async function handleSign(
  walletID: string,
  isConnected: boolean,
  walletAddress: string
): Promise<[string, string] | void> {
  const nonceResponse = await generateNonce();
  if (!nonceResponse) {
    console.error("Failed to generate nonce");
    return;
  }

  const nonce = nonceResponse;

  try {
    const signResponse = await signMessage(
      walletID,
      isConnected,
      nonce,
      walletAddress
    );
    if (!signResponse) {
      console.error("Failed to sign message");
      return;
    }
    const response = signResponse;
    const key = response[0];
    const signature = response[1];
    return [key, signature];
  } catch (error) {
    console.error("Error signing message:", error);
  }
}

export default function loginPage() {
  const {
    isConnected,
    connectedWalletId,
    connectWallet,
    disconnectWallet,
    networkID,
    addresses,
    wallets,
  } = useWallet();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleCardanologin() {
    let key: string;
    let signature: string;
    if (connectedWalletId) {
      try {
        const signResponse = await handleSign(
          connectedWalletId,
          isConnected,
          addresses[0]
        );
        if (signResponse) {
          [key, signature] = signResponse;
          loginWithCardano(
            connectedWalletId,
            isConnected,
            addresses[0],
            networkID,
            key,
            signature
          );
        }
      } catch (error) {
        console.error("Failed to handle Cardano login:", error);
      }
    }
  }
  function handleEmaillogin() {
    loginWithMail(email, password);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
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
        onClick={handleEmaillogin}
        className="w-full max-w-sm p-2 mt-4 font-semibold text-white bg-blue-500 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login with Email
      </button>
      {isConnected ? (
        <div className="w-full max-w-sm mt-4 p-4 bg-gray-800 rounded shadow-md">
          <button 
            onClick={() => handleCardanologin()}
            className="w-full p-2 mb-2 font-semibold text-white bg-green-500 rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login with Wallet
          </button>
          <p className="mb-2 text-gray-300">Connected Wallet: {connectedWalletId}</p>
          <button 
            onClick={() => disconnectWallet()}
            className="w-full p-2 font-semibold text-white bg-red-500 rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        wallets.map((wallet: string) => (
          <button
            key={wallet}
            type="submit"
            onClick={() => {
              connectWallet(wallet);
            }}
            className="w-full max-w-sm p-2 mt-2 font-semibold text-white bg-indigo-500 rounded shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Connect {wallet}
          </button>
        ))
      )}
    </div>
  );
  
}
