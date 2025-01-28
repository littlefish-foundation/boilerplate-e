"use client";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { useState } from "react";

export default function DemoPage() {
  const { connectWallet, wallets, disconnectWallet, isConnected, balance } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              🔒 NFT-Based Authentication Framework for Cardano
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Littlefish NFT Authentication
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A comprehensive framework for implementing NFT-based authentication in your Cardano applications. 
              Support for both traditional and wallet-based authentication methods.
            </p>
            <div className="space-x-4">
              {isConnected ? (
                <button 
                  onClick={disconnectWallet}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-destructive px-8 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 shadow-lg hover:shadow-destructive/20"
                >
                  Disconnect Wallet
                </button>
              ) : (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 shadow-lg hover:shadow-primary/20"
                >
                  Connect Wallet
                </button>
              )}
              <a href="https://github.com/littlefish-foundation/littlefish-nft-auth-framework/blob/main/README.md" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="w-full py-12 md:py-24 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter text-center">
              Framework Capabilities
            </h2>
            
            {/* Client Features */}
            <div className="w-full max-w-3xl space-y-4">
              <h3 className="text-xl font-semibold">Client-Side Features</h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <h4 className="font-medium">🔌 Wallet Integration</h4>
                  <p className="text-sm text-muted-foreground">Connect with popular Cardano wallets, manage wallet states, and handle assets seamlessly.</p>
                </div>
                <div>
                  <h4 className="font-medium">💳 Asset Management</h4>
                  <p className="text-sm text-muted-foreground">Decode and manage Cardano assets, verify ownership, and handle NFT metadata.</p>
                </div>
                <div>
                  <h4 className="font-medium">🎨 Ready-to-use Components</h4>
                  <p className="text-sm text-muted-foreground">WalletConnectButton and WalletConnectPage components for quick implementation.</p>
                </div>
              </div>
            </div>

            {/* Server Features */}
            <div className="w-full max-w-3xl space-y-4">
              <h3 className="text-xl font-semibold">Server-Side Features</h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div>
                  <h4 className="font-medium">🔐 Authentication Methods</h4>
                  <p className="text-sm text-muted-foreground">Support for both traditional (email/password) and NFT-based wallet authentication with built-in security measures.</p>
                </div>
                <div>
                  <h4 className="font-medium">✨ Advanced SSO</h4>
                  <p className="text-sm text-muted-foreground">Comprehensive SSO implementation with role-based access, usage limits, and expiration dates.</p>
                </div>
                <div>
                  <h4 className="font-medium">🛡️ Security Tools</h4>
                  <p className="text-sm text-muted-foreground">Built-in functions for wallet verification, asset ownership validation, and signature verification.</p>
                </div>
              </div>
            </div>

            {/* Authentication Options */}
            <div className="w-full max-w-3xl space-y-4">
              <h3 className="text-xl font-semibold">Authentication Capabilities</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Traditional Auth</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Email/Password authentication</li>
                    <li>• Password hashing & validation</li>
                    <li>• Secure session management</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">NFT-Based Auth</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Wallet signature verification</li>
                    <li>• Asset ownership validation</li>
                    <li>• Policy ID verification</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SSO Features */}
            <div className="w-full max-w-3xl space-y-4">
              <h3 className="text-xl font-semibold">SSO Metadata Features</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Core Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Expiration dates</li>
                      <li>• Usage limits</li>
                      <li>• Role-based access</li>
                      <li>• Transferability control</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Advanced Controls</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Inactivity periods</li>
                      <li>• Wallet binding</li>
                      <li>• Platform identifiers</li>
                      <li>• Custom metadata</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Dialog for wallet selection */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              {wallets.map((wallet, index) => (
                <button
                  key={index}
                  onClick={() => {
                    connectWallet(wallet);
                    setIsModalOpen(false);
                  }}
                  className="flex items-center space-x-2 p-4 rounded-lg hover:bg-muted"
                >
                  <img src={wallet.icon} alt={wallet.name} className="w-8 h-8" />
                  <span>{wallet.name}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}


