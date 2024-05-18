"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useWallet } from "littlefish-nft-auth-framework-beta/frontend";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
      {isClient && wallets.length > 0 ? (
        // Display wallet options if client is connected and wallets are available
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <img src="findthefish.png" className="mx-auto h-16 w-16" />{" "}
            {/* Logo image */}
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome
            </h1>{" "}
            {/* Welcome heading */}
            <p className="text-sm text-muted-foreground">
              Please choose a wallet
            </p>{" "}
            {/* Instruction text */}
          </div>
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
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              {/* Loader icon if loading */}
              disconnect {connectedWalletId} {/* Display connected wallet ID */}
            </button>
          ) : (
            // Display connect button for each available wallet if not connected
            wallets.map((wallet: string) => (
              <button
                type="submit"
                className={cn(buttonVariants())} // Apply button styling
                disabled={isLoading} // Disable button if loading
                onClick={() => {
                  connectWallet(wallet); // Connect wallet on click
                }}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                {/* Loader icon if loading */}
                Connect {wallet} {/* Display wallet name */}
              </button>
            ))
          )}
        </div>
      ) : (
        // Display message if no wallets are available
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <img src="findthefish.png" className="mx-auto h-16 w-16" />{" "}
            {/* Logo image */}
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome
            </h1>{" "}
            {/* Welcome heading */}
            <p className="text-sm text-muted-foreground">
              You do not have any wallet available
            </p>{" "}
            {/* Message indicating no wallets available */}
          </div>
        </div>
      )}
    </div>
  );
}
