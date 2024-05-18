"use client";

import {
  signupWithMail,
  signupWithCardano,
  generateNonce,
} from "@/app/(auth)/signup/signupActions";
import {
  signMessage,
  WalletConnectButton,
} from "littlefish-nft-auth-framework-beta/frontend";

import { useWallet } from "littlefish-nft-auth-framework-beta";

import { buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { type } from "os";
import TextShimmer from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof userAuthSchema>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    isConnected,
    connectWallet,
    disconnectWallet,
    wallets,
    connectedWalletId,
    isClient,
    networkID,
  } = useWallet();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const signInResult = await signupWithMail(data.email, data.password);

      setIsLoading(false);

      if (signInResult.error) {
        setErrorMessage(signInResult.error);
        toast.error("Something went wrong.", {
          description: signInResult.error,
        });
        return;
      }

      toast.success("Check your email", {
        description:
          "We sent you a login link. Be sure to check your spam too.",
      });

      // router.push("/login");
    } catch (error) {
      console.error("Unexpected error occurred:", error);
      setIsLoading(false);
      setErrorMessage("An unexpected error occurred.");
      toast.error("Something went wrong.", {
        description: "An unexpected error occurred.",
      });
    }
  }

  /*
  async function onSubmit(data: FormData) {
    setIsLoading(true);

    // TODO: Add signin using preferred provider
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const signInResult = { ok: true };
    setIsLoading(false);

    if (!signInResult?.ok) {
      return toast.error("Something went wrong.", {
        description: "Your sign in request failed. Please try again.",
      });
    }

    return toast.success("Check your email", {
      description: "We sent you a login link. Be sure to check your spam too.",
    });
  }
  */

  async function onSignInGithub() {
    setIsGitHubLoading(true);
    // TODO: Add signin using preferred provider
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGitHubLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading || isGitHubLoading}
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>This is your email address.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="********"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                      disabled={isLoading || isGitHubLoading}
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>Type your new password.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading || isGitHubLoading}
              onClick={() => {
                // onSignIn();
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Email
            </button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">WEB3</span>
        </div>
      </div>
      {isClient && wallets.length > 0 ? (
        <div className="mx-auto grid grid-cols-3 gap-4 sm:w-[350px]">
          {isConnected ? (
            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading}
              onClick={() => {
                disconnectWallet();
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              disconnect {connectedWalletId}
            </button>
          ) : (
            wallets.map((wallet: string) => (
              <div>
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "outline" }))}
                  disabled={isLoading}
                  onClick={() => {
                    connectWallet(wallet);
                  }}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <div className="group relative flex items-center">
                    <img
                      src={window.cardano[wallet].icon}
                      alt={wallet}
                      className={`mr-2 h-4 w-4 transition-filter duration-300 group-hover:grayscale-0 ${
                        !isConnected ? "grayscale" : ""
                      }`}
                    />
                    <span>
                      {wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                    </span>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <TextShimmer className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Obtain a Cardano Wallet</span>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </TextShimmer>
          </div>
        </div>
      )}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">SSO</span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          onSignInGithub();
        }}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </button>
    </div>
  );
}
