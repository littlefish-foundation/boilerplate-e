import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
    const users = await prisma.user.findMany();
    if (!users) {
        return new Response(JSON.stringify({ error: "No users found" }), {
            status: 404,
        });
    }
    return new Response(JSON.stringify(users), {
        status: 200,
    });
}

export async function POST(request: Request) {
    const { id } = await request.json();
    const user = await prisma.user.findUnique({
        where: { id: id },
    });

    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
        });
    }

    // Update the user verifiedPolicy
    const verifiedPolicy = "admin";
    if (user.verifiedPolicy === verifiedPolicy) {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { verifiedPolicy: null },
            });
            return new Response(JSON.stringify(updatedUser), {
                status: 200,
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Failed to update user" }), {
                status: 500,
            });
        }
    } else {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { verifiedPolicy },
            });
            return new Response(JSON.stringify(updatedUser), {
                status: 200,
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Failed to update user" }), {
                status: 500,
            });
        }
    }
}

export async function DELETE(request: Request) {
    const { id } = await request.json();

    if (!id) {
        return new Response(JSON.stringify({ error: "User ID is required" }), {
            status: 400,
        });
    }

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        // Delete the user's assets
        await prisma.asset.deleteMany({
            where: { UserId: id },
        });

        // Delete the user
        const deletedUser = await prisma.user.delete({
            where: { id: id },
        });

        return new Response(JSON.stringify(deletedUser), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to delete user and assets" }), {
            status: 500,
        });
    }
}