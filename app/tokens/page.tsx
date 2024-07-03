import React from "react";
import TokenList from "../../components/nft-auth/token-list";


export default async function Page() {
  return (
    <div className="container  h-screen w-screen flex-col items-center justify-center">
      
      <TokenList />
      
    </div>
  );
}
