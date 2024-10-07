"use server";
import { metadataReader, setConfig } from "littlefish-nft-auth-framework/backend";
import type { Asset } from "littlefish-nft-auth-framework/frontend";

const getConfig = () => ({
    0: {
        // preprod
        apiKey: process.env.PREPROD_API_KEY,
        networkId: "preprod",
    },
    1: {
        // mainnet
        apiKey: process.env.MAINNET_API_KEY,
        networkId: "mainnet",
    },
    // Add other networks as needed
});

export async function getMetadata(asset: Asset, networkID: number) {
    const config = getConfig();
    const networkConfig = config[networkID as keyof typeof config];
    if (!networkConfig || !networkConfig.apiKey) {
        return new Response("Configuration for the provided network is missing or incomplete.", { status: 400 });
    }
    setConfig(networkConfig.apiKey, networkConfig.networkId);
    try {
        const [metadata, isSso] = await metadataReader(asset);
        console.log("metadata", metadata);
        if (!metadata) {
            return new Response("Metadata not found", { status: 404 });
        }
        return [metadata, isSso];
    } catch (error) {
        console.error("Error fetching metadata:", error);
        return new Response("Failed to fetch metadata", { status: 500 });
    }
}