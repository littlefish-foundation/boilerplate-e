import CallToActionSection from "@/components/landing/cta-section";
import HeroSection from "@/components/landing/hero-section";
import Particles from "@/components/magicui/particles";
import PropertiesSection from "@/components/landing/properties-section";
import { BentoDemo } from "@/components/landing/bento-grid";
import { FAQ } from "@/components/landing/faq-section";
import CookieCheck from "@/components/cookieCheck";

export default async function Page() {
  return (
    <>
      <CookieCheck />
      <HeroSection />
      <BentoDemo />
      <PropertiesSection />
      <FAQ />

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
