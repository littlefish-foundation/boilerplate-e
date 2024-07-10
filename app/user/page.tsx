import prisma from "../lib/prisma";

interface User {
    id: string;
    name: string;
    walletAddress: string;
    walletNetwork: number;
    createdAt: string;
}

export default async function UserPage() {
    const user = await prisma.user.findUnique(
        {
            where: {
                id: "1",
            },
        }
    );
}
