import prisma from "@/app/lib/prisma";
import { signupUser } from "littlefish-nft-auth-framework-beta/backend";

// Define the POST function to handle signup requests
export async function POST(request: Request) {
  // Parse the incoming JSON request body
  const body = await request.json();
  console.log(body);

  // Call the signupUser function with the request body and get the result
  const result = await signupUser(body);

  console.log("Result");

  // If signupUser function returns an error, return an error response
  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
    });
  }

  try {
    // Check if the signup was successful and proceed accordingly
    if (result.success) {
      if (result.email && result.passwordHash) {
        // Check if a user with the given email already exists
        const existingUser = await prisma.user.findFirst({
          where: {
            email: result.email,
          },
        });

        if (existingUser) {
          // Return a 400 response if the email already exists
          return new Response(JSON.stringify({ error: "existingUser" }), {
            status: 400,
          });
        }

        // Create a new user with email and password
        await prisma.user.create({
          data: {
            email: result.email,
            password: result.passwordHash,
            emailVerified: new Date(),
          },
        });
      } else {
        // Check if a user with the given wallet address already exists
        const existingUser = await prisma.user.findFirst({
          where: {
            walletAddress: result.walletAddress,
          },
        });

        if (existingUser) {
          // Return a 400 response if the wallet address already exists
          return new Response(JSON.stringify({ error: "existingUser" }), {
            status: 400,
          });
        }

        // Create a new user with wallet address and network
        await prisma.user.create({
          data: {
            walletAddress: result.walletAddress,
            walletNetwork: result.walletNetwork,
            walletAddressVerified: new Date(),
          },
        });
      }
    }
  } catch (error) {
    // Return a 400 response with the error message if an exception is caught
    return new Response(JSON.stringify({ error: error }), { status: 400 });
  }

  // Return a 200 response indicating success
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
