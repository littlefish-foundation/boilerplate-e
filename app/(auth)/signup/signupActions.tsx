import { redirect } from "next/navigation";
import { signMessage } from "littlefish-nft-auth-framework-beta";
import { randomBytes } from "crypto";

//const { signMessage } = require('littlefish-nft-auth-framework-beta');

export async function signupWithMail(
  email: string,
  password: string
): Promise<string | void> {
  try {
    const requestBody = JSON.stringify({ email: email, password: password });

    const response = await fetch(`/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    console.log(response)
    if (!response.ok) {
        const errorText = await response.text();  // Read response as text to see what went wrong
        console.error("Failed to signup with response:", errorText);
        return `Error: ${response.statusText}`;
      }
    
    const json = await response.json(); // stuck here
    console.log(json);

    if (response.ok) {
      console.log("Signup successful");
    } else {
      return json.error;
    }
  } catch (error) {
    console.error("Signup action failed:", error);
  }
}

export async function signupWithCardano(
  walletID: string,
  isConnected: boolean,
  walletAddress: string,
  networkID: number
): Promise<string | void> {
  let email: string | null = null;
  let password: string | null = null;
  let nonce, key, signature;
  nonce = randomBytes(16).toString("hex");

  try {

    const [key, signature] = await signMessage(walletID, isConnected, nonce, walletAddress);
    console.log("Key: ", key);

    // Construct the POST request body dynamically based on the input type
    const requestBody = JSON.stringify({
      walletAddress,
      key,
      signature,
      walletNetwork: networkID,
      nonce,
    });
    console.log(requestBody)
    const response = await fetch(`/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    console.log(response)
    if (!response.ok) {
        const errorText = await response.text();  // Read response as text to see what went wrong
        console.error("Failed to signup with response:", errorText);
        return `Error: ${response.statusText}`;
      }
    
    const json = await response.json(); // stuck here
    console.log(json);

    if (response.ok) {
      console.log("Signup successful");
    } else {
      return json.error;
    }
  } catch (error) {
    console.error("Signup action failed:", error);
  }
}
