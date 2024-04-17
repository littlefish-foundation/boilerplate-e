"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useWallet } from "littlefish-nft-auth-framework";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const {
    isConnected,
    connectWallet,
    disconnectWallet,
    wallets,
    connectedWalletId,
  } = useWallet();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <button // Changed from Link to button for semantic correctness
        onClick={() => router.back()} // Use router.back to navigate to the previous page
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8 flex items-center"
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </button>
      {wallets.length > 0 ? (
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <img src="logo2.png" className="mx-auto h-16 w-16" />
            <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
            <p className="text-sm text-muted-foreground">
              Please choose a wallet
            </p>
          </div>
          {isConnected ? (
            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading}
              onClick={() => {
                disconnectWallet();
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              disconnect {connectedWalletId}
            </button>
          ) : (
            wallets.map((wallet: string) => (
              <button
                type="submit"
                className={cn(buttonVariants())}
                disabled={isLoading}
                onClick={() => {
                  connectWallet(wallet);
                }}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect {wallet}
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <img src="logo2.png" className="mx-auto h-16 w-16" />
            <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
            <p className="text-sm text-muted-foreground">
              You do not have any wallet available
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
