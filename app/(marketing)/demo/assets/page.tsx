"use client";
import React, { useState, useEffect } from "react";
import { Asset, useWallet } from "littlefish-nft-auth-framework/frontend";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Wallet2, CircleDollarSign, FileText } from "lucide-react";

interface AssetCardProps {
  item: Asset;
  index: number;
  isHovered: boolean;
  onHover: (index: number) => void;
  onLeave: () => void;
}

const AssetCard = ({ item, index, isHovered, onHover, onLeave }: AssetCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.8,
      delay: index * 0.15,
      opacity: { duration: 1.2 },
      ease: [0.21, 0.47, 0.32, 0.98]
    }}
    className="p-2 w-full sm:w-1/2 lg:w-1/3"
    onMouseEnter={() => onHover(index)}
    onMouseLeave={() => onLeave()}
  >
    <Card className={`
      relative overflow-hidden transition-all duration-300 
      ${isHovered ? `
        before:absolute before:inset-0 
        before:rounded-lg before:p-[2px]
        before:bg-gradient-to-r before:from-purple-500/50 before:via-pink-500/50 before:to-purple-500/50
        before:animate-pulse-slow
        shadow-lg shadow-purple-500/20
      ` : ''}
    `}>
      <div className="relative">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-purple-100/10">
              <CircleDollarSign className="w-4 h-4 mr-1" />
              Amount: {item.amount}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wallet2 className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground truncate">
                Policy ID: {item.policyID}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                {item.assetName}
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  </motion.div>
);

const LoadingState = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-6">
        <div className="h-4 w-24 mb-4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full mb-2 bg-muted animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
      </Card>
    ))}
  </div>
);

const CardComponent = () => {
  const { assets, isConnected, decodeHexToAscii } = useWallet();
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (assets && Array.isArray(assets)) {
        const decodedAssets = decodeHexToAscii(assets);
        setWalletAssets(decodedAssets);
      }
    } catch (error) {
      console.error("Failed to decode assets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [assets, decodeHexToAscii]);

  if (!isConnected) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Please connect your Cardano wallet to view your assets
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="h-[calc(100vh-8rem)] overflow-auto">
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap -mx-2">
          {walletAssets.map((item, index) => (
            <AssetCard
              key={index}
              item={item}
              index={index}
              isHovered={hoverIndex === index}
              onHover={setHoverIndex}
              onLeave={() => setHoverIndex(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
