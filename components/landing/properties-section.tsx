import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
} from "@heroicons/react/20/solid";

export default function PropertiesSection() {
  const properties = [
    { key: "Framework", value: "Next.js with Cardano Integration" },
    { key: "Authentication Type", value: "NFT and Wallet-Based" },
    { key: "License", value: "MIT" },
    { key: "Open Source", value: "Yes" },
    { key: "Primary Language", value: "JavaScript" },
    { key: "Documentation", value: "Included" },
    { key: "Support", value: "Community Support via GitHub and Discord" },
  ];
  return <div className="shadow-lg rounded-lg p-8 my-8"></div>;
}
