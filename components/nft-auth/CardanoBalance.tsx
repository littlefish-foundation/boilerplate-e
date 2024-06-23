"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";


interface CardanoBalanceProps {
  text: number;
}

const formatBalance = (balance: number): string => {
  const formattedBalance = (balance / 1_000_000).toFixed(2); // Dividing by 1 million and fixing to 2 decimal places
  return `₳ ${formattedBalance}`;
};

const CardanoBalance: FC<CardanoBalanceProps> = ({ text }) => {
  const formattedBalance = formatBalance(text);
  
  
  

  return (
    <section
      id="CardanoBalance"
      className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8"
    >
    <div className="flex  items-center justify-center">
    <div className="relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
    
      <p className="z-10 whitespace-pre-wrap text-center text-4xl font-medium tracking-tighter text-black dark:text-white">
        {formattedBalance}
      </p>
      
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
    </div>  
    </section>
  );
};

export default CardanoBalance;
