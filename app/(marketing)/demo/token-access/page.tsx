// Import necessary components and types
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

// Define the token interface
interface Token {
  id: string
  name: string
  description: string
  imageUrl: string
  price: string
}

// Sample token data
const tokens: Token[] = [
  {
    id: "basic",
    name: "Basic Access",
    description: "Perfect for getting started. Includes core features and basic support.",
    imageUrl: "/tokens/basic-token.png",
    price: "$9.99/mo"
  },
  {
    id: "pro",
    name: "Pro Access",
    description: "Advanced features for power users. Priority support included.",
    imageUrl: "/tokens/pro-token.png",
    price: "$19.99/mo"
  },
  {
    id: "enterprise",
    name: "Enterprise Access",
    description: "Full suite of features with dedicated support and custom solutions.",
    imageUrl: "/tokens/enterprise-token.png",
    price: "$49.99/mo"
  },
  {
    id: "free",
    name: "Free Access",
    description: "Perfect for getting started. Includes core features and basic support.",
    imageUrl: "/tokens/free-token.png",
    price: "Free"
  },
  {
    id: "enterprise",
    name: "Enterprise Access",
    description: "Full suite of features with dedicated support and custom solutions.",
    imageUrl: "/tokens/enterprise-token.png",
    price: "$49.99/mo"
  }
]

// Token selection page component
export default function TokenAccessPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Access Token</h1>
      
      {/* Horizontal scroll container */}
      <div className="flex overflow-x-auto space-x-6">
        {tokens.map((token) => (
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
              <p className="mt-4 text-lg font-bold">{token.price}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Select {token.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
