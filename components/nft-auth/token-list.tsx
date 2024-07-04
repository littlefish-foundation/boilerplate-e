"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image"
import Link from "next/link"
import {
  MoreHorizontal,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Asset, useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";
import { useMetadata } from '@/contexts/MetadataContext';

// Cache duration in milliseconds (30 seconds)
const CACHE_DURATION = 30000;

function filterAndMergeTokens(assets: Asset[]): Asset[] {
  // Step 1: Filter out NFTs (assuming NFTs have an amount of 1)
  const tokens = assets.filter(asset => asset.amount > 1);

  // Step 2: Create a map to merge identical tokens
  const tokenMap = new Map<string, Asset>();

  tokens.forEach(token => {
    const key = `${token.policyID}-${token.assetName}`;
    if (tokenMap.has(key)) {
      // If the token already exists, add the amounts
      const existingToken = tokenMap.get(key)!;
      existingToken.amount += token.amount;
    } else {
      // If it's a new token, add it to the map
      tokenMap.set(key, { ...token });
    }
  });

  // Step 3: Convert the map back to an array
  return Array.from(tokenMap.values());
}

function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  } else {
    return num.toString();
  }
}

export default function TokenList() {
  const { assets, isConnected, decodeHexToAscii, addresses } = useWallet();
  const { metadata } = useMetadata();
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]);
  const [muesliSwapData, setMuesliSwapData] = useState<any>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const cachedAssetsRef = useRef<Asset[]>([]);
  const cachedMuesliSwapDataRef = useRef<any>(null);
  const StakeAddress = addresses && addresses.length > 0 ? convertHexToBech32(addresses[0], 1) : '';

  useEffect(() => {
    const currentTime = Date.now();
    
    if (assets && Array.isArray(assets) && isConnected) {
      // Check if cache is valid
      if (currentTime - lastFetchTimeRef.current < CACHE_DURATION) {
        console.log('Using cached wallet assets');
        setWalletAssets(cachedAssetsRef.current);
      } else {
        console.log('Fetching fresh wallet assets');
        const decodedAssets = decodeHexToAscii(assets);
        const filteredAndMergedTokens = filterAndMergeTokens(decodedAssets);
        setWalletAssets(filteredAndMergedTokens);
        
        // Update cache
        cachedAssetsRef.current = filteredAndMergedTokens;
        lastFetchTimeRef.current = currentTime;
      }
    }
  }, [assets, isConnected, decodeHexToAscii]);

  const fetchMuesliSwapList = async () => {
    const currentTime = Date.now();

    if (cachedMuesliSwapDataRef.current && currentTime - lastFetchTimeRef.current < CACHE_DURATION) {
      console.log('Using cached MuesliSwap data');
      setMuesliSwapData(cachedMuesliSwapDataRef.current);
      return;
    }

    const fetchWithFallback = async (url: string, useCorsAnywhere: boolean = false) => {
      const fetchUrl = useCorsAnywhere ? `https://cors-anywhere.herokuapp.com/${url}` : url;
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    };

    try {
      console.log('Fetching fresh MuesliSwap data');
      let data;

      try {
        // First, try fetching from our API route
        data = await fetchWithFallback('/api/muesliswap-proxy');
      } catch (apiError) {
        console.error('API route fetch failed, trying direct with CORS-Anywhere:', apiError);
        // If API route fails, try direct fetch with CORS-Anywhere
        data = await fetchWithFallback('https://api.muesliswap.com/list', true);
      }

      setMuesliSwapData(data);
      cachedMuesliSwapDataRef.current = data;
      lastFetchTimeRef.current = currentTime;
    } catch (error) {
      console.error('Error fetching MuesliSwap list:', error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchMuesliSwapList();
    }
  }, [isConnected]);

  const getAssetImage = (asset: Asset) => {
    if (metadata) {
      const metadataItem = metadata.find(item => 
        item.info.address.policyId === asset.policyID && item.info.address.name === asset.assetName
      );
  
      // console.log('Metadata Item:', metadataItem);
      
      if (metadataItem?.info?.image) {
        let imageUrl = metadataItem.info.image;
        if (typeof imageUrl === 'string') {
          if (imageUrl.startsWith('ipfs://')) {
            imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
          }
          // console.log('Image URL:', imageUrl);
          return imageUrl;
        }
      }
    }
    
    // console.log('No image found, using default');
    return '/findthefish.png'; // Default image
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
        <main className="max-w-6xl mx-auto">
          {isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">Sym</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>PRICE (₳)</TableHead>
                      <TableHead className="hidden md:table-cell">Amount</TableHead>
                      <TableHead className="hidden lg:table-cell">Policy ID</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {walletAssets.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell className="hidden sm:table-cell">
                          {getAssetImage(asset) && (
                            <img
                              alt={asset.assetName || 'Asset'}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={getAssetImage(asset)}
                              width="64"
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{asset.assetName || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {asset.amount === 1 ? 'NFT' : 'Token'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span title={asset.amount.toLocaleString()}>
                            {formatLargeNumber(asset.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs text-gray-500" title={asset.policyID || ''}>
                            {(asset.policyID || '').slice(0, 8)}...
                            {(asset.policyID || '').slice(-8)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Transfer</DropdownMenuItem>
                              {asset.amount > 1 && <DropdownMenuItem>Split</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>{walletAssets.length}</strong> assets
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Connect your wallet to view your assets.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}