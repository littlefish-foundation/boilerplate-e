"use server";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

let nonce: string;

export async function generateNonce(): Promise<string | void> {
  nonce = randomBytes(16).toString("hex");
  return nonce;
}


export async function signupWithMail(
  email: string,
  password: string
): Promise<string | void> {
  //try {
    const requestBody = JSON.stringify({ email: email, password: password });
    const response = await fetch(process.env.ROOT_URL + '/api/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    //console.log(response);
    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to signup with response:", errorText);
      return `Error: ${response.statusText}`;
    }

    const json = await response.json(); // stuck here
    //console.log(json);

    if (response.ok) {
      redirect('/login');
    } else {
      return json.error;
    }
  //} catch (error) {
  //  console.error("Signup action failed:", error);
  //}
}

export async function signupWithCardano(
  walletID: string,
  isConnected: boolean,
  walletAddress: string,
  walletNetwork: number,
  key: string,
  signature: string
): Promise<string | void> {
  try {
    console.log("hehe" + walletNetwork)
    // Construct the POST request body dynamically based on the input type
    const requestBody = JSON.stringify({
      walletAddress,
      walletNetwork,
      signature,
      key,
      nonce,
    });
    //console.log(requestBody);
    const response = await fetch(process.env.ROOT_URL + '/api/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    //console.log(response);
    if (!response.ok) {
      const errorText = await response.text(); // Read response as text to see what went wrong
      console.error("Failed to signup with response:", errorText);
      return `Error: ${response.statusText}`;
    }

    const json = await response.json(); // stuck here
    //console.log(json);

    if (response.ok) {
      redirect('/login');
    } else {
      return json.error;
    }
  } catch (error) {
    console.error("Signup action failed:", error);
  }
}
