"use client";
import {
  signupWithMail,
  signupWithCardano,
  signupWithAsset,
  generateNonce,
} from "./signupActions";
import {
  signMessage,
  useWallet,
  WalletConnectButton,
  Asset,
} from "littlefish-nft-auth-framework/frontend";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Function to handle message signing for Cardano wallet
async function handleSign(
  walletID: string,
  isConnected: boolean,
  walletAddress: string
): Promise<[string, string] | void> {
  // Generate a nonce for the signing process
  const nonceResponse = await generateNonce();
  if (!nonceResponse) {
    console.error("Failed to generate nonce"); // Log error if nonce generation fails
    return;
  }

  const nonce = nonceResponse; // Store the generated nonce

  try {
    // Sign the nonce with the wallet
    const signResponse = await signMessage(
      walletID,
      isConnected,
      nonce,
      walletAddress
    );
    if (!signResponse) {
      console.error("Failed to sign message"); // Log error if message signing fails
      return;
    }
    const [key, signature] = signResponse; // Destructure key and signature from the response
    return [key, signature]; // Return the key and signature
  } catch (error) {
    console.error("Error signing message:", error); // Log any errors that occur during message signing
  }
}

// React component for the signup page
export default function SignUpPage() {
  const {
    isConnected,
    connectedWalletId,
    networkID,
    addresses,
    wallets,
    assets,
  } = useWallet(); // Destructure wallet connection status and details
  const router = useRouter(); // Initialize router for navigation
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [success, setSuccess] = useState(false); // State for success status
  const [selectedAsset, setSelectedAsset] = useState(null as Asset | null);


  const handleAssetSelect = (asset: Asset) => {
    console.log('Asset selected:', asset);
    setSelectedAsset(asset);
  };

  // Function to handle asset signup
  async function handleAssetSignup(asset: Asset) {
    if (connectedWalletId !== null) {
      try {
        // Sign the message using the wallet
        // The address comes as an array of length 1 usually from the wallet, so we use the first address
        const signResponse = await handleSign(
          connectedWalletId,
          isConnected,
          addresses[0]
        );
        if (signResponse) {
          const [key, signature] = signResponse; // Destructure key and signature from the response
          // Perform signup with the Cardano wallet details
          const result = await signupWithAsset(
            addresses[0],
            networkID,
            key,
            signature,
            asset
          );
          if (result.success) {
            setSuccess(true); // Set success status to true
            setErrorMessage(""); // Clear error message
            router.push("/login"); // Navigate to login page
          } else {
            setErrorMessage(result.error || "Signup failed"); // Set error message if signup fails
            setSuccess(false); // Set success status to false
          }
        }
      } catch (error) {
        console.error("Error signing message:", error); // Log any errors that occur during message signing
        setErrorMessage("Error signing message"); // Set error message for signing error
        setSuccess(false); // Set success status to false
      }
    } else {
      setErrorMessage("Wallet not connected"); // Set error message if wallet is not connected
    }
  }

  // Function to handle Cardano wallet signup
  async function handleCardanoSignup() {
    if (connectedWalletId !== null) {
      try {
        // Sign the message using the wallet
        // The address comes as an array of length 1 usually from the wallet, so we use the first address
        const signResponse = await handleSign(
          connectedWalletId,
          isConnected,
          addresses[0]
        );
        if (signResponse) {
          const [key, signature] = signResponse; // Destructure key and signature from the response
          // Perform signup with the Cardano wallet details
          const result = await signupWithCardano(
            addresses[0],
            networkID,
            key,
            signature
          );
          if (result.success) {
            setSuccess(true); // Set success status to true
            setErrorMessage(""); // Clear error message
            router.push("/login"); // Navigate to login page
          } else {
            setErrorMessage(result.error || "Signup failed"); // Set error message if signup fails
            setSuccess(false); // Set success status to false
          }
        }
      } catch (error) {
        console.error("Error signing message:", error); // Log any errors that occur during message signing
        setErrorMessage("Error signing message"); // Set error message for signing error
        setSuccess(false); // Set success status to false
      }
    } else {
      setErrorMessage("Wallet not connected"); // Set error message if wallet is not connected
    }
  }

  // Function to handle email signup
  async function handleEmailSignup() {
    try {
      // Perform signup with email and password
      const result = await signupWithMail(email, password);
      if (result.success) {
        setSuccess(true); // Set success status to true
        setErrorMessage(""); // Clear error message
        router.push("/login"); // Navigate to login page
      } else {
        setErrorMessage(result.error || "Signup failed"); // Set error message if signup fails
        setSuccess(false); // Set success status to false
      }
    } catch (error) {
      console.error("Email signup failed:", error); // Log any errors that occur during email signup
      setErrorMessage("Email signup failed"); // Set error message for email signup failure
      setSuccess(false); // Set success status to false
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      {wallets ? (
        <WalletConnectButton onAssetSelect={handleAssetSignup} />
      ) : (
        <p className="text-center text-xl mt-4">no wallets available</p>
      )}
      {/* Button to connect the wallet */}
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
        <>
          <div className="w-full max-w-sm mt-4 p-4 bg-gray-800 rounded shadow-md">
            <button
              onClick={() => handleCardanoSignup()}
              className="w-full p-2 mb-2 font-semibold text-white bg-green-500 rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Signup with Wallet
            </button>
          </div>
        </>
      ) : (
        <h1 className="text-center text-xl mt-4">
          Connect your wallet to signup
        </h1>
      )}
      {errorMessage && ( // Display error message if present
        <div className="w-full max-w-sm mt-4 p-2 bg-red-500 text-white text-center rounded">
          {errorMessage}
        </div>
      )}
      {success && ( // Display success message if signup is successful
        <div className="w-full max-w-sm mt-4 p-2 bg-green-500 text-white text-center rounded">
          Signup Successful
        </div>
      )}
    </div>
  );
}
