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

// Function to fetch Cardano token prices from MuesliSwap using our proxy
export async function fetchCardanoTokenPrices(tokens: { policyId: string, assetName: string }[]): Promise<PriceData> {
  const prices: PriceData = {};

  try {
    // Use our proxy API route instead of directly calling MuesliSwap API
    const response = await fetch('/api/nft-auth/muesliswap-proxy');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MuesliSwapTokenInfo[] = await response.json();

    // Process the list and extract prices for the requested tokens
    tokens.forEach(token => {
      const quoteAddress = `${token.policyId}${token.assetName}`;
      const tokenInfo = data.find(item => 
        item.info.address.policyId === token.policyId && 
        item.info.address.name === token.assetName
      );

      if (tokenInfo) {
        prices[quoteAddress] = tokenInfo.price.price;
        console.log('Fetched price for', quoteAddress, ':', tokenInfo.price.price);
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

// Hook to fetch and cache MuesliSwap data
export function useMuesliSwapData() {
  const [muesliSwapData, setMuesliSwapData] = useState<MuesliSwapTokenInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/nft-auth/muesliswap-proxy');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MuesliSwapTokenInfo[] = await response.json();
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