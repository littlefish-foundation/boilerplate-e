"use server";
import { randomBytes, sign } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

//const { signMessage } = require('littlefish-nft-auth-framework-beta');
let nonce: string;

export async function generateNonce(): Promise<string | void> {
  nonce = randomBytes(16).toString("hex");
  return nonce;
}

export async function loginWithMail(
  email: string,
  password: string
): Promise<string | void> {
  try {
    const requestBody = JSON.stringify({ email: email, password: password });

    const response = await fetch(process.env.ROOT_URL + '/api/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to login with response:", errorText);
      return `Error: ${response.statusText}`;
    }

    const json = await response.json(); // stuck here

    cookies().set("Authorization", json.token, {
      secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    });

    if (response.ok) {
      redirect('/protected');
    } else {
      return json.error;
    }
  } catch (error) {
    console.error("login action failed:", error);
  }
}

export async function loginWithCardano(
  walletID: string,
  isConnected: boolean,
  walletAddress: string,
  walletNetwork: number,
  key: string,
  signature: string
): Promise<string | void> {

  try {
    // Construct the POST request body dynamically based on the input type
    const requestBody = JSON.stringify({
      walletAddress,
      walletNetwork,
      signature,
      key,
      nonce,
    });

    const response = await fetch(process.env.ROOT_URL + '/api/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to login with response:", errorText);
      return `Error: ${response.statusText}`;
    }

    const json = await response.json(); // stuck here
    cookies().set("Authorization", json.token, {
      secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    });

    if (response.ok) {
      redirect('/protected');
    } else {
      return json.error;
    }
  } catch (error) {
    console.error("login action failed:", error);
  }
}
