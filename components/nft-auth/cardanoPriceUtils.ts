'use client';

import { useState, useEffect } from 'react';

// Define the structure of the price data
type PriceData = {
  [policyIdAssetName: string]: number;
};

export interface MuesliSwapTokenInfo {
  info: {
    address: {
      name: string;
      policyId: string;
    };
    decimalPlaces: number;
    description: string;
    image: string;
    symbol: string;
    website: string;
    categories: string[];
    supply: {
      total: string;
      circulating: string | null;
    };
    status: string;
  };
  price: {
    volume: {
      base: string;
      quote: string;
    };
    volumeChange: {
      base: number;
      quote: number;
    };
    volumeTotal: {
      base: string;
      quote: string;
    };
    volumeAggregator: Record<string, unknown>;
    price: number;
    askPrice: number;
    bidPrice: number;
    priceChange: {
      "24h": string;
      "7d": string;
    };
    fromToken: string;
    toToken: string;
    price10d: number[];
    quoteDecimalPlaces: number;
    baseDecimalPlaces: number;
    quoteAddress: {
      name: string;
      policyId: string;
    };
    baseAddress: {
      policyId: string;
      name: string;
    };
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData {
  data: MuesliSwapTokenInfo[];
  timestamp: number;
}

// Function to fetch Cardano token prices from MuesliSwap using our proxy
export async function fetchCardanoTokenPrices(tokens: { policyId: string, assetName: string }[]): Promise<PriceData> {
  const prices: PriceData = {};

  try {
    const cachedData = localStorage.getItem('muesliSwapData');
    let data: MuesliSwapTokenInfo[];

    if (cachedData) {
      const { data: cachedPrices, timestamp } = JSON.parse(cachedData) as CachedData;
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION) {
        data = cachedPrices;
      } else {
        data = await fetchFreshData();
      }
    } else {
      data = await fetchFreshData();
    }

    // Process the list and extract prices for the requested tokens
    tokens.forEach(token => {
      const quoteAddress = `${token.policyId}${token.assetName}`;
      const tokenInfo = data.find(item => 
        item.info.address.policyId === token.policyId && 
        item.info.address.name === token.assetName
      );

      if (tokenInfo) {
        prices[quoteAddress] = tokenInfo.price.price;
        // console.log('Fetched price for', quoteAddress, ':', tokenInfo.price.price);
      } else {
        console.log('Price not found for', quoteAddress);
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching Cardano token prices:', error);
    return {};
  }
}

async function fetchFreshData(): Promise<MuesliSwapTokenInfo[]> {
  const response = await fetch('/api/nft-auth/muesliswap-proxy');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: MuesliSwapTokenInfo[] = await response.json();
  
  // Cache the fresh data
  localStorage.setItem('muesliSwapData', JSON.stringify({
    data,
    timestamp: Date.now()
  }));

  return data;
}

// Hook to fetch and cache MuesliSwap data
export function useMuesliSwapData() {
  const [muesliSwapData, setMuesliSwapData] = useState<MuesliSwapTokenInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem('muesliSwapData');
        let data: MuesliSwapTokenInfo[];

        if (cachedData) {
          const { data: cachedPrices, timestamp } = JSON.parse(cachedData) as CachedData;
          const now = Date.now();
          if (now - timestamp < CACHE_DURATION) {
            data = cachedPrices;
          } else {
            data = await fetchFreshData();
          }
        } else {
          data = await fetchFreshData();
        }

        setMuesliSwapData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { muesliSwapData, isLoading, error };
}