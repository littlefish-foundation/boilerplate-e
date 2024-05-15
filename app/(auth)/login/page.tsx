"use client";
import { loginWithMail, loginWithCardano, generateNonce } from "./loginActions";
import { useWallet } from "littlefish-nft-auth-framework-beta";
import { signMessage } from "littlefish-nft-auth-framework-beta/frontend";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthContext";

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

export default function LoginPage() {
  const { isConnected, connectedWalletId, connectWallet, disconnectWallet, networkID, addresses, wallets } = useWallet();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleCardanoLogin() {
    if (connectedWalletId !== null) {
      try {
        const signResponse = await handleSign(connectedWalletId, isConnected, addresses[0]);
        if (signResponse) {
          const [key, signature] = signResponse;
          const result = await loginWithCardano(connectedWalletId, isConnected, addresses[0], networkID, key, signature);
          if (result.success) {
            setSuccess(true);
            setErrorMessage('');
            router.push("/assets");
          } else {
            setErrorMessage(result.error || "Login failed");
            setSuccess(false);
          }
        }
      } catch (error) {
        console.error("Failed to handle Cardano login:", error);
        setErrorMessage("Failed to handle Cardano login");
        setSuccess(false);
      }
    }
  }

  async function handleEmailLogin() {
    try {
      const result = await loginWithMail(email, password);
      if (result.success) {
        setSuccess(true);
        setErrorMessage('');
        router.push("/assets");
      } else {
        setErrorMessage(result.error || "Login failed");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Email login failed:", error);
      setErrorMessage("Email login failed");
      setSuccess(false);
    }
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
        onClick={handleEmailLogin}
        className="w-full max-w-sm p-2 mt-4 font-semibold text-white bg-blue-500 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login with Email
      </button>
      {isConnected ? (
        <div className="w-full max-w-sm mt-4 p-4 bg-gray-800 rounded shadow-md">
          <button
            onClick={handleCardanoLogin}
            className="w-full p-2 mb-2 font-semibold text-white bg-green-500 rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login with Wallet
          </button>
          <p className="mb-2 text-gray-300">Connected Wallet: {connectedWalletId}</p>
          <button
            onClick={disconnectWallet}
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
      {errorMessage && ( // Display error message if present
        <div className="w-full max-w-sm mt-4 p-2 bg-red-500 text-white text-center rounded">
          {errorMessage}
        </div>
      )}
      {success && (
        <div className="w-full max-w-sm mt-4 p-2 bg-green-500 text-white text-center rounded">
          Login Successful
        </div>
      )}
    </div>
  );
}
