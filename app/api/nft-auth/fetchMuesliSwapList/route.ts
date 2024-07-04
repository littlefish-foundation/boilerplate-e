import { NextResponse } from 'next/server';
import { MuesliSwapTokenInfo } from '@/components/nft-auth/cardanoPriceUtils';

let cachedData: MuesliSwapTokenInfo[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 160000; // 1 minute in milliseconds

export async function GET() {
  const currentTime = Date.now();

  // Check if cached data is available and not expired
  if (cachedData && (currentTime - lastFetchTime < CACHE_DURATION)) {
    console.log('Returning cached MuesliSwap list');
    return NextResponse.json(cachedData);
  }

  try {
    const response = await fetch('https://api.muesliswap.com/list');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Fetched fresh MuesliSwap list');

    const data: MuesliSwapTokenInfo[] = await response.json();
    
    // Update cache and last fetch time
    cachedData = data;
    lastFetchTime = currentTime;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching MuesliSwap list:', error);
    return NextResponse.json({ error: 'Failed to fetch MuesliSwap list' }, { status: 500 });
  }
}