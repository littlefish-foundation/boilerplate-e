import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
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
        className="absolute -right-20 -top-20 opacity-60"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: LockClosedIcon,
    name: "Secure Authentication",
    description:
      "Leverage secure, wallet-based authentication to enhance user trust and data security in your dApps.",
    href: "/authentication",
    cta: "Learn more",
    background: (
      <img
        src="/secure_auth.png"
        className="absolute -right-20 -top-20 opacity-60"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeAltIcon,
    name: "Global Accessibility",
    description:
      "Designed to support a global user base with multi-language documentation and community support channels.",
    href: "/global-access",
    cta: "Learn more",
    background: (
      <img
        src="path/to/your/image.jpg"
        className="absolute -right-20 -top-20 opacity-60"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: ShieldCheckIcon,
    name: "Community Collaboration",
    description:
      "Encourages community contribution and collaboration to continually enhance the framework.",
    href: "/community",
    cta: "Learn more",
    background: (
      <img
        src="path/to/your/image.jpg"
        className="absolute -right-20 -top-20 opacity-60"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: DocumentDuplicateIcon,
    name: "Comprehensive Documentation",
    description:
      "Includes detailed documentation and user guides to help developers integrate the authentication system quickly.",
    href: "/documentation",
    cta: "Learn more",
    background: (
      <img
        src="path/to/your/image.jpg"
        className="absolute -right-20 -top-20 opacity-60"
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
