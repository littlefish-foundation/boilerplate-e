"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const routes = [
  {
    id: "settings",
    name: "Settings",
    description: "Manage admin settings. This page is only accessible to users with the admin role.",
    href: "/settings",
    requiredRole: "admin"
  },
  {
    id: "reviewer",
    name: "Reviewer",
    description: "Access the reviewer page. This page is only accessible to users with the reviewer role.",
    href: "/demo/metadataDisplay/reviewer",
    requiredRole: "reviewer"
  }
];

interface MetadataDisplayClientProps {
  userRoles: string[];
}

export default function MetadataDisplayClient({ userRoles }: MetadataDisplayClientProps) {
  const router = useRouter();

  const hasAccess = (requiredRole: string | null) => {
    if (!requiredRole) return true;
    return userRoles.includes(requiredRole);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Available Pages</h1>

      <div className="flex overflow-x-auto space-x-6">
        {routes.map((route) => (
          <Card key={route.id} className="flex-shrink-0 w-80">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{route.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{route.description}</p>
            </CardContent>
            <CardFooter>
              {hasAccess(route.requiredRole) ? (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => router.push(route.href)}
                >
                  Access {route.name}
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Insufficient permissions
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>Current roles: {userRoles.join(', ') || 'No roles found'}</p>
      </div>
    </div>
  );
}