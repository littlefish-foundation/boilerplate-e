export async function GET(request: Request) {
    const body = await request.json();
    const { policyID, assetName } = body;
    const url = `https://cardano-preprod.blockfrost.io/api/v0/assets/${policyID}${assetName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        project_id: "preprodeJMSz33SUF1JhVnLi3BG8gSMVn2vKngf",  // Ensure the environment variable is set correctly
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch metadata");
    }
    const data = await response.json();
    return data.metadata;
  }