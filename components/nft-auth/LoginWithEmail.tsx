import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithMail } from "./loginActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface LoginWithEmailProps {
  onLoginSuccess: () => void;
  onLoginError: (error: string) => void;
}

export function LoginWithEmail({ onLoginSuccess, onLoginError }: LoginWithEmailProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await loginWithMail(email, password);
      if (result.success) {
        onLoginSuccess();
        router.push("/");
      } else {
        onLoginError(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Email login failed:", error);
      onLoginError("Email login failed");
    }
  }

  return (
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
  );
}