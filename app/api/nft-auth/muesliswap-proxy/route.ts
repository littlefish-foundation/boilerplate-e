// app/api/muesliswap-proxy/route.ts

import { NextResponse } from 'next/server';

let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds in milliseconds

const MUESLISWAP_API_URL = 'https://api.muesliswap.com/list';
const CORS_ANYWHERE_URL = 'https://cors-anywhere.herokuapp.com/';

async function fetchWithFallback(url: string, useCorsAnywhere: boolean = false) {
  const fetchUrl = useCorsAnywhere ? `${CORS_ANYWHERE_URL}${url}` : url;
  const response = await fetch(fetchUrl);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function GET() {
  const currentTime = Date.now();

  // Check if cache is valid
  if (cachedData && currentTime - lastFetchTime < CACHE_DURATION) {
    console.log('Returning cached data from API');
    return NextResponse.json(cachedData);
  }

  try {
    console.log('Fetching fresh data from MuesliSwap API');
    let data;

    try {
      // First, try fetching directly
      data = await fetchWithFallback(MUESLISWAP_API_URL);
    } catch (directError) {
      console.error('Direct fetch failed, trying CORS-Anywhere:', directError);
      // If direct fetch fails, try using CORS-Anywhere
      data = await fetchWithFallback(MUESLISWAP_API_URL, true);
    }

    // Update cache
    cachedData = data;
    lastFetchTime = currentTime;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching MuesliSwap list:', error);
    return NextResponse.json({ error: 'Failed to fetch MuesliSwap list' }, { status: 500 });
  }
}