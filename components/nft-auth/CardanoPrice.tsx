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
    <section
      id="CardanoPrice"
      className="relative mx-auto mt-12 max-w-[80rem] px-6 text-center md:px-8"
    >
    <div className="flex  items-center justify-center">
      
      <p className="z-10 whitespace-pre-wrap text-center text-2xl font-medium tracking-tighter text-black dark:text-white">
        {formattedPrice}
      </p>
      
    </div>
    </section>
  );
};

export default CardanoPrice;