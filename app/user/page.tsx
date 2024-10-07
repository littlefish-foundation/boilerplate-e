import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import prisma from "../lib/prisma";
import * as jose from 'jose';

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

const InfoBox = ({ data }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">Policy Information</div>
            <div className="divide-y divide-gray-200">
                <div className="py-4">
                    <p className="text-gray-700 font-bold">ID:</p>
                    <p className="text-gray-600 break-all">{data.id}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Policy ID:</p>
                    <p className="text-gray-600 break-all">{data.policyID}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">User ID:</p>
                    <p className="text-gray-600 break-all">{data.UserId}</p>
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
                    <p className="text-gray-600 break-all">{data.tiedTo}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Created At:</p>
                    <p className="text-gray-600">{formatDate(data.createdAt)}</p>
                </div>
                <div className="py-4">
                    <p className="text-gray-700 font-bold">Updated At:</p>
                    <p className="text-gray-600">{formatDate(data.updatedAt)}</p>
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
                ssoData: true
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
        console.log(user.ssoData)
        return (
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                        <InfoBox key="Person 1 Information" data={user.ssoData[0]} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <InfoBox key="Person 2 Information" data={user.ssoData[0]} />
                    </div>
                </div>
            </div>
        );
    }
}