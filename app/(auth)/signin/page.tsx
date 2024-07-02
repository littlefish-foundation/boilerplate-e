"use client";
import { useWallet, signMessage } from "littlefish-nft-auth-framework/frontend";
import { generateNonce } from "littlefish-nft-auth-framework/backend";
import { signIn } from "@/auth";

export default function LoginPage() {
  const { isConnected, connectedWallet, connectWallet, disconnectWallet, networkID, addresses, assets, wallets, decodeHexToAscii } = useWallet();
  console.log("isConnected", isConnected);
  const nonce = generateNonce();


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        <div className="mb-4">
          {!isConnected ? (wallets.map(
            (wallet) => {
              return (
                <button className="block text-gray-700 text-sm font-bold mb-2" onClick={() => connectWallet(wallet)}>
                  Connect {wallet.name}
                </button>
              );
            }

          )) : <>
            <button className="block text-gray-700 text-sm font-bold mb-2" onClick={() => disconnectWallet()}>
              Disconnect
            </button>
            <button className="block text-gray-700 text-sm font-bold mb-2" onClick={() => signMessage(connectedWallet.name, isConnected, nonce, addresses[0])}>
            Signin with {connectedWallet?.name}
          </button>
        </>}
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Username"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="******************"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign In
        </button>
        <a
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          href="#"
        >
          Forgot Password?
        </a>
      </div>
    </div>
    </div >
  );

}
