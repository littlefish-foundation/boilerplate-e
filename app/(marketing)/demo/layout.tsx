"use client"
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    // Refresh the page after logout
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-[4.5rem] left-4 z-50 p-2 rounded-md hover:bg-muted"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-background border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <a
                href="/demo"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive('/demo') ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                Demo Main Page
              </a>
            </li>
            <li>
              <a
                href="/demo/assets"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive('/demo/assets') ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                Assets Display
              </a>
            </li>
            <li>
              <a
                href="/demo/token-access"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive('/demo/token-access') ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                Token Access
              </a>
            </li>
            <li>
              {user?.walletAddress ? (
                <a
                  href="/demo/metadata"
                  className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive('/demo/metadata') ? 'bg-muted' : 'hover:bg-muted'}`}
                >
                  Metadata Display
                </a>
              ) : (
                <div className="relative group">
                  <p className="block px-4 py-2 text-sm transition-colors duration-200 text-muted-foreground cursor-not-allowed">
                    Metadata Display
                  </p>
                  <div className="absolute hidden group-hover:block w-60 p-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md -top-12 left-1/2 transform -translate-x-1/2">
                    Connect your wallet to view NFT metadata
                  </div>
                </div>
              )}
            </li>
            <li>
              <a
                href="/demo/metadataDisplay"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive('/demo/metadataDisplay') ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                Metadata Access
              </a>
            </li>
          </ul>
        </div>
        {user ?
          <div className="p-4 border-t border-border">
            <button
              className="text-sm text-muted-foreground text-center w-full"
              onClick={toggleDropdown}
            >
              User
            </button>
            {isDropdownOpen && (
              <ul className="mt-2 space-y-1">
                <li>
                  <a href="/user" className="block px-4 py-2 text-sm hover:bg-muted transition-colors duration-200">
                    Profile
                  </a>
                </li>
                {user?.roles?.includes("admin") ?
                  <li>
                    <a href="/settings" className="block px-4 py-2 text-sm hover:bg-muted transition-colors duration-200">
                      Admin Page
                    </a>
                  </li>
                  :
                  <li>
                    <p className="block px-4 py-2 text-sm transition-colors duration-200 text-muted-foreground">
                      Admin page
                    </p>
                  </li>}
                <li>
                  <button className="block px-4 py-2 text-sm hover:bg-muted transition-colors duration-200" onClick={() => handleLogout()}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div> : null}
      </div>
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex mt-16 bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="hidden lg:block w-64 shrink-0" />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
