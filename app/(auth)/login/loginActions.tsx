"use server";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { validateEmail, hashPassword, validatePassword } from "littlefish-nft-auth-framework-beta/backend";

let nonce: string;

export async function generateNonce(): Promise<string | void> {
  nonce = randomBytes(16).toString("hex");
  return nonce;
}

export async function loginWithMail(email: string, password: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const validEmail = validateEmail(email);
    if (!validEmail) {
      return { error: "Invalid Email format" };
    }
    const validPassword = validatePassword(password);
    if (!validPassword) {
      return { error: "Weak Password" };
    }
    const hashedPassword = hashPassword(password);
    const requestBody = JSON.stringify({ email, password: hashedPassword });

    const response = await fetch(`${process.env.ROOT_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to login with response:", errorText);
      return { error: `Error: ${response.statusText}` };
    }

    const json = await response.json();
    cookies().set("Authorization", json.token, {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      path: "/",
      sameSite: "strict",
    });

    return { success: true };
  } catch (error) {
    console.error("Login action failed:", error);
    return { error: "Login action failed" };
  }
}

export async function loginWithCardano(walletID: string, isConnected: boolean, walletAddress: string, walletNetwork: number, key: string, signature: string): Promise<{ success?: boolean; error?: string }> {
  const requestBody = JSON.stringify({
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
  });

  try {
    const response = await fetch(`${process.env.ROOT_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to login with response:", errorText);
      return { error: `Error: ${response.statusText}` };
    }

    const json = await response.json();
    cookies().set("Authorization", json.token, {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      path: "/",
      sameSite: "strict",
    });

    return { success: true };
  } catch (error) {
    console.error("Login action failed:", error);
    return { error: "Login action failed" };
  }
}
