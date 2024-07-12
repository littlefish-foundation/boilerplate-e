"use client";

import { buttonVariants } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlignJustify, XIcon, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import ModeToggle from "@/components/ui/mode-toggle";
import { useTheme } from "next-themes";
import LoginComponent from "@/components/nft-auth/login";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

const menuItem = [
  {
    id: 2,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: 1,
    label: "Framework Demo",
    href: "/assets",
  },
  {
    id: 3,
    label: "ADA Handle Access",
    href: "/asset1",
  },
  {
    id: 4,
    label: "HOSKY Access",
    href: "/asset2",
  }
];

export function SiteHeader() {
  const { isConnected, balance } = useWallet();
  const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { theme } = useTheme();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setIsLoggedIn(false);
    }
    if (!loading && user){
      setIsLoggedIn(true);
    }
  }, [user, loading]);

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) html.classList.toggle("overflow-hidden", hamburgerMenuIsOpen);
  }, [hamburgerMenuIsOpen]);

  useEffect(() => {
    const closeHamburgerNavigation = () => setHamburgerMenuIsOpen(false);
    window.addEventListener("orientationchange", closeHamburgerNavigation);
    window.addEventListener("resize", closeHamburgerNavigation);
    return () => {
      window.removeEventListener("orientationchange", closeHamburgerNavigation);
      window.removeEventListener("resize", closeHamburgerNavigation);
    };
  }, [setHamburgerMenuIsOpen]);

  const formatBalance = (balance: number): string => {
    const formattedBalance = (balance / 1_000_000).toFixed(2);
    return `₳ ${formattedBalance}`;
  };

  const formattedBalance = formatBalance(balance);

  const handleLogout = async () => {
    await logout();
    // Refresh the page after logout
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <>
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <header className="fixed left-0 top-0 z-50 w-full translate-y-[-1rem] animate-fade-in border-b opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]">
          <div className="container flex h-[3.5rem] items-center justify-between">
            <Link className="text-md flex items-center" href="/">
              <img src={theme === 'dark' ? "/logo1.png" : "/logo1d.png"} alt="littlefishs" className="w-42 h-10" />
            </Link>
            <div className="flex-grow justify-center items-center gap-x-8 hidden md:flex">
              {menuItem.map((item) => (
                <motion.li
                  variants={{
                    initial: { y: "-20px", opacity: 0 },
                    open: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.3, ease: "easeOut" },
                    },
                  }}
                  key={item.id}
                  className="flex h-full items-center hover:text-electric-violet-500"
                >
                  <Link
                    className={`hover:text-grey flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${hamburgerMenuIsOpen ? "[&_a]:translate-y-0" : ""}`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </div>
            <div className="ml-auto flex h-full items-center">
              {status === "loading" ? (
                <div>Loading...</div>
              ) : (isLoggedIn && user) ? (
                <>
                  <div className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mr-6 text-sm flex items-center"
                  )}>
                    <User size={16} className="mr-2" />
                    <span>{'User'}</span>
                  </div>
                  {user.verifiedPolicy === "admin" && (
                    <Link
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "mr-6 text-sm"
                      )}
                      href="/settings"
                    >
                      Settings
                    </Link>
                  )}
                  <button
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "mr-6 text-sm"
                    )}
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mr-6 text-sm"
                    )}
                    href="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mr-6 text-sm"
                    )}
                    href="/signup"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {isConnected ? (
                <DialogTrigger asChild>
                  <button
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mr-6 text-sm"
                    )}
                  >
                    <span className="mr-2">{formattedBalance}</span>
                    <LogOut size={16} />
                  </button>
                </DialogTrigger>
              ) : (
                <button
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mr-6 text-sm"
                  )}
                  onClick={() => setIsWalletModalOpen(true)}
                >
                  Connect Wallet
                </button>
              )}
              <ModeToggle />
            </div>
            <button
              className="ml-6 md:hidden"
              onClick={() => setHamburgerMenuIsOpen((open) => !open)}
            >
              <span className="sr-only">Toggle menu</span>
              {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
            </button>
          </div>
        </header>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isConnected ? `Disconnect: ${formattedBalance}` : 'Connect Wallet'}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <LoginComponent 
              showBackButton={false}  
              className="mt-4" 
              action={isConnected ? 'disconnect' : 'connect'}
              onClose={() => setIsWalletModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        <motion.nav
          initial="initial"
          exit="exit"
          variants={{
            initial: { opacity: 0, scale: 1 },
            animate: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.2, ease: "easeOut" },
            },
            exit: {
              opacity: 0,
              transition: { duration: 0.2, delay: 0.2, ease: "easeOut" },
            },
          }}
          animate={hamburgerMenuIsOpen ? "animate" : "exit"}
          className={`fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-background/70 backdrop-blur-[12px] ${hamburgerMenuIsOpen ? "" : "pointer-events-none"}`}
        >
          <div className="container flex h-[3.5rem] items-center justify-between">
            <Link className="text-md flex items-center" href="/">
              Littlefish Foundation
            </Link>
            <button
              className="ml-6 md:hidden"
              onClick={() => setHamburgerMenuIsOpen((open) => !open)}
            >
              <span className="sr-only">Toggle menu</span>
              {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
            </button>
          </div>
          <motion.ul
            className={`flex flex-col md:flex-row md:items-center uppercase md:normal-case ease-in`}
            variants={{ open: { transition: { staggerChildren: 0.06 } } }}
            initial="initial"
            animate={hamburgerMenuIsOpen ? "open" : "exit"}
          >
            {menuItem.map((item) => (
              <motion.li
                variants={{
                  initial: { y: "-20px", opacity: 0 },
                  open: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
                key={item.id}
                className="border-grey-dark pl-6 py-0.5 border-b md:border-none"
              >
                <Link
                  className={`hover:text-grey flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${hamburgerMenuIsOpen ? "[&_a]:translate-y-0" : ""}`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.nav>
      </AnimatePresence>
    </>
  );
}