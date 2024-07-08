"use server";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { validateEmail, hashPassword, validatePassword } from "littlefish-nft-auth-framework/backend";
import { Asset } from "littlefish-nft-auth-framework/frontend";
import { signIn } from "@/auth";
import { User } from "next-auth";

// Declare a variable to store the nonce
let nonce: string;

// Function to generate a nonce using random bytes
export async function generateNonce(): Promise<string | void> {
  // Generate a random 16-byte string and convert it to hexadecimal
  nonce = randomBytes(16).toString("hex");
  // Return the generated nonce
  return nonce;
}

// Function to handle login with email and password
export async function loginWithMail(email: string, password: string): Promise<{ success?: boolean; error?: string }> {
  const requestBody = {
    email,
    password
  };

  try {

    const result = await signIn("credentials", { ...requestBody, redirectTo: "/" });
    console.log("result", result);
    return result;
  } catch (error) {
    return { error: "Failed to Login With Email" };
  }
}

export async function loginWithAsset(walletAddress: string, walletNetwork: number, key: string, signature: string, asset: Asset): Promise<{ success?: boolean; error?: string }> {
  // Create a JSON request body with the wallet details and nonce
  const requestBody = {
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
    policyID: asset.policyID,
    assetName: asset.assetName,
    amount: asset.amount,
  };
  try {
    const result = await signIn("credentials", { ...requestBody, redirectTo: "/" });
    console.log("result", result);
    return result;
  } catch (error) {
    return { error: "Failed to Login With Asset" };
  }
}

// Function to handle login with Cardano wallet details
export async function loginWithCardano(walletAddress: string, walletNetwork: number, key: string, signature: string): Promise<{ success?: boolean; error?: string }> {
  // Create a JSON request body with the wallet details and nonce
  const requestBody = {
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
  };
  try {
    const result = await signIn("credentials", { ...requestBody, redirectTo: "/" });
    console.log("result", result);
    return result;
  } catch (error) {
    return { error: "Failed to Login With Wallet, If you signed up with asset, please try logging in with asset" };
  }
}
