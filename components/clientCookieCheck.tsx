"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CookieCheck = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkCookies = () => {
      // Try to set a test cookie
      document.cookie = "cookieTest=1; SameSite=Strict; Secure";
      const cookieEnabled = document.cookie.indexOf("cookieTest=") !== -1;

      // Clean up the test cookie
      document.cookie = "cookieTest=1; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      setCookiesEnabled(cookieEnabled);

      if (!cookieEnabled) {
        router.push('/cookies-required');
      }
    };

    checkCookies();
  }, [router]);

  // Don't render anything, this component is just for the side effect
  return null;
};

export default CookieCheck;