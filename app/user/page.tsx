"use server"
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import prisma from "../lib/prisma";
import * as jose from 'jose';
import DeleteUserButton from '@/components/deleteUserButton';
// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, WalletIcon, MailIcon, NetworkIcon } from "lucide-react"; // Assuming we're using Lucide icons

// Create a InfoItem component for consistent styling
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center space-x-3 py-2">
    <div className="text-muted-foreground">{icon}</div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  </div>
);

export default async function UserPage() {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')
    if (!token) {
        redirect('/')
    }
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
    let payload;
    try {
        ({ payload } = await jose.jwtVerify(token.value, JWT_SECRET))
    } catch (error) {
        redirect('/')
    }
    console.log(payload.roles)

    const user = await prisma.user.findFirst(
        {
            where: {
                id: payload.id
            },
            include: {
                ssoData: true,
                assets: true
            }
        }
    );
    
    if (!user) {
        return (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-xl text-muted-foreground">User not found</p>
          </div>
        );
    }

    return (
        <div className="container max-w-3xl mx-auto p-6 space-y-8">
            {/* Profile Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
                <p className="text-muted-foreground">
                    Manage your account details and preferences
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Account Information</span>
                        <div className="flex gap-2 flex-wrap">
                            {Array.isArray(user.roles) ? (
                                user.roles.map((role, index) => (
                                    <Badge key={index} variant="default">
                                        {role}
                                    </Badge>
                                ))
                            ) : (
                                <Badge variant="secondary">Not Verified</Badge>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Info */}
                    {user.email && (
                        <InfoItem
                            icon={<MailIcon className="h-5 w-5" />}
                            label="Email Address"
                            value={user.email}
                        />
                    )}

                    {/* Wallet Info */}
                    {user.walletAddress && (
                        <>
                            <div className="border-t pt-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Wallet Details</h3>
                                    <InfoItem
                                        icon={<WalletIcon className="h-5 w-5" />}
                                        label="Wallet Address"
                                        value={user.walletAddress}
                                    />
                                    <InfoItem
                                        icon={<NetworkIcon className="h-5 w-5" />}
                                        label="Network"
                                        value={String(user.walletNetwork || 'Not specified')}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Timestamps */}
                    <div className="border-t pt-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Account Timeline</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                    icon={<CalendarIcon className="h-5 w-5" />}
                                    label="Created At"
                                    value={new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                />
                                <InfoItem
                                    icon={<CalendarIcon className="h-5 w-5" />}
                                    label="Last Updated"
                                    value={new Date(user.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t pt-6">
                        <h3 className="text-red-500 font-semibold mb-4">Danger Zone</h3>
                        <DeleteUserButton 
                            user={{...user, roles: user.roles || '', walletAddress: user.walletAddress || ''}}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}