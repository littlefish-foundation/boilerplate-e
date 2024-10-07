"use client";
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { useState } from "react";
import { getMetadata } from "./metadata";
import type { Asset } from "littlefish-nft-auth-framework/frontend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function MetadataPage() {
    const { assets, isConnected, networkID } = useWallet();
    const [isSso, setIsSso] = useState<boolean>(false);
    const [metadata, setMetadata] = useState<any>();
    const handleGetMetadata = async (asset: Asset) => {
        try {
            const result = await getMetadata(asset, networkID);
            if (result instanceof Response) {
                if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                }
                const text = await result.text();
                console.error("Error from getMetadata:", text);
                setMetadata(null);
            } else if (Array.isArray(result)) {
                const [metadataResult, isSso] = result;
                setMetadata(metadataResult);
                setIsSso(isSso);
            } else {
                console.error("Unexpected response type from getMetadata");
                setMetadata(null);
            }
        } catch (error) {
            console.error("Error fetching metadata:", error);
            setMetadata(null);
        }
    };
    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Metadata Viewer</CardTitle>
                    <CardDescription>View metadata for your connected assets</CardDescription>
                </CardHeader>
                <CardContent>
                    {isConnected ? (
                        assets && assets.length > 0 ? (
                            <div className="space-y-6">
                                <div className="h-[300px] rounded-md border p-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {assets.map((asset) => (
                                            <Button
                                                key={asset.assetName}
                                                onClick={() => handleGetMetadata(asset)}
                                                variant="outline"
                                                className="w-full text-left"
                                            >
                                                <span className="truncate">
                                                    {asset.policyID}.{asset.assetName}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                {metadata && isSso && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Metadata</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px] w-full rounded-md border">
                                                <pre className="p-4 text-sm">
                                                    {JSON.stringify(metadata, null, 2)}
                                                </pre>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">No assets found</div>
                        )
                    ) : (
                        <div className="text-center text-muted-foreground">Connect your wallet to view metadata</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}