"use client";

import { buttonVariants } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlignJustify, XIcon, LogOut, User, Wallet, Settings, CreditCard  } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";
import ModeToggle from "@/components/ui/mode-toggle";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import LoginComponent from "@/components/nft-auth/login";
import { loginWithMail } from "@/components/nft-auth/loginActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Description } from "@radix-ui/react-dialog";


const ADA_HANDLE_POLICY_ID = "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a";
const HOSKY_POLICY_ID = "a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235";

function hexToAscii(hex: string): string {
  let ascii = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    if (charCode > 32 && charCode < 127) {
      ascii += String.fromCharCode(charCode);
    }
  }
  return ascii.replace(/^[^a-zA-Z0-9]+/, '');
}

export function SiteHeader() {
  const { isConnected, balance, addresses, wallets, connectedWallet, assets, networkID} = useWallet();
  const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { theme } = useTheme();
  const { user, loading, logout, refreshUser } = useAuth();
  const [adaHandle, setAdaHandle] = useState<string | null>(null);
  const [hasHoskyToken, setHasHoskyToken] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState({ type: "", content: "" });
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  
  const stakeAddress = addresses && addresses.length > 0 ? convertHexToBech32(addresses[0], 1) : ''
  



  const router = useRouter();

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) html.classList.toggle("overflow-hidden", hamburgerMenuIsOpen);
  }, [hamburgerMenuIsOpen]);

  useEffect(() => {
    const findAdaHandleAndHosky = async () => {
      if (isConnected && assets && assets.length > 0 && stakeAddress) {
        const adaHandleAssets = assets.filter(asset => asset.policyID === ADA_HANDLE_POLICY_ID);
        const adaHandles = adaHandleAssets.map(asset => ({
          name: hexToAscii(asset.assetName),
          id: asset.assetName
        }));
  
        console.log('ADA Handles:', adaHandles);
  
        if (adaHandles.length > 0) {
          try {
            const response = await fetch(`/api/nft-auth/${stakeAddress}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'getDefault',
                adaHandles: adaHandles
              }),
            });
  
            if (response.ok) {
              const data = await response.json();
              if (data.defaultHandle) {
                setAdaHandle(data.defaultHandle.name);
              } else if (adaHandles.length > 0) {
                setAdaHandle(adaHandles[0].name);
                // If no default handle is set, set the first one as default
                await fetch(`/api/nft-auth/${stakeAddress}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    action: 'setDefault',
                    handleId: adaHandles[0].id
                  }),
                });
              } else {
                setAdaHandle(null);
              }
            } else {
              console.error('Failed to fetch ADA handles');
              setAdaHandle(null);
            }
          } catch (error) {
            console.error('Error fetching ADA handles:', error);
            setAdaHandle(null);
          }
        } else {
          setAdaHandle(null);
        }
  
        const hoskyAsset = assets.find(asset => asset.policyID === HOSKY_POLICY_ID);
        setHasHoskyToken(!!hoskyAsset);
      } else {
        setAdaHandle(null);
        setHasHoskyToken(false);
      }
    };
  
    findAdaHandleAndHosky();
  }, [isConnected, assets, stakeAddress]);

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
    setAdaHandle(null);
    setHasHoskyToken(false);
    setIsWalletModalOpen(false);
    router.push('/');
  };

  const getWalletLogo = () => {
    if (isConnected && connectedWallet) {
      const wallet = wallets.find(w => w.name === connectedWallet.name);
      return wallet ? wallet.icon : null;
    }
    return null;
  };

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginMessage({ type: "", content: "" });
    try {
      const result = await loginWithMail(email, password);
      if (result.success) {
        setLoginMessage({ type: "success", content: "Login Successful" });
        setIsLoginDropdownOpen(false);
        await refreshUser();
        // router.push('/dashboard');
      } else {
        setLoginMessage({ type: "error", content: result.error || "Login failed" });
      }
    } catch (error) {
      console.error("Email login failed:", error);
      setLoginMessage({ type: "error", content: "An unexpected error occurred during login" });
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes glowing-connected {
          0% { box-shadow: 0 0 5px #00ff00; }
          50% { box-shadow: 0 0 20px #00ff00; }
          100% { box-shadow: 0 0 5px #00ff00; }
        }
        @keyframes glowing-disconnected {
          0% { box-shadow: 0 0 5px #ff4500; }
          50% { box-shadow: 0 0 10px #ff4500; }
          100% { box-shadow: 0 0 5px #ff4500; }
        }
        .glow-button-connected {
          animation: glowing-connected 7s infinite;
          transition: all 0.3s ease;
        }
        .glow-button-disconnected {
          box-shadow: 0 0 5px #ff4500;
          transition: all 0.3s ease;
        }
        .glow-button-connected:hover, .glow-button-disconnected:hover {
          animation: none;
          box-shadow: 0 0 20px #00ff00;
        }
        .glow-button-disconnected {
          animation: glowing-disconnected 3s infinite;
          transition: all 0.3s ease;
        }
        .glow-button-disconnected:hover {
          animation: none;
          box-shadow: 0 0 20px #ff4500;
        }
        .glow-ada-handle {
          animation: glowing-connected 3s infinite;
        }
        .glow-hosky {
          animation: glowing-connected 3s infinite;
        }
      `}</style>
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <header className="fixed left-0 top-0 z-50 w-full translate-y-[-1rem] animate-fade-in border-b opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]">
          <div className="container flex h-[3.5rem] items-center justify-between">
            <Link className="text-md flex items-center" href="/">
              <img src={theme === 'dark' ? "/logo1.png" : "/logo1d.png"} alt="littlefishs" className="w-42 h-10" />
            </Link>
            
            <div className="ml-auto flex h-full items-center">
              {loading ? (
                <div className="mr-6 text-sm">Checking session...</div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "mr-6 text-sm flex items-center glow-button-connected"
                      )}
                    >
                      <User size={16} className="mr-2" />
                      <span>{user.email || 'User'}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    {/* New ADA Handle Access item */}
                    <DropdownMenuItem
                      className={cn(!adaHandle && "text-gray-400 cursor-not-allowed")}
                      onClick={() => adaHandle && router.push('/asset1')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>ADA Handle Access</span>
                    </DropdownMenuItem>
                    {/* New HOSKY Access item */}
                    <DropdownMenuItem
                      className={cn(!hasHoskyToken && "text-gray-400 cursor-not-allowed")}
                      onClick={() => hasHoskyToken && router.push('/asset2')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>HOSKY Access</span>
                    </DropdownMenuItem>
                    {user.verifiedPolicy === "admin" && (
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <Link href="/settings">Admin Settings</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                 <DropdownMenu open={isLoginDropdownOpen} onOpenChange={setIsLoginDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mr-6 text-sm glow-button-disconnected"
                )}
              >
                Login
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Login with Email
                </Button>
              </form>
              {loginMessage.content && (
                <div className={`w-full p-2 mt-4 text-center rounded text-sm ${
                  loginMessage.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}>
                  {loginMessage.content}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        
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
                      "mr-6 text-sm glow-button-connected"
                    )}
                  >
                    {getWalletLogo() ? (
                      <img src={getWalletLogo()!} alt="Wallet Logo" className="w-4 h-4 mr-2" />
                    ) : (
                      <Wallet size={16} className="mr-2" />
                    )}
                    <span className="mr-2">{adaHandle ? `$${adaHandle}` : 'No ADA Handle'}</span>
                    <LogOut size={16} />
                  </button>
                </DialogTrigger>
              ) : (
                <DialogTrigger asChild>
                  <button
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mr-6 text-sm glow-button-disconnected"
                    )}
                  >
                    <Wallet size={16} className="mr-2" />
                    Connect Wallet
                  </button>
                </DialogTrigger>
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
          <Description>{isConnected ? `${adaHandle ? `$${adaHandle}` : 'No ADA Handle'}` : 'Connect Wallet'}</Description>
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  {isConnected ? `Disconnect from ${adaHandle ? `$${adaHandle}` : 'your Cardano Wallet'}` : 'Connect Wallet'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to disconnect your wallet?
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4">
            <LoginComponent 
              showBackButton={false}  
              className="mt-4" 
              action={isConnected ? 'disconnect' : 'connect'}
              onClose={() => setIsWalletModalOpen(false)}
              onDisconnect={handleLogout}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent>
        <Description>Login</Description>
          <DialogHeader>
            <DialogTitle>
            <div className="flex flex-col items-center">
          <img
            className="w-32 h-32 mb-4"
            src="/findtheblackfish.png"
            alt="littlefish logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            Login to littlefish
          </h2>
        </div>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Login with Email
            </Button>
          </form>
          {loginMessage.content && (
            <div className={`w-full p-2 mt-4 text-center rounded ${
              loginMessage.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              {loginMessage.content}
            </div>
          )}
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
          
        </motion.nav>
      </AnimatePresence>
    </>
  );
}