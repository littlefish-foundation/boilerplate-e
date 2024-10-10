"use client"

import { useWallet } from 'littlefish-nft-auth-framework';
import { convertHexToBech32 } from 'littlefish-nft-auth-framework/backend';
import { useState } from 'react';

export default function RequestToken() {
    const { isConnected, addresses, networkID } = useWallet();
    const [status, setStatus] = useState('');

    const handleSubmit = async () => {
        const formData = {
            walletNetwork: networkID,
            stakeAddress: addresses[0],
        };

        if (!formData.walletNetwork || !formData.stakeAddress) {
            setStatus('Please connect your wallet to request a token.');
            return;
        }

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setStatus('Request sent successfully!');
            } else {
                setStatus('Failed to send request. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            {isConnected ? (
                <>
                    <h1>Request Token</h1>
                    <button onClick={handleSubmit}>Send Request</button>
                    <p>{status}</p>
                </>
            ) : (
                <p>Connect your wallet to request a token.</p>
            )}
        </div>
    );
}
