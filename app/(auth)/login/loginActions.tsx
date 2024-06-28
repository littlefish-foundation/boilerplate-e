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
  try {
    // Validate the provided email format
    const validEmail = validateEmail(email);
    if (!validEmail) {
      // Return an error if the email format is invalid
      return { error: "Invalid Email format" };
    }

    // Validate the provided password strength
    const validPassword = validatePassword(password);
    if (!validPassword) {
      // Return an error if the password is weak
      return { error: "Weak Password" };
    }

    // Hash the provided password
    // Create a JSON request body with the email and hashed password
    const requestBody = JSON.stringify({ email, password });

    // Send a POST request to the login API with the request body
    const response = await fetch(`${process.env.ROOT_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    // Check if the response is not OK (i.e., an error occurred)
    if (!response.ok) {
      // Read the response as text to see what went wrong
      const errorText = await response.text();
      console.error("Failed to login with response:", errorText);
      // Return a general error message
      return { error: `Error: ${response.statusText}` };
    }

    // Parse the JSON response
    const json = await response.json();
    // Set an authorization cookie with the token from the response
    cookies().set("Authorization", json.token, {
      secure: true, // Ensure the cookie is only sent over HTTPS
      httpOnly: true, // Ensure the cookie is not accessible via JavaScript
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Set the cookie to expire in 7 days
      path: "/", // Set the cookie path to the root
      sameSite: "strict", // Ensure the cookie is sent only with same-site requests
    });

    // Return success if the login was successful
    return { success: true };
  } catch (error) {
    console.error("Login action failed:", error); // Log any errors that occur during the request
    // Return a general error message
    return { error: "Login action failed" };
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
    asset,
  };

  const result = await signIn("credentials",{ ...requestBody, redirectTo: "/assets"});
  console.log(typeof(result))
  return result;
}

// Function to handle login with Cardano wallet details
export async function loginWithCardano(walletAddress: string, walletNetwork: number, key: string, signature: string): Promise<User> {
  // Create a JSON request body with the wallet details and nonce
  const requestBody = {
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
  };

  const result = await signIn("credentials",{ ...requestBody, redirectTo: "/assets"});
  console.log(typeof(result))
  return result;
}
