import axios from 'axios';

const API_URL = 'https://cardano-mainnet.blockfrost.io/api/v0'; // Use the appropriate URL for your network (mainnet, testnet, etc.)
const PROJECT_ID = 'mainnetQBtFxXMqhFtdJCt9TRYpL3254BKm2ejw'; // Replace with your Blockfrost API key

const blockfrostAPI = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    project_id: PROJECT_ID,
  },
});


export const GetAssets = async (address)=> {
  try {
    const response = await blockfrostAPI.get(`/addresses/${address}/utxos`)
    return response.data;
  } catch (error) {
    console.error('Error fetching assets for addresses:', error);
    throw error;
  }
}