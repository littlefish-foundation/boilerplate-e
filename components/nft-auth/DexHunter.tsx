import React from 'react'
import { FC } from "react";
const Swap = dynamic(() => import("@dexhunterio/swaps"), {
    ssr: false,
});

interface DexHunterProps {
    wallet: string | null;
}


import '@dexhunterio/swaps/lib/assets/style.css'
import dynamic from 'next/dynamic';

export const DexHunter: FC<DexHunterProps> = ({ wallet }) => {
    const walletAddress = wallet;

    console.log("wallet address:" + walletAddress);
    
  return (
    <Swap
      orderTypes={["SWAP","LIMIT"]}
      colors={{"background":"#0E0F12","containers":"#191B23","subText":"#88919E","mainText":"#FFFFFF","buttonText":"#FFFFFF","accent":"#007DFF"}}
      theme="dark"
      width="450"
      partnerCode="littlefish-nft-auth616464723171387a74636b7761653475717a70656b66363366646e676b6139677174337967766d74376a6c746b6665367372347a667630346e7078616a75713979783872676b63776b6e67667536797a78706839306d32707a756375636c753473357467736767da39a3ee5e6b4b0d3255bfef95601890afd80709"
      partnerName="littlefish-nft-auth"
      displayType="FULL"
      walletName={walletAddress}
    />
  )
}
