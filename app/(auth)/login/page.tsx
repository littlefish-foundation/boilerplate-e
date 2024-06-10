"use client";
import { loginWithMail, loginWithCardano, generateNonce } from "./loginActions";
import {
  Wallet,
  signMessage,
  useWallet,
  Asset,
} from "littlefish-nft-auth-framework/frontend";
import { useEffect, useState } from "react";
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

// React component for the login page
export default function LoginPage() {
  const {
    isConnected,
    connectedWalletId,
    connectWallet,
    disconnectWallet,
    networkID,
    addresses,
    wallets,
    assets,
    decodeHexToAscii,
  } = useWallet(); // Destructure wallet connection status and details
  const router = useRouter(); // Initialize router for navigation
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [success, setSuccess] = useState(false); // State for success status
  const [decodedAssets, setDecodedAssets] = useState<Asset[]>([]); // State for decoded assets

  useEffect(() => {
    if (assets.length > 0) {
      setDecodedAssets(decodeHexToAscii(assets));
      console.log("Decoded assets:", decodedAssets);
    }
  }, [isConnected]);

  // Function to handle login with Cardano wallet
  async function handleCardanoLogin(asset?: Asset) {
    if (connectedWalletId !== null) {
      try {
        // Sign the message using the wallet
        const signResponse = await handleSign(
          connectedWalletId,
          isConnected,
          addresses[0]
        );
        if (signResponse) {
          const [key, signature] = signResponse; // Destructure key and signature from the response
          // Perform login with the Cardano wallet details
          let result;
          if (asset) {
            result = await loginWithCardano(
              addresses[0],
              networkID,
              key,
              signature,
              asset
            );
          } else {
            result = await loginWithCardano(
              addresses[0],
              networkID,
              key,
              signature
            );
          }
          if (result.success) {
            setSuccess(true); // Set success status to true
            setErrorMessage(""); // Clear error message
            router.push("/assets"); // Navigate to assets page
          } else {
            setErrorMessage(result.error || "Login failed"); // Set error message if login fails
            setSuccess(false); // Set success status to false
          }
        }
      } catch (error) {
        console.error("Failed to handle Cardano login:", error); // Log any errors that occur during Cardano login
        setErrorMessage("Failed to handle Cardano login"); // Set error message for Cardano login failure
        setSuccess(false); // Set success status to false
      }
    }
  }

  // Function to handle login with email and password
  async function handleEmailLogin() {
    try {
      // Perform login with email and password
      const result = await loginWithMail(email, password);
      if (result.success) {
        setSuccess(true); // Set success status to true
        setErrorMessage(""); // Clear error message
        router.push("/assets"); // Navigate to assets page
      } else {
        setErrorMessage(result.error || "Login failed"); // Set error message if login fails
        setSuccess(false); // Set success status to false
      }
    } catch (error) {
      console.error("Email login failed:", error); // Log any errors that occur during email login
      setErrorMessage("Email login failed"); // Set error message for email login failure
      setSuccess(false); // Set success status to false
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
        <>
          <div className="w-full max-w-sm mt-4 p-4 bg-gray-800 rounded shadow-md">
            <button
              onClick={() => handleCardanoLogin()}
              className="w-full p-2 mb-2 font-semibold text-white bg-green-500 rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Login with Wallet
            </button>
            <p className="mb-2 text-gray-300">
              Connected Wallet:{" "}
              {connectedWalletId === "typhoncip30"
                ? "Typhon"
                : connectedWalletId}
            </p>
            <button
              onClick={disconnectWallet}
              className="w-full p-2 font-semibold text-white bg-red-500 rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Disconnect Wallet
            </button>
          </div>
          <div className="w-full max-w-sm mt-4 p-4 bg-gray-800 rounded shadow-md">
            <p>Login with Asset</p>
            {assets.length > 0 && decodedAssets.length > 0 && assets.map((asset, index) => (
              <div className="flex items-center justify-between p-2 mb-2 bg-gray-700 rounded">
                <button
                  onClick={() => handleCardanoLogin(asset)}
                  className="text-white"
                >
                  {decodedAssets[index].assetName}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        wallets.map((wallet: Wallet) => (
          <button
            key={wallet.name}
            type="submit"
            onClick={() => {
              connectWallet(wallet.name);
            }}
            className="w-full max-w-sm p-2 mt-2 font-semibold text-white bg-indigo-500 rounded shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <img src={wallet.icon} className="mr-2 w-10 float-right" />
            <span className="mr-2 w-30 float-left ml-5">
              Connect {wallet.name === "typhoncip30" ? "Typhon" : wallet.name}
            </span>
          </button>
        ))
      )}
      {errorMessage && ( // Display error message if present
        <div className="w-full max-w-sm mt-4 p-2 bg-red-500 text-white text-center rounded">
          {errorMessage}
        </div>
      )}
      {success && ( // Display success message if login is successful
        <div className="w-full max-w-sm mt-4 p-2 bg-green-500 text-white text-center rounded">
          Login Successful
        </div>
      )}
    </div>
  );
}
