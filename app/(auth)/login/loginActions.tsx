"use server";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { validateEmail, hashPassword, validatePassword } from "littlefish-nft-auth-framework/backend";
import { Asset } from "littlefish-nft-auth-framework/frontend";

// Declare a variable to store the nonce
let nonce: string;

// Function to generate a nonce using random bytes
export async function generateNonce(): Promise<string | void> {
  // Generate a random 16-byte string and convert it to hexadecimal
  nonce = randomBytes(16).toString("hex");
  // Return the generated nonce
  return nonce;
}

async function handleLoginResponse(response: Response): Promise<{ success: boolean; error?: string }> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to login with response:", errorText);
    return { success: false, error: `Error: ${errorText}` };
  }

  try {
    const data = await response.json();
    if (data.token) {
      cookies().set('auth-token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60, // 2 hours
        path: '/',
      });
      return { success: true };
    } else {
      return { success: false, error: 'No token received from server' };
    }
  } catch (error) {
    console.error("Failed to parse login response:", error);
    return { success: false, error: 'Failed to parse server response' };
  }
}

// Function to handle login with email and password
export async function loginWithMail(email: string, password: string): Promise<{ success?: boolean; error?: string }> {
  const requestBody = JSON.stringify({ email: email, password: password });

  try {
    // Send a POST request to the signup API with the request body
    const response = await fetch(`${process.env.ROOT_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    // Check if the response is not OK (i.e., an error occurred)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to login with response:", errorText);
      // Return a general error message
      return { error: `Error: ${errorText}` };
    }
    // Return success if the signup was successful
    return handleLoginResponse(response);
  } catch (error) {
    console.error("Signup action failed:", error); // Log any errors that occur during the request
    // Return a general error message
    return { error: "Signup action failed" };
  }
}

export async function loginWithAsset(walletAddress: string, walletNetwork: number, key: string, signature: string, asset: Asset, sso: boolean): Promise<{ success?: boolean; error?: string }> {
  // Create a JSON request body with the wallet details and nonce
  const requestBody = JSON.stringify({
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
    policyID: asset.policyID,
    assetName: asset.assetName,
    amount: asset.amount,
  });

  console.log(requestBody)

  let response;
  if (sso) {
    response = await fetch(`${process.env.ROOT_URL}/api/sso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
  } else {
    response = await fetch(`${process.env.ROOT_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
  }
  if (!response.ok) {
    const errorText = await response.text();
    return { error: `Error: ${errorText}` };
  }
  return handleLoginResponse(response);
}

// Function to handle login with Cardano wallet details
export async function loginWithCardano(walletAddress: string, walletNetwork: number, key: string, signature: string): Promise<{ success?: boolean; error?: string }> {
  // Create a JSON request body with the wallet details and nonce
  const requestBody = JSON.stringify({
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
  });

  const response = await fetch(`${process.env.ROOT_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });
  if (!response.ok) {
    const errorText = await response.text();
    return { error: `Error: ${errorText}` };
  }
  return handleLoginResponse(response);
}