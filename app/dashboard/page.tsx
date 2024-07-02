import Particles from "@/components/magicui/particles";
import { BentoCardano } from "@/components/nft-auth/bentoCardano";

export default async function Page() {
  return (
    <>
      <BentoCardano />
      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#ffffff"}
      />
    </>
  );
}
