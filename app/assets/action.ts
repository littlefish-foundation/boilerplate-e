"use server"
export default async function fetchMetadata(
  policyID: string,
  assetName: string
): Promise<Response> {
  const requestBody = JSON.stringify({ policyID, assetName });

  // Send a POST request to the signup API with the request body
  const response = await fetch(`${process.env.ROOT_URL}/api/metadata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });
  return response;
}
