import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://api.muesliswap.com/list';

async function fetchAssetMetadata() {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {},
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const assets = await fetchAssetMetadata();
    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Error fetching asset metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch asset metadata' }, { status: 500 });
  }
}