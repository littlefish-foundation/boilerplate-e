import fs from 'fs-extra';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import type { NextRequest } from 'next/server';

// Replace with your Blockfrost API key
const API_KEY = process.env.BLOCKFROST_API_KEY;

// Initialize the Blockfrost API client
const API = new BlockFrostAPI({
  projectId: API_KEY,
  isTestnet: false, // Set to true for testnet
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const policyId = searchParams.get('policyId');

  if (!policyId) {
    return new Response('Missing policyId parameter', { status: 400 });
  }

  try {
    // Fetch asset information for the given policy ID
    const assets = await API.assetsAll(policyId);

    // Filter out non-NFT assets (quantity > 1)
    const nfts = assets.filter(asset => asset.quantity === '1');

    // Create an array of NFT data
    const nftData = nfts.map(nft => ({
      assetName: nft.assetName,
      policyId: nft.policyId,
      fingerprint: nft.fingerprint,
      metadata: nft.metadata,
    }));

    // Write the NFT data to a file
    await fs.writeFile('/api/nft-auth/nfts-ts', JSON.stringify(nftData, null, 2));
    console.log('NFT data written to /api/nft-auth/nfts-ts');

    return new Response(JSON.stringify({ message: 'NFT data fetched successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    return new Response('Error fetching NFT data', { status: 500 });
  }
}