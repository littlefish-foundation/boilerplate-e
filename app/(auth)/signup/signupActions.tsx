"use server";
import { randomBytes } from "crypto";
import { validateEmail, hashPassword, validatePassword } from "littlefish-nft-auth-framework-beta/backend";

let nonce: string;

export async function generateNonce(): Promise<string | void> {
  nonce = randomBytes(16).toString("hex");
  return nonce;
}

export async function signupWithMail(email: string, password: string): Promise<{ success?: boolean; error?: string }> {
  const validEmail = validateEmail(email);
  if (!validEmail) {
    return { error: "Invalid Email format" };
  }
  const validPassword = validatePassword(password);
  if (!validPassword) {
    return { error: "Password weak" };
  }
  password = hashPassword(password);
  const requestBody = JSON.stringify({ email: email, password: password });

  try {
    const response = await fetch(`${process.env.ROOT_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to signup with response:", errorText);
      return { error: `Error: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup action failed:", error);
    return { error: "Signup action failed" };
  }
}

export async function signupWithCardano(walletID: string, isConnected: boolean, walletAddress: string, walletNetwork: number, key: string, signature: string): Promise<{ success?: boolean; error?: string }> {
  const requestBody = JSON.stringify({
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
  });

  try {
    const response = await fetch(`${process.env.ROOT_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to signup with response:", errorText);
      return { error: `Error: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup action failed:", error);
    return { error: "Signup action failed" };
  }
}
