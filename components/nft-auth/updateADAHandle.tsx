// /components/nft-auth/updateADAHandle.tsx

import React, { useState, useEffect } from 'react';
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ADA_HANDLE_POLICY_ID = "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a";

function hexToAscii(hex: string): string {
  let ascii = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    if (charCode > 32 && charCode < 127) {
      ascii += String.fromCharCode(charCode);
    }
  }
  return ascii.replace(/^[^a-zA-Z0-9]+/, '');
}

export function UpdateADAHandle() {
  const { isConnected, assets, addresses } = useWallet();
  const [adaHandles, setAdaHandles] = useState<{ name: string; id: string }[]>([]);
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null);
  const [defaultHandle, setDefaultHandle] = useState<string | null>(null);

  const stakeAddress = addresses && addresses.length > 0 ? convertHexToBech32(addresses[0], 1) : ''

  useEffect(() => {
    if (isConnected && assets && assets.length > 0) {
      const adaHandleAssets = assets.filter(asset => asset.policyID === ADA_HANDLE_POLICY_ID);
      const handles = adaHandleAssets.map(asset => ({
        name: hexToAscii(asset.assetName),
        id: asset.assetName
      }));
      setAdaHandles(handles);

      // Fetch current default handle from the server
      fetchDefaultHandle();
    }
  }, [isConnected, assets, stakeAddress]);

  const fetchDefaultHandle = async () => {
    if (!stakeAddress) return;

    try {
      const response = await fetch(`/api/nft-auth/${stakeAddress}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getDefault'
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setDefaultHandle(data.defaultHandle?.name || null);
        setSelectedHandle(data.defaultHandle?.id || null);
      }
    } catch (error) {
      console.error('Error fetching default ADA handle:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedHandle || !stakeAddress) return;

    try {
      const response = await fetch(`/api/nft-auth/${stakeAddress}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'setDefault',
          handleId: selectedHandle
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDefaultHandle(data.defaultHandle?.name || null);
        toast.success("ADA Handle updated successfully");
      } else {
        toast.error("Failed to update ADA Handle");
      }
    } catch (error) {
      console.error('Error updating ADA handle:', error);
      toast.error("Error updating ADA Handle");
    }
  };

  if (!isConnected || adaHandles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      
      <div className="flex items-center space-x-4">
        <Select
          value={selectedHandle || ''}
          onValueChange={(value) => setSelectedHandle(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select ADA Handle" />
          </SelectTrigger>
          <SelectContent>
            {adaHandles.map((handle) => (
              <SelectItem key={handle.id} value={handle.id}>
                ${handle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleUpdate} disabled={!selectedHandle || selectedHandle === defaultHandle}>
          Update
        </Button>
      </div>
      {defaultHandle && (
        <p className="text-sm text-gray-500">Current default: ${defaultHandle}</p>
      )}
    </div>
  );
}