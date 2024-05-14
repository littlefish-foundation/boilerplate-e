"use client";
import { loginWithMail, loginWithCardano, generateNonce} from "./loginActions";
import { useWallet } from "littlefish-nft-auth-framework-beta";
import { signMessage } from "littlefish-nft-auth-framework-beta/frontend";
import { useState } from "react";
import { string } from "zod";

async function handleSign(walletID: string, isConnected: boolean, walletAddress: string): Promise<[string, string] | void> {
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
  } = useWallet();
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    async function handleCardanologin() {
      let key: string;
      let signature: string;
      if (connectedWalletId) {
        try {
          const signResponse = await handleSign(connectedWalletId, isConnected, addresses[0]);
          if (signResponse) {
            [key, signature] = signResponse;
            loginWithCardano(connectedWalletId, isConnected, addresses[0], networkID, key, signature);
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
      <button onClick={handleEmaillogin}>login with Email</button>
        {isConnected ? (
          <div>
            <button onClick={() => handleCardanologin()}>login with Wallet</button>
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