// components/SessionChecker.tsx
"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SessionChecker = () => {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session Data:", session);

    if (status === "authenticated" && !session) {
      setError("Session is authenticated but no session data found");
    }

    // Check if session exists but doesn't have expected properties
    if (session && (!session.user || !session.user.walletAddress)) {
      setError("Session exists but missing expected properties");
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading... (Status: {status})</div>;
  }

  if (status === "unauthenticated") {
    return <div>You are not logged in (Status: {status})</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (session && session.user) {
    return (
      <div>
        <p>Logged in as {session.user.walletAddress || 'Unknown'}</p>
        <p>Wallet Network: {session.user.walletNetwork || 'Unknown'}</p>
        <p>Verified Policy: {session.user.verifiedPolicy || 'Unknown'}</p>
        <pre>Full Session Data: {JSON.stringify(session, null, 2)}</pre>
      </div>
    );
  }

  return <div>Unexpected state: authenticated but no valid session data</div>;
};

export default SessionChecker;