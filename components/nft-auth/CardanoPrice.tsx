"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { fetchCardanoPrice } from "@/lib/fetchCardanoPrice";

const CardanoPrice: FC = () => {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const fetchedPrice = await fetchCardanoPrice();
      setPrice(fetchedPrice);
    };

    // Fetch the price immediately when the component mounts
    fetchPrice();

    // Set up an interval to fetch the price every 30 seconds
    const intervalId = setInterval(fetchPrice, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const formattedPrice = price ? `$${price.toFixed(4)}` : 'Loading...';

  return (
    <div className="relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl">
      <p className="z-10 whitespace-pre-wrap text-center text-2xl font-medium tracking-tighter text-black dark:text-white">
        {formattedPrice}
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
  );
};

export default CardanoPrice;