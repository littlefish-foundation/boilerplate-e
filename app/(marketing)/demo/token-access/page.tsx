"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useWallet } from "littlefish-nft-auth-framework/frontend"
import { useRouter } from "next/navigation"

// Define the token interface
interface Token {
  id: string
  name: string
  description: string
  imageUrl: string
  href: string
}

interface Policy {
  id: string;
  policyID: string;
  createdAt: string;
  updatedAt: string;
}

// Sample token data
const tokens: Token[] = [
  {
    id: "adaHandle",
    name: "ADA Handle",
    description: "You can use your ADA Handle to access this page.",
    imageUrl: "/tokens/adaHandle.webp",
    href: "/demo/token-access/asset1"
  },
  {
    id: "hosky",
    name: "Hosky",
    description: "You can use your Hosky NFT to access this page.",
    imageUrl: "/tokens/hosky.webp",
    href: "/demo/token-access/asset2"
  }
]

// Token selection page component
export default function TokenAccessPage() {
  const { assets } = useWallet()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Fetch policies when component mounts
    const fetchPolicies = async () => {
      try {
        const response = await fetch(`/api/policy`)
        if (!response.ok) {
          throw new Error(`Failed to fetch policies: ${response.statusText}`)
        }
        const data: Policy[] = await response.json()
        setPolicies(data)
      } catch (error) {
        console.error('Failed to fetch policies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  const hasAccess = (index: number) => {
    return assets.find(asset => policies[index]?.policyID === asset.policyID)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Access Token</h1>

      {/* Horizontal scroll container */}
      <div className="flex overflow-x-auto space-x-6">
        {tokens.map((token, index) => (
          <Card key={token.id} className="flex-shrink-0 w-80">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{token.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {/* Image container with fixed aspect ratio */}
              <div className="relative w-full aspect-square mb-4">
                <Image
                  src={token.imageUrl}
                  alt={token.name}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
              <p className="text-muted-foreground">{token.description}</p>
            </CardContent>
            <CardFooter>
              {isLoading ? (
                <Button className="w-full" size="lg" disabled>
                  Loading...
                </Button>
              ) : hasAccess(index) ? (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => router.push(token.href)}
                >
                  Select {token.name}
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  You don't have access to this token
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
