// components/SessionChecker.tsx
"use client"
import { useSession } from "next-auth/react";

const SessionChecker = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>You are not logged in</div>;
  }

  if (session) {
    return (
      <div>
        <p>Logged in as {session.user.walletAddress ? session.user.walletAddress : session.user.email}</p>
        <p>Wallet Network: {session.user.walletNetwork}</p>
        <p>Verified Policy: {session.user.verifiedPolicy}</p>
      </div>
    );
  }

  return <div>No session found</div>;
};

export default SessionChecker;
