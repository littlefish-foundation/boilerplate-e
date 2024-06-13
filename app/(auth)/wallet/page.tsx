"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import TextShimmer from "@/components/magicui/animated-shiny-text";
import Link from 'next/link';

// Define the LoginPage component
export default function LoginPage() {
  const router = useRouter(); // Initialize router for navigation
  const {
    isConnected,
    connectWallet,
    disconnectWallet,
    wallets,
    connectedWalletId,
    isClient,
  } = useWallet(); // Destructure wallet connection status and details from useWallet hook
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // State for loading status

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <button
        onClick={() => router.back()} // Use router.back to navigate to the previous page
        className={cn(
          buttonVariants({ variant: "ghost" }), // Apply ghost variant styling to the button
          "absolute left-4 top-4 md:left-8 md:top-8 flex items-center"
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />{" "}
        {/* ChevronLeft icon for back button */}
        Back
      </button>
      {isClient && wallets && wallets.length > 0 ? (
        // Display wallet options if client is connected and wallets are available
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            <img
              className="mx-auto"
              src="/findtheblackfish.png"
              width={128}
              height={128}
              alt="littlefish logo"
            />
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Hey littlefish!
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign up for an account
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                WEB2
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            To be filled later with login form
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                WEB3
              </span>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-2 gap-4 sm:w-[350px]">
            {isConnected ? (
              // Display disconnect button if a wallet is connected
              <button
                type="submit"
                className={cn(buttonVariants())} // Apply button styling
                disabled={isLoading} // Disable button if loading
                onClick={() => {
                  disconnectWallet(); // Disconnect wallet on click
                }}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon if loading */}
                <div className="group relative flex items-center">
                      <img
                        src={wallets.find((wallet) => wallet.name === connectedWalletId)?.icon}
                        alt={connectedWalletId || 'default-alt-text'}
                        className={`mr-2 h-4 w-4 transition-filter duration-100 group-hover:grayscale-0 ${
                          wallets.find((wallet) => wallet.name !== connectedWalletId) ? "grayscale" : ""
                        }`} // Corrected condition
                      />
                      <span>
                      {connectedWalletId}
                      </span>
                    </div>
              </button>
            ) : (
              // Display connect button for each available wallet if not connected
              wallets.map((wallet) => {
                // Update the wallet name if it is "Typhoncip30"
                let displayName = "";
                console.log(wallet.name);
                wallet.name === "typhoncip30" ? displayName = "Typhon" : displayName = wallet.name;
                return (
                  <button
                    key={wallet.name}
                    type="submit"
                    className={cn(buttonVariants({ variant: "outline" }))} // Apply button styling
                    disabled={isLoading} // Disable button if loading
                    onClick={() => {
                      setIsLoading(true);
                      connectWallet(wallet.name); // Connect wallet on click
                      setIsLoading(false);
                    }}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Loader icon if loading */}
                    <div className="group relative flex items-center">
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className={`mr-2 h-4 w-4 transition-filter duration-100 group-hover:grayscale-0 ${
                          wallet.name !== connectedWalletId ? "grayscale" : ""
                        }`} // Corrected condition
                      />
                      <span>
                       {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        // Display message if no wallets are available
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
      )}
    </div>
  );
}
