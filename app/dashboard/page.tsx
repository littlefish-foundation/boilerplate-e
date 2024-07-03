import React from 'react';
import Particles from "@/components/magicui/particles";
import { BentoCardano } from "@/components/nft-auth/bentoCardano";

const MemoizedBentoCardano = React.memo(BentoCardano);

export default async function Page() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      
      <MemoizedBentoCardano  />
      
    </div>
  );
}
