"use client"
import { signupWithMail, signupWithCardano, generateNonce } from "./signupActions";
import { signMessage } from "littlefish-nft-auth-framework-beta/frontend";
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
  const { isConnected, connectedWalletId, connectWallet, disconnectWallet, networkID, addresses } = useWallet();
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
    <div>
      <form>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <button onClick={handleEmailSignup}>Signup with Email</button>
      {isConnected ? (
        <div>
          <button onClick={handleCardanoSignup}>Signup with Wallet</button>
          <p>Connected Wallet: {connectedWalletId}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={() => connectWallet("nami")}>Connect Wallet</button>
      )}
    </div>
  );
}
