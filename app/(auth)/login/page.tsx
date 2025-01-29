"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithMail, loginWithCardano, generateNonce, loginWithAsset } from "./loginActions";
import { signMessage, useWallet, Asset } from "littlefish-nft-auth-framework/frontend";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Mail, Wallet, ChevronLeft } from "lucide-react";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";

interface Policy {
  id: string;
  policyID: string;
  createdAt: string;
  updatedAt: string;
}

async function PolicyList() {
  const response = await fetch("/api/ssoPolicy");
  const data: Policy[] = await response.json();
  return data;
}

const handleSubmit = async (networkID: number, addresses: string[]) => {
  const formData = {
    walletNetwork: networkID,
    stakeAddress: addresses[0],
  };

  if (!formData.walletNetwork || !formData.stakeAddress) {
    return;
  }

  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

async function handleSign(walletID: string, isConnected: boolean, walletAddress: string): Promise<[string, string] | void> {

  const nonceResponse = await generateNonce();
  if (!nonceResponse) {
    console.error("Failed to generate nonce");
    return;
  }

  const nonce = nonceResponse;

  try {
    const signResponse = await signMessage(walletID, isConnected, nonce, walletAddress);
    if (!signResponse) {
      console.error("Failed to sign message");
      return;
    }
    return signResponse;
  } catch (error) {
    console.error("Error signing message:", error);
  }
}

export default function LoginPage() {
  const {
    isConnected,
    connectedWallet,
    networkID,
    addresses,
    assets,
    decodeHexToAscii,
    wallets,
    connectWallet,
    disconnectWallet
  } = useWallet();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const [decodedAssets, setDecodedAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState("email");
  const [ssoAssets, setSSOAssets] = useState<Asset[]>([]);
  const [nonSsoAssets, setNonSsoAssets] = useState<Asset[]>([]);
  const [isRequestingToken, setIsRequestingToken] = useState(false);

  useEffect(() => {
    if (assets.length > 0) {
      setDecodedAssets(decodeHexToAscii(assets));
    }
  }, [assets, decodeHexToAscii]);

  useEffect(() => {
    let isMounted = true;
    const fetchPoliciesAndFilterAssets = async () => {
      try {
        const data = await PolicyList();
        if (!isMounted) return;

        const policyIDs = new Set(data.map((policy: Policy) => policy.policyID));

        const [ssoAssets, nonSsoAssets] = assets.reduce(
          ([sso, nonSso], asset) => {
            if (policyIDs.has(asset.policyID)) {
              sso.push(asset);
            } else {
              nonSso.push(asset);
            }
            return [sso, nonSso];
          },
          [[], []] as [Asset[], Asset[]]
        );

        setSSOAssets(ssoAssets);
        setNonSsoAssets(nonSsoAssets);
      } catch (error) {
        console.error("Failed to fetch policies or filter assets:", error);
      }
    };

    fetchPoliciesAndFilterAssets();

    return () => {
      isMounted = false;
    };
  }, [assets]);

  useEffect(() => {
    if (!isConnected) {
      setDecodedAssets([]);
    }
  }, [isConnected]);

  const handleBack = () => {
    router.back();
  };

  async function handleCardanoLogin(sso: boolean, asset?: Asset) {
    if (connectedWallet) {
      try {
        const signResponse = await handleSign(connectedWallet.name, isConnected, addresses[0]);
        if (signResponse) {
          const [key, signature] = signResponse;
          let result;
          if (asset) {
            result = await loginWithAsset(addresses[0], networkID, key, signature, asset, sso);
          } else {
            result = await loginWithCardano(addresses[0], networkID, key, signature);
          }
          if (result.success) {
            setMessage({ type: "success", content: "Login Successful" });
            router.push("/");
          } else {
            setMessage({ type: "error", content: result.error || "Login failed" });
          }
        }
      } catch (error) {
        console.error("Failed to handle Cardano login:", error);
        setMessage({ type: "error", content: "Failed to handle Cardano login" });
      }
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await loginWithMail(email, password);
      if (result.success) {
        setMessage({ type: "success", content: "Login Successful" });
        router.push("/");
      } else {
        setMessage({ type: "error", content: result.error || "Login failed" });
      }
    } catch (error) {
      console.error("Email login failed:", error);
      setMessage({ type: "error", content: "Email login failed" });
    }
  }

  async function handleRequestToken() {
    if (!isConnected || !addresses[0]) {
      setMessage({ type: "error", content: "Please connect your wallet first" });
      return;
    }

    setIsRequestingToken(true);
    setMessage({ type: "", content: "" });

    const formData = {
      walletNetwork: networkID,
      stakeAddress: convertHexToBech32(addresses[0], 0),
    };

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to request token');
      }

      const data = await response.json();
      setMessage({ type: "success", content: "Token request successful. You will receive the token in less than 24 hours, check your wallet." });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: "error", content: "Failed to request token. Please try again." });
    } finally {
      setIsRequestingToken(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black p-4">
      <Button
        onClick={handleBack}
        className="absolute left-4 top-4 flex items-center mt-12"
        variant="ghost"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <img
            className="w-32 h-32 mb-4"
            src="/findtheblackfish.png"
            alt="littlefish logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            Login to LittleFish
          </h2>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
              </TabsList>
              <TabsContent value="email">
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
              </TabsContent>
              <TabsContent value="wallet">
                <div className="space-y-4">
                  {isConnected && connectedWallet ? (
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center">
                        <img className="w-6 h-6 mr-2 bg-gray-300 rounded-full" src={connectedWallet.icon} alt={connectedWallet.name} />
                        <span>{connectedWallet.name}</span>
                      </div>
                      <Button onClick={disconnectWallet} variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Connect Wallet</Label>
                      {wallets === null ? (
                        <div className="text-center text-muted-foreground">No wallets found</div>
                      ) : wallets.map((wallet) => (
                        <Button
                          key={wallet.name}
                          onClick={() => connectWallet(wallet)}
                          className="w-full flex items-center justify-start"
                        >
                          <img className="w-6 h-6 mr-2 bg-gray-300 rounded-full" src={wallet.icon} alt={wallet.name} />
                          <span>{wallet.name}</span>
                        </Button>
                      ))}

                    </div>
                  )}
                  <Button
                    onClick={() => handleCardanoLogin(false)}
                    className="w-full"
                    disabled={!isConnected}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {isConnected ? "Login with Wallet" : "Connect Wallet to Login"}
                  </Button>
                  {isConnected && decodedAssets.length > 0 && (
                    <div className="space-y-2">
                      <Label>Login with Asset</Label>
                      {nonSsoAssets.map((asset, index) => {
                        const assetIndex = assets.findIndex(a => a.policyID === asset.policyID && a.assetName === asset.assetName);
                        return (
                          <Button
                            key={asset.policyID + asset.assetName}
                            onClick={() => handleCardanoLogin(false, asset)}
                            className="w-full mb-2"
                          >
                            {assetIndex !== -1 ? decodedAssets[assetIndex].assetName : asset.assetName}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  {isConnected && ssoAssets.length > 0 && (
                    <div className="space-y-2">
                      <Label>SSO</Label>
                      {ssoAssets.map((asset, index) => {
                        const assetIndex = assets.findIndex(a => a.policyID === asset.policyID && a.assetName === asset.assetName);
                        return (
                          <Button
                            key={asset.policyID + asset.assetName}
                            onClick={() => handleCardanoLogin(true, asset)}
                            className="w-full mb-2"
                          >
                            {assetIndex !== -1 ? decodedAssets[assetIndex].assetName : asset.assetName}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  <Button
                    onClick={handleRequestToken}
                    className="w-full"
                    disabled={!isConnected || isRequestingToken}
                  >
                    {isRequestingToken ? "Requesting..." : "Request a Demo Token(Preprod only)"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            {message.content && (
              <div className={`w-full p-2 text-center rounded ${message.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}>
                {message.content}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
