export async function GET(request: Request) {
    console.log("EMIR")
    const body = await request.json();
    const { policyID, assetName } = body;
    console.log(policyID, assetName);
    const url = `https://cardano-preprod.blockfrost.io/api/v0/assets/${policyID}${assetName}`;
    console.log(process.env.MAINNET_API_KEY)
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        project_id: "preprodeJMSz33SUF1JhVnLi3BG8gSMVn2vKngf",  // Ensure the environment variable is set correctly
      },
    });
    console.log(response)
  
    if (!response.ok) {
      throw new Error("Failed to fetch metadata");
    }
    const data = await response.json();
    console.log(data.onchain_metadata.name);
    return data.metadata;
  }