/*
interface AssetMetadata {
    policy_id: string;
    asset_name: string;
    fingerprint: string;
    quantity: string;
    onchain_metadata?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    url?: string;
  }
  
  export const fetchAssetMetadata = async (stakeAddress: string, network: string): Promise<{ assets: AssetMetadata[] }> => {
    const response = await fetch('/api/asset-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stakeAddress, network }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch asset metadata');
    }
    
    return response.json();
  };

 */