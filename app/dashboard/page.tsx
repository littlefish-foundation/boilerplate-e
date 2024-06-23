

"use client";
import React, { useState, useEffect } from "react";

import TextShimmer from "@/components/magicui/animated-shiny-text";
import Link from 'next/link';
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Asset, useWallet } from "littlefish-nft-auth-framework/frontend";
import CardanoBalance from "@/components/nft-auth/CardanoBalance";
import CardanoPrice from "@/components/nft-auth/CardanoPrice";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

interface CardanoBalanceProps {
  balance: number;
}




export default function DashboardPage() {
  const { balance, assets, isConnected, decodeHexToAscii } = useWallet(); // Destructure wallet assets, connection status, and decoding function from useWallet hook
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]); // State for storing decoded wallet assets

  const features = [
    {
      Icon: FileTextIcon,
      name: "Save your files",
      description: "We automatically save your files as you type.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: InputIcon,
      name: "Total ADA in your wallet:",
      description: "Search through all your files in one place.",
      href: "/",
      cta: "Learn more",
      background: <CardanoBalance text={balance} />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: GlobeIcon,
      name: "Multilingual",
      description: "Supports 100+ languages and counting.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: CalendarIcon,
      name: "ADA Price",
      description: "ADA Price",
      href: "/",
      cta: "Learn more",
      background: <CardanoPrice/>,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: BellIcon,
      name: "Notifications",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute -right-20 -top-20 opacity-60" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];

  useEffect(() => {
    try {
      if (assets && Array.isArray(assets)) {
        // Decode the assets from hex to ASCII if assets array is available
        const decodedAssets = decodeHexToAscii(assets);
        // Update the walletAssets state with the decoded assets
        setWalletAssets(decodedAssets);
      }
    } catch (error) {
      console.error("Failed to decode assets:", error); // Log any errors that occur during decoding
    }
  }, [assets]); // Effect runs whenever the assets array changes

  /*
   // Render the assets if the wallet is connected
    
   <CardanoBalance text={balance} />
   */

  return isConnected ? (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
    <BentoGrid className="lg:grid-rows-3">
    {features.map((feature) => (
      <BentoCard key={feature.name} {...feature} />
    ))}
  </BentoGrid>
  </div>
  ) : (
    
    <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
    <div className="flex flex-col gap-2 text-center">
      <img
        className="mx-auto"
        src="/findthefish.png"
        width={128}
        height={128}
        alt="littlefish logo"
      />
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Welcome
      </h1> {/* Welcome heading */}
      <p className="text-sm text-muted-foreground">
        You do not have any wallet available
      </p>{" "}
      {/* Message indicating no wallets available */}
    </div>
    <div className="flex flex-col gap-2 text-center">
      <Link href="https://welcome.dexhunter.io/#wallet" passHref>
        <TextShimmer className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>✨ Obtain a Cardano Wallet</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </TextShimmer>
      </Link>
    </div>
  </div>
  );

  
}

