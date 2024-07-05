import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  RocketLaunchIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/20/solid";
import {
  LockClosedIcon,
  CodeIcon,
  InputIcon,
  GlobeIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";


const features = [
  {
    Icon: CodeIcon,
    name: "Open Source Framework",
    description:
      "Fully open-source JavaScript framework for building Cardano dApps with NFT and wallet-based authentication.",
    href: "https://github.com/littlefish-foundation/littlefish-nft-auth-framework",
    cta: "Learn more",
    background: (
      <img
        src="/open_source.png"
        className="absolute -right-20 -top-20 opacity-20"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: ArrowRightStartOnRectangleIcon,
    name: "Your Gateway to Web3 Excellence",
    description:
      "Transform your ideas into reality with our open-source framework that seamlessly integrates NFT and wallet-based authentication. Build, grow, and scale your Cardano project with confidence.",
    href: "/authentication",
    cta: "Learn more",
    background: (
      <img
        src="/ape.png"
        className="absolute -right-200 -top-200 opacity-20"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: RocketLaunchIcon,
    name: "Accelerate Your Development",
    description:
      "Designed to support a global user base with multi-language documentation and community support channels.",
    href: "/global-access",
    cta: "Learn more",
    background: (
      <img
        src="/accel.png"
        className="absolute -right-200 -top-200 opacity-20"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: ShieldCheckIcon,
    name: "Fort Knox-Level Security",
    description:
      "Implement rock-solid wallet-based authentication that your community can trust. Keep your users' assets safe while providing a smooth experience.",
    href: "/community",
    cta: "Learn more",
    background: (
      <img
        src="/secure_auth.png"
        className="absolute -right-20 -top-20 opacity-20"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: DocumentDuplicateIcon,
    name: "Knowledge is Power",
    description:
      "Comprehensive documentation and guides ensure your team can hit the ground running. From novice to expert, we've got you covered.",
    href: "https://tools.littlefish.foundation/littlefish-research-hub/littlefish-open-source/open-source-nft-and-wallet-auth-framework-for-cardano",
    cta: "Learn more",
    background: (
      <img
        src="/cardano.png"
        className="absolute -right-20 -top-200 opacity-10"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export async function BentoDemo() {
  return (
    <BentoGrid className="relative mx-auto mt-1 max-w-[80rem] px-16 ">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}
