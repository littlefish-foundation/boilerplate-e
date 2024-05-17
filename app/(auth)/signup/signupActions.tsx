"use server";
import { randomBytes } from "crypto";
import { validateEmail, hashPassword, validatePassword } from "littlefish-nft-auth-framework-beta/backend";

// Declare a variable to store the nonce
let nonce: string;

// Function to generate a nonce using random bytes
export async function generateNonce(): Promise<string | void> {
  // Generate a random 16-byte string and convert it to hexadecimal
  nonce = randomBytes(16).toString("hex");
  return nonce;
}

// Function to handle signup with email and password
export async function signupWithMail(email: string, password: string): Promise<{ success?: boolean; error?: string }> {
  // Validate the provided email format
  const validEmail = validateEmail(email);
  if (!validEmail) {
    return { error: "Invalid Email format" };
  }

  // Validate the provided password strength
  const validPassword = validatePassword(password);
  if (!validPassword) {
    return { error: "Password weak" };
  }

  // Hash the provided password
  password = hashPassword(password);
  // Create a JSON request body with the email and hashed password
  const requestBody = JSON.stringify({ email: email, password: password });

  try {
    // Send a POST request to the signup API with the request body
    const response = await fetch(`${process.env.ROOT_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    // Check if the response is not OK (i.e., an error occurred)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to signup with response:", errorText);
      if (errorText.includes("existingUser")) {
        // Return a specific error if the user already exists
        return { error: "User already exists" };
      }
      // Return a general error message
      return { error: `Error: ${errorText}` };
    }

    // Return success if the signup was successful
    return { success: true };
  } catch (error) {
    console.error("Signup action failed:", error); // Log any errors that occur during the request
    // Return a general error message
    return { error: "Signup action failed" };
  }
}

// Function to handle signup with Cardano wallet details
export async function signupWithCardano(walletID: string, isConnected: boolean, walletAddress: string, walletNetwork: number, key: string, signature: string): Promise<{ success?: boolean; error?: string }> {
  // Create a JSON request body with the wallet details and nonce
  const requestBody = JSON.stringify({
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
  });

  try {
    // Send a POST request to the signup API with the request body
    const response = await fetch(`${process.env.ROOT_URL}/api/signup`, {
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
      console.error("Failed to signup with response:", errorText);
      if (errorText.includes("existingUser")) {
        // Return a specific error if the user already exists
        return { error: "User already exists" };
      }
      // Return a general error message
      return { error: `Error: ${response.statusText}` };
    }

    // Return success if the signup was successful
    return { success: true };
  } catch (error) {
    console.error("Signup action failed:", error);
    // Return a general error message
    return { error: "Signup action failed" };
  }
}
