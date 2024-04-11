import React, { createContext, useContext, useState, useCallback } from "react";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { GetAssets } from "../components/wallet/getAssets.tsx";

const WalletContext = createContext(null);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({
    children,
    onConnect = () => { },
    onDisconnect = () => { },
    onFetchAssetsStart = () => { },
    onFetchAssetsSuccess = () => { },
    onFetchAssetsError = (error) => { },
}) => {
    const {
        isConnected,
        connect,
        disconnect,
        enabledWallet,
        stakeAddress,
        signMessage,
        usedAddresses,
        unusedAddresses,
        accountBalance,
    } = useCardano();

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const connectWallet = useCallback(async (walletName) => {
        try {
            await connect(walletName);
            onConnect();
        } catch (err) {
            console.error("Error connecting wallet:", err);
        }
    }, [connect, onConnect]);

    const disconnectWallet = useCallback(async () => {
        try {
            await disconnect();
            onDisconnect();
        } catch (err) {
            console.error("Error disconnecting wallet:", err);
        }
    }, [disconnect, onDisconnect]);

    const fetchAssets = useCallback(async (address) => {
        onFetchAssetsStart();
        setLoading(true);
        setError("");
        try {
            if (typeof address === "string" && address.trim() !== "") {
                const assetsArray = await GetAssets(address);
                const transformedAssets = assetsArray.flatMap((asset) =>
                    asset.amount.map((amt) => ({
                        unit: amt.unit,
                        quantity: amt.quantity,
                    }))
                );
                setAssets(transformedAssets);
                onFetchAssetsSuccess(transformedAssets);
            } else {
                const errorMessage = "Invalid address";
                onFetchAssetsError(errorMessage); // Call error callback with the error message
                throw new Error(errorMessage);
            }
        } catch (err) {
            console.error("Error fetching assets:", err);
            setError("Failed to fetch assets");
            setAssets([]); // Clear assets on error
            onFetchAssetsError("Failed to fetch assets");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <WalletContext.Provider
            value={{
                connectWallet,
                disconnectWallet,
                fetchAssets,
                isConnected,
                enabledWallet,
                stakeAddress,
                usedAddresses,
                unusedAddresses,
                connect,
                disconnect,
                accountBalance,
                assets,
                loading,
                error,
                signMessage,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
