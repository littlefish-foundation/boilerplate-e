"use client";
import Image from "next/image"
import Link from "next/link"
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Asset, useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";
import React, { useState, useEffect } from "react";
import { useMetadata } from '@/contexts/MetadataContext';






function filterAndMergeTokens(assets: Asset[]): Asset[] {
  // Step 1: Filter out NFTs (assuming NFTs have an amount of 1)
  const tokens = assets.filter(asset => asset.amount > 1);

  // Step 2: Create a map to merge identical tokens
  const tokenMap = new Map<string, Asset>();

  tokens.forEach(token => {
    const key = `${token.policyId}-${token.assetName}`;
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
  const { assets, isConnected, decodeHexToAscii, addresses, networkId } = useWallet(); // Destructure wallet assets, connection status, and decoding function from useWallet hook
  const { metadata } = useMetadata();
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]); // State for storing decoded wallet assets
  const StakeAddress = addresses && addresses.length > 0 ? convertHexToBech32(addresses[0], 1) : '';

  const BlockForstManinNet = process.env.MAINNET_API_KEY;
  const BlockForstPreProd = process.env.PREPROD_API_KEY;

 
  
  useEffect(() => {
    if (assets && Array.isArray(assets)) {
      const decodedAssets = decodeHexToAscii(assets);
      const filteredAndMergedTokens = filterAndMergeTokens(decodedAssets);
      setWalletAssets(filteredAndMergedTokens);
    }
  }, [assets, decodeHexToAscii]);

  const getAssetImage = (asset) => {
    console.log('Asset:', asset);
    console.log('All Metadata:', metadata);
  
    if (metadata) {
      const metadataItem = metadata.find(item => 
        item.policy_id === asset.policyID && item.display_name === asset.assetName
      );
  
      console.log('Metadata Item:', metadataItem);
      
      if (metadataItem?.onchain_metadata?.image) {
        let imageUrl = metadataItem.onchain_metadata.image;
        if (typeof imageUrl === 'string') {
          if (imageUrl.startsWith('ipfs://')) {
            imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
          }
          console.log('Image URL:', imageUrl);
          return imageUrl;
        }
      }
  
      // Check for logo in metadata
      if (metadataItem?.metadata?.logo) {
        console.log('Logo found in metadata');
        return `data:image/png;base64,${metadataItem.metadata.logo}`;
      }
    }
    
    console.log('No image found, using default');
    return '/findthefish.png'; // Default image
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-6 md:p-8 lg:p-10 ml-0 md:ml-64">
        <main className="max-w-6xl mx-auto">
          {isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>Wallet Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Type</TableHead>
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
                          <span className="text-xs text-gray-500" title={asset.policyId || ''}>
                            {(asset.policyId || '').slice(0, 8)}...
                            {(asset.policyId || '').slice(-8)}
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