"use client";
import {
  signupWithMail,
  signupWithCardano,
  generateNonce,
} from "./signupActions";
import {
  signMessage,
  WalletConnectButton,
  useWallet,
} from "littlefish-nft-auth-framework-beta/frontend";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "react-hook-form";
import { ChevronLeft, Link } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserAuthForm } from "@/components/nft-auth/user-auth-form";

// Function to handle message signing for Cardano wallet
async function handleSign(
  walletID: string,
  isConnected: boolean,
  walletAddress: string
): Promise<[string, string] | void> {
  // Generate a nonce for the signing process
  const nonceResponse = await generateNonce();
  if (!nonceResponse) {
    console.error("Failed to generate nonce"); // Log error if nonce generation fails
    return;
  }

  const nonce = nonceResponse; // Store the generated nonce

  try {
    // Sign the nonce with the wallet
    const signResponse = await signMessage(
      walletID,
      isConnected,
      nonce,
      walletAddress
    );
    if (!signResponse) {
      console.error("Failed to sign message"); // Log error if message signing fails
      return;
    }
    const [key, signature] = signResponse; // Destructure key and signature from the response
    return [key, signature]; // Return the key and signature
  } catch (error) {
    console.error("Error signing message:", error); // Log any errors that occur during message signing
  }
}

// React component for the signup page
export default function SignUpPage() {
  const { isConnected, connectedWalletId, networkID, addresses } = useWallet(); // Destructure wallet connection status and details
  const router = useRouter(); // Initialize router for navigation
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [success, setSuccess] = useState(false); // State for success status

  // Function to handle Cardano wallet signup
  async function handleCardanoSignup() {
    if (connectedWalletId !== null) {
      try {
        // Sign the message using the wallet
        // The address comes as an array of length 1 usually from the wallet, so we use the first address
        const signResponse = await handleSign(
          connectedWalletId,
          isConnected,
          addresses[0]
        );
        if (signResponse) {
          const [key, signature] = signResponse; // Destructure key and signature from the response
          // Perform signup with the Cardano wallet details
          const result = await signupWithCardano(
            connectedWalletId,
            isConnected,
            addresses[0],
            networkID,
            key,
            signature
          );
          if (result.success) {
            setSuccess(true); // Set success status to true
            setErrorMessage(""); // Clear error message
            router.push("/login"); // Navigate to login page
          } else {
            setErrorMessage(result.error || "Signup failed"); // Set error message if signup fails
            setSuccess(false); // Set success status to false
          }
        }
      } catch (error) {
        console.error("Error signing message:", error); // Log any errors that occur during message signing
        setErrorMessage("Error signing message"); // Set error message for signing error
        setSuccess(false); // Set success status to false
      }
    } else {
      setErrorMessage("Wallet not connected"); // Set error message if wallet is not connected
    }
  }

  // Function to handle email signup
  async function handleEmailSignup() {
    try {
      // Perform signup with email and password
      const result = await signupWithMail(email, password);
      if (result.success) {
        setSuccess(true); // Set success status to true
        setErrorMessage(""); // Clear error message
        router.push("/login"); // Navigate to login page
      } else {
        setErrorMessage(result.error || "Signup failed"); // Set error message if signup fails
        setSuccess(false); // Set success status to false
      }
    } catch (error) {
      console.error("Email signup failed:", error); // Log any errors that occur during email signup
      setErrorMessage("Email signup failed"); // Set error message for email signup failure
      setSuccess(false); // Set success status to false
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
        <div className="flex flex-col gap-2 text-center">
          {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
          <Image
            className="mx-auto "
            src="/findthefish.png"
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
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
