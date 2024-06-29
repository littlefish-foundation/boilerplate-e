

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

import { DexHunter } from "@/components/nft-auth/DexHunter";

import Swap from '@dexhunterio/swaps'
import '@dexhunterio/swaps/lib/assets/style.css'

interface CardanoBalanceProps {
  balance: number;
}

import type { SVGProps } from 'react';

export function FormkitCardano(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props}><path fill="currentColor" fillRule="evenodd" d="M8.34 2.03c.16-.31-.21-.68-.52-.52c-.25.1-.31.46-.12.65c.18.19.54.12.63-.13Zm-3.4.14c.02-.2-.22-.38-.4-.3c-.26.07-.29.48-.04.58c.19.11.46-.06.44-.28m6.32.29c-.29-.04-.34-.5-.06-.59c.22-.11.41.09.45.3c-.05.18-.19.34-.39.29M5.99 3.75c.05-.36-.39-.66-.7-.46c-.29.15-.33.6-.07.79c.27.25.76.04.77-.33m4.03-.25c.14-.36.7-.37.86-.02c.16.27-.04.61-.31.7c-.37.07-.72-.33-.54-.68ZM8 3.6c-.29.02-.57.25-.57.56c-.02.25.16.46.37.56h.06c.12.01.24.02.35-.04c.28-.12.42-.5.26-.77c-.08-.2-.29-.28-.49-.32ZM2.55 4.61c.28-.18.66.15.56.46c-.06.27-.42.38-.62.21c-.22-.16-.18-.55.06-.66Zm11.09.33c.03-.31-.37-.52-.61-.33c-.25.15-.22.56.04.68c.24.14.58-.07.56-.35Zm-4.84.22c.4-.14.87.03 1.09.39c.3.44.14 1.1-.32 1.35c-.48.3-1.18.05-1.36-.5c-.2-.48.09-1.09.59-1.24m-1.08.47c-.21-.45-.8-.63-1.24-.42c-.47.21-.68.83-.44 1.29c.22.47.85.67 1.29.41c.45-.23.64-.84.39-1.29Zm-3.57.38c.03-.29.3-.47.57-.49c.29.04.52.26.55.56c-.02.29-.24.58-.55.58c-.34.03-.64-.31-.57-.65m7.69.07c.02-.4-.47-.7-.82-.5c-.37.18-.4.77-.04.98c.35.25.88-.05.86-.48M5.53 7.09c.41-.11.87.08 1.07.46c.22.38.13.91-.21 1.19c-.44.41-1.24.24-1.47-.31c-.27-.51.06-1.2.61-1.33Zm5.48.4c-.21-.36-.68-.52-1.07-.4c-.56.15-.85.87-.56 1.37c.24.49.92.65 1.36.34c.42-.27.55-.89.27-1.31m-8.1.07c.35-.13.74.26.6.61c-.09.32-.53.44-.77.2c-.27-.22-.17-.72.17-.81m10.03-.06c-.3.02-.51.28-.5.57c.06.14.13.28.27.35c.29.16.71-.07.69-.42c.02-.26-.22-.46-.46-.5m-11.76.23c.21-.09.47.09.42.33c-.01.27-.4.37-.55.15c-.13-.16-.05-.4.12-.48Zm13.78.14c-.06-.18-.3-.25-.45-.15c-.25.13-.15.6.15.57c.21.03.4-.23.3-.42M6.67 9.01c.56-.15 1.15.32 1.16.9c.04.59-.55 1.1-1.12.97a.95.95 0 0 1-.77-.95c0-.43.32-.83.74-.92Zm3.38.91c0-.59-.61-1.07-1.17-.91c-.33.08-.62.36-.69.71c-.15.51.24 1.1.77 1.17c.56.11 1.13-.39 1.1-.96Zm-5.42-.55c.39-.07.76.37.6.75c-.12.4-.69.51-.95.18c-.3-.31-.08-.89.35-.93m7.21.56c.03-.38-.4-.69-.75-.54c-.42.14-.49.78-.11 1c.34.25.87-.04.86-.47Zm1.06 1.29c-.14-.26.11-.6.39-.55c.13 0 .23.1.31.19v.02l.02.03c.02.15.04.31-.08.43c-.17.22-.55.16-.65-.1Zm-9.77-.08c.06-.31-.32-.58-.58-.4c-.25.13-.26.53-.02.68c.23.16.57 0 .6-.28m4.63.18c.35-.15.79.15.75.53c.03.42-.52.72-.86.46c-.38-.22-.31-.86.1-1Zm-1.75 1.02c.03-.33-.37-.6-.66-.45c-.21.08-.29.31-.3.52c.07.19.22.39.44.4c.27.04.53-.19.52-.47m4.23-.44c.3-.19.73.08.7.44c0 .37-.48.61-.76.37c-.27-.19-.24-.65.06-.8Zm1.09 1.62c-.22.05-.38.29-.24.5c.14.24.54.15.57-.13c.04-.21-.15-.34-.32-.38Zm-7 .32c.05-.16.18-.33.37-.28c.28.02.36.44.12.57c-.22.15-.47-.05-.49-.29m3.83-.04c-.2-.13-.51-.01-.57.23c-.1.24.14.54.39.51c.14 0 .25-.1.33-.2c.02-.07.03-.13.05-.2c-.03-.13-.07-.28-.21-.34Z"></path></svg>);
}



export default function DashboardPage() {
  const { balance, assets, isConnected, decodeHexToAscii,connectedWallet } = useWallet(); // Destructure wallet assets, connection status, and decoding function from useWallet hook
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
      Icon: FormkitCardano,
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
      background: <DexHunter wallet={"eternl"}/>,
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

