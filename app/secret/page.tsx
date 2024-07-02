import { useSession } from "next-auth/react";
import { auth } from "@/auth"
import { redirect } from "next/navigation";

const SessionChecker = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  if (session) {
    return (
      <div>
        <p>Logged in as {session.user.walletAddress}</p>
        <p>Wallet Network: {session.user.walletNetwork}</p>
        <p>Verified Policy: {session.user.verifiedPolicy}</p>
      </div>
    );
  }

  return <div>No session found</div>;
};

export default SessionChecker;