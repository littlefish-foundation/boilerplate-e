import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const footerNavs = [
  {
    label: "Product",
    items: [
      {
        href: "https://tools.littlefish.foundation/littlefish-research-hub",
        name: "Littlefish Research",
      },
      {
        href: "https://vault.littlefish.foundation/Littlefish+Vault",
        name: "Vault",
      },
    ],
  },

  {
    label: "Community",
    items: [
      {
        href: "https://discord.gg/FhW2xH6c",
        name: "Discord",
      },
      {
        href: "https://x.com/littlefishDAO",
        name: "𝕏",
      },
    ],
  },
];

const footerSocials = [
  {
    href: "https://discord.gg/FhW2xH6c",
    name: "Discord",
    icon: <DiscordLogoIcon className="h-4 w-4" />,
  },
  {
    href: "https://x.com/littlefishDAO",
    name: "X",
    icon: <TwitterLogoIcon className="h-4 w-4" />,
  },
];

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
        <div className="md:flex md:justify-between px-8 p-4 py-16 sm:pb-16 gap-4">
          <div className="mb-12 flex-col flex gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="findthefish.png" className="h-8 w-8 text-primary" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                littlefish
              </span>
            </Link>
            <p className="max-w-xs">Reinventing Remote Work</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h2 className="mb-6 text-sm tracking-tighter font-medium text-gray-900 uppercase dark:text-white">
                  {nav.label}
                </h2>
                <ul className="gap-2 grid">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="cursor-pointer text-gray-400 hover:text-gray-200 duration-200 font-[450] text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex sm:items-center sm:justify-between border-t xl:border rounded-md border-dashed border-neutral-700/20 py-4 px-8 gap-2">
          <div className="flex space-x-5 sm:justify-center sm:mt-0">
            {footerSocials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600 fill-gray-500 hover:fill-gray-900 dark:hover:fill-gray-600"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            Copyright © {new Date().getFullYear()}{" "}
            <Link href="/" className="cursor-pointer">
              littlefish Fondation
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
      {/*   <SiteBanner /> */}
    </footer>
  );
}
