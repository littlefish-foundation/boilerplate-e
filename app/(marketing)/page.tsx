import ClientSection from "@/components/landing/client-section";
import CallToActionSection from "@/components/landing/cta-section";
import HeroSection from "@/components/landing/hero-section";
import PricingSection from "@/components/landing/pricing-section";
import Particles from "@/components/magicui/particles";
import { SphereMask } from "@/components/magicui/sphere-mask";
import PropertiesSection from "@/components/landing/properties-section";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { BentoDemo } from "@/components/landing/bento-grid";

export default async function Page() {
  return (
    <>
      <HeroSection />
      <BentoDemo />
      <PropertiesSection />
      <CallToActionSection />
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
