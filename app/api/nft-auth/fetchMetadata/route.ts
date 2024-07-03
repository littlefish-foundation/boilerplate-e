// File: app/api/stake-assets/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BLOCKFROST_API_URLS = {
  mainnet: 'https://cardano-mainnet.blockfrost.io/api/v0',
  preprod: 'https://cardano-preprod.blockfrost.io/api/v0',
  preview: 'https://cardano-preview.blockfrost.io/api/v0',
};

type Network = 'mainnet' | 'preprod' | 'preview';

async function fetchAssetMetadata(stakeAddress: string, network: Network) {
  const apiKey = process.env[`${network.toUpperCase()}_API_KEY`];
  if (!apiKey) {
    throw new Error(`Blockfrost API key not configured for ${network}`);
  }

  const apiUrl = BLOCKFROST_API_URLS[network];

  const assetsResponse = await fetch(`${apiUrl}/accounts/${stakeAddress}/addresses/assets`, {
    headers: { 'project_id': apiKey },
  });

  if (!assetsResponse.ok) {
    throw new Error(`HTTP error! status: ${assetsResponse.status}`);
  }

  const assets = await assetsResponse.json();

  const metadataPromises = assets.map((asset: any) => 
    fetch(`${apiUrl}/assets/${asset.unit}`, {
      headers: { 'project_id': apiKey },
    }).then(res => res.json())
  );

  return Promise.all(metadataPromises);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { stakeAddress, network } = body;

  if (!stakeAddress || !network) {
    return NextResponse.json({ error: 'Missing stakeAddress or network in request body' }, { status: 400 });
  }

  if (!['mainnet', 'preprod', 'preview'].includes(network)) {
    return NextResponse.json({ error: 'Invalid network parameter' }, { status: 400 });
  }

  try {
    const assets = await fetchAssetMetadata(stakeAddress, network as Network);
    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Error fetching asset metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch asset metadata' }, { status: 500 });
  }
}