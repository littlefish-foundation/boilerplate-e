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
    addresses,
  } = useWallet();
  const networkID = 1;
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for the blockchain form
    const [walletAddress, setWalletAddress] = useState('');
    const [key, setKey] = useState('');
    const [signature, setSignature] = useState('');

    function handleCardanoSignup() {
      if (connectedWalletId !== null) {
        signupWithCardano(connectedWalletId, isConnected, addresses[0], networkID);
      }
      //console.log(signMessage(connectedWalletId, isConnected, addresses[0], networkID));
    }
    function handleEmailSignup() {
      signupWithMail(email, password);
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
            <button onClick={() => handleCardanoSignup()}>Signup with Wallet</button>
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