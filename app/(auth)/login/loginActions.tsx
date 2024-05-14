import { redirect } from "next/navigation";
import { signMessage } from "littlefish-nft-auth-framework-beta";
import { randomBytes, sign } from "crypto";
import { cookies } from "next/headers";

//const { signMessage } = require('littlefish-nft-auth-framework-beta');

export async function loginWithMail(
  email: string,
  password: string
): Promise<string | void> {
  try {
    const requestBody = JSON.stringify({ email: email, password: password });

    const response = await fetch(`/api/login`, {
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
      redirect("/protected");
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
  walletNetwork: number
): Promise<string | void> {
  let email: string | null = null;
  let password: string | null = null;
  let nonce, key, signature;
  nonce = randomBytes(16).toString("hex");

  try {
    const signResponse = await signMessage(
      walletID,
      isConnected,
      nonce,
      walletAddress
    );
    if (signResponse) {
      [key, signature] = signResponse;
    }

    // Construct the POST request body dynamically based on the input type
    const requestBody = JSON.stringify({
      walletAddress,
      walletNetwork,
      signature,
      key,
      nonce,
    });
    console.log(requestBody);
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to login with response:", errorText);
      return `Error: ${response.statusText}`;
    }

    const json = await response.json(); // stuck here
    console.log(json);

    if (response.ok) {
      console.log("login successful");
    } else {
      return json.error;
    }
  } catch (error) {
    console.error("login action failed:", error);
  }
}
