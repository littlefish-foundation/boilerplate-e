import React, { useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import "../../App.css";
const { useWallet } = require("littlefish-nft-auth-framework") as any;

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Assets() {
  const [policyID, setPolicyID] = useState<string>("");
  const [assetName, setAssetName] = useState<string>("");
  const { assets, isConnected, connectWallet, disconnectWallet, getWallets } = useWallet();
  const [walletList, setWalletList] = useState<string[]>([]);

  useEffect(() => {
    const initialWallets = getWallets(); // Fetch wallets as soon as the component mounts
    setWalletList(initialWallets);
  }, []);

  return (
    <div className="bg-white">
      <div className="absolute inset-y-0 right-0 text-left">
        {!isConnected ? (
          <Menu as="div" className="mt-1">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                Connect Wallet
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {walletList.map((wallet, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                          onClick={() =>
                            connectWallet(wallet)}
                        >
                          {wallet}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <Menu as="div" className="mt-1">
            <div>
              <button
                onClick={() => disconnectWallet()}
                className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              >
                Disconnect Wallet
              </button>
            </div>
          </Menu>
        )}
      </div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {!isConnected ? (
            <h2>No Assets Found</h2>
          ) : (
            <div>
              <h1>Wallet Assets</h1>
              <div>
                {assets.map((item: [string, string, number], index: number) => (
                  <pre key={index}>
                    PolicyID: {item[0]}, Name: {item[1]}, Amount: {item[2]}
                  </pre>
                ))}
              </div>
            </div>
          )}
        </h2>
        <div className="mt-6"></div>
      </div>
    </div>
  );
}
