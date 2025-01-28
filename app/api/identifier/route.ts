import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
    const identifiers = await prisma.identifiers.findMany();
    if (!identifiers) {
        return new Response(JSON.stringify({ error: "No identifiers found" }), {
            status: 404,
        });
    }
    return new Response(JSON.stringify(identifiers), {
        status: 200,
    });
}

export async function POST(request: Request) {
    const { identifier } = await request.json();
    const alreadyExists = await prisma.identifiers.findUnique({
        where: {
            identifier: identifier,
        },
    });
    if (alreadyExists) {
        return new Response(JSON.stringify({ error: "Identifier already exists" }), {
            status: 400,
        });
    }
    await prisma.identifiers.create({
        data: {
            identifier: identifier,
        },
    });
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
    });
}