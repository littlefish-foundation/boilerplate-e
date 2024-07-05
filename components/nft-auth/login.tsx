"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Loader2, LogOut, User } from "lucide-react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import TextShimmer from "@/components/magicui/animated-shiny-text";

interface LoginComponentProps {
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
  onClose?: () => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ 
  onBack, 
  showBackButton = true, 
  className = "",
  onClose
}) => {
  const router = useRouter();
  const {
    isConnected,
    connectWallet,
    disconnectWallet,
    wallets,
    connectedWallet,
    isClient,
  } = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleWalletAction = async (action: () => void | Promise<void>) => {
    setIsLoading(true);
    try {
      await Promise.resolve(action());
    } catch (error) {
      console.error("Wallet action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {showBackButton && (
        <button
          onClick={handleBack}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 md:left-8 md:top-8 flex items-center"
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </button>
      )}
      {isClient && wallets && wallets.length > 0 ? (
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
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
            {(isConnected && connectedWallet) ? (
              <button
                type="submit"
                className={cn(buttonVariants())}
                disabled={isLoading}
                onClick={() => handleWalletAction(disconnectWallet)}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <div className="group relative flex items-center">
                  <img
                    src={wallets.find((wallet) => wallet.name === connectedWallet.name)?.icon}
                    alt={connectedWallet.name || 'default-alt-text'}
                    className={`mr-2 h-4 w-4 transition-filter duration-100 group-hover:grayscale-0 ${
                      wallets.find((wallet) => wallet.name !== connectedWallet.name) ? "grayscale" : ""
                    }`}
                  />
                  <span>
                    {connectedWallet.name}
                  </span>
                </div>
              </button>
            ) : (
              wallets.map((wallet) => {
                let displayName = wallet.name === "typhoncip30" ? "Typhon" : wallet.name;
                return (
                  <button
                    key={wallet.name}
                    type="submit"
                    className={cn(buttonVariants({ variant: "outline" }))}
                    disabled={isLoading}
                    onClick={() => handleWalletAction(() => connectWallet(wallet))}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <div className="group relative flex items-center">
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className={`mr-2 h-4 w-4 transition-filter duration-100 group-hover:grayscale-0 ${
                          wallet.name !== connectedWallet?.name ? "grayscale" : ""
                        }`}
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
            </h1>
            <p className="text-sm text-muted-foreground">
              You do not have any wallet available
            </p>
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
      {onClose && (
        <button 
          onClick={onClose} 
          className={cn(buttonVariants(), "mt-4")}
        >
          Close
        </button>
      )}
    </div>
  );
};

export default LoginComponent;