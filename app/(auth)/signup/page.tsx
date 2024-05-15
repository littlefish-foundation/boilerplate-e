"use client";
import { signupWithMail, signupWithCardano, generateNonce } from "./signupActions";
import { signMessage, WalletConnectButton } from "littlefish-nft-auth-framework-beta/frontend";
import { useWallet } from "littlefish-nft-auth-framework-beta";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const { isConnected, connectedWalletId, networkID, addresses } = useWallet();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleCardanoSignup() {
    if (connectedWalletId !== null) {
      try {
        const signResponse = await handleSign(connectedWalletId, isConnected, addresses[0]);
        if (signResponse) {
          const [key, signature] = signResponse;
          const result = await signupWithCardano(connectedWalletId, isConnected, addresses[0], networkID, key, signature);
          if (result.success) {
            setSuccess(true);
            setErrorMessage('');
            router.push("/login");
          } else {
            setErrorMessage(result.error || "Signup failed");
            setSuccess(false);
          }
        }
      } catch (error) {
        console.error("Error signing message:", error);
        setErrorMessage("Error signing message");
        setSuccess(false);
      }
    }
  }

  async function handleEmailSignup() {
    try {
      const result = await signupWithMail(email, password);
      if (result.success) {
        setSuccess(true);
        setErrorMessage('');
        router.push("/login");
      } else {
        setErrorMessage(result.error || "Signup failed");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Email signup failed:", error);
      setErrorMessage("Email signup failed");
      setSuccess(false);
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
      {errorMessage && ( // Display error message if present
        <div className="w-full max-w-sm mt-4 p-2 bg-red-500 text-white text-center rounded">
          {errorMessage}
        </div>
      )}
      {success && (
        <div className="w-full max-w-sm mt-4 p-2 bg-green-500 text-white text-center rounded">
          Signup Successful
        </div>
      )}
    </div>
  );
}
