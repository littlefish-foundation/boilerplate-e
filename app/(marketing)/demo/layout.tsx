"use client"
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  if (user) {
    if (user.walletAddress) {
      console.log(user?.walletAddress);
    } else {
      console.log(user.email);
    }
  }

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
    <div className="fixed w-64 h-[calc(100vh-4rem)] bg-background border-r border-border flex flex-col">
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
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
            <a
              href="#item3"
              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive('#item3') ? 'bg-muted' : 'hover:bg-muted'}`}
            >
              Metadata Display
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
                <a href="#profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors duration-200">
                  Profile
                </a>
              </li>
              <li>
                <a href="#settings" className="block px-4 py-2 text-sm hover:bg-muted transition-colors duration-200">
                  Settings
                </a>
              </li>
              <li>
                <button className="block px-4 py-2 text-sm hover:bg-muted transition-colors duration-200" onClick={() => handleLogout()}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div> : null}

    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex mt-16 bg-background">
      <Sidebar />
      <div className="w-64 shrink-0" />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
