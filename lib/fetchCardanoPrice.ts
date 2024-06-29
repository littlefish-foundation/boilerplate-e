// api/nft-auth/fetchCardanoPrice.ts
export async function fetchCardanoPrice(): Promise<number | null> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
      const data = await response.json();
      return data.cardano.usd;
    } catch (error) {
      console.error('Failed to fetch Cardano price:', error);
      return null;
    }
  }