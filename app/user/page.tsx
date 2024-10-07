"use server"
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import prisma from "../lib/prisma";
import * as jose from 'jose';
import { convertHexToBech32, metadataReader, setConfig } from 'littlefish-nft-auth-framework/backend';

const getConfig = () => ({
    0: {
        // preprod
        apiKey: process.env.PREPROD_API_KEY,
        networkId: "preprod",
    },
    1: {
        // mainnet
        apiKey: process.env.MAINNET_API_KEY,
        networkId: "mainnet",
    },
    // Add other networks as needed
});

const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const MetadataBox = ({ data, user }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">SSO Metadata Information</div>
            <div className="divide-y divide-gray-200">
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Issuer:</p>
                    <p className="text-gray-600 break-all">{data.issuer}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Unique Identifier:</p>
                    <p className="text-gray-600 break-all">{data.uniqueIdentifier}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Policy ID:</p>
                    <p className="text-gray-600 break-all">{user.assets[0].policyID}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Is Transferable:</p>
                    {data.isTransferable ? <p className="text-gray-600">Yes</p> : <p className="text-gray-600">No</p>}
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Usage Limit:</p>
                    <p className="text-gray-600">{data.maxUsage}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Is Inactivity enabled:</p>
                    {data.isInactivityEnabled ? <p className="text-gray-600">Yes</p> : <p className="text-gray-600">No</p>}
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Inactivity Period:</p>
                    <p className="text-gray-600">{data.inactivityPeriod}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Tied Wallet:</p>
                    <p className="text-gray-600 break-all">{data.tiedWallet}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Created At:</p>
                    <p className="text-gray-600">{formatDate(data.issuanceDate)}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Expires At:</p>
                    <p className="text-gray-600">{formatDate(data.expirationDate)}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Roles:</p>
                    <p className="text-gray-600">{data.role}</p>
                </div>
            </div>
        </div>
    </div>
);

const SsoDataBox = ({ data, user }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">SSO Data Information</div>
            <div className="divide-y divide-gray-200">
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Policy ID:</p>
                    <p className="text-gray-600 break-all">{data.policyID}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Usage Count:</p>
                    <p className="text-gray-600">{data.usageCount}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Last Used:</p>
                    <p className="text-gray-600">{formatDate(data.lastUsed)}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Tied To:</p>
                    <p className="text-gray-600 break-all">{convertHexToBech32(data.tiedTo, 0)}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Created At:</p>
                    <p className="text-gray-600">{formatDate(data.createdAt)}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Updated At:</p>
                    <p className="text-gray-600">{formatDate(data.updatedAt)}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Roles:</p>
                    <p className="text-gray-600">{user.verifiedPolicy}</p>
                </div>
            </div>
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

    if (user?.email) {
        return (
            <div>
                <h1>{user?.email}</h1>
            </div>
        );
    }
    if (user?.walletAddress) {
        const config = getConfig();
        const networkConfig = config[0 as keyof typeof config];
        if (!networkConfig || !networkConfig.apiKey) {
            return new Response(JSON.stringify({ error: "Invalid network configuration" }), { status: 400 });
        }
        setConfig(networkConfig.apiKey, networkConfig.networkId);
        const metadata = await metadataReader(user.assets[0])
        console.log(user)
        return (
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                        <SsoDataBox key="Person 1 Information" data={user.ssoData[0]} user={user} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <MetadataBox key="Person 2 Information" data={metadata[0]} user={user} />
                    </div>
                </div>
            </div>
        );
    }
}