import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
    const policies = await prisma.policy.findMany();
    if (!policies) {
        return new Response(JSON.stringify({ error: "No policies found" }), {
            status: 404,
        });
    }
    return new Response(JSON.stringify(policies), {
        status: 200,
    });
}

export async function POST(request: Request) {
    const { policyID } = await request.json();
    if (policyID.length != 56) {
        return new Response(JSON.stringify({ error: "Invalid policy ID" }), {
            status: 400,
        });
    }
    const alreadyExists = await prisma.policy.findUnique({
        where: {
            policyID: policyID,
        },
    });
    if (alreadyExists) {
        return new Response(JSON.stringify({ error: "Policy already exists" }), {
            status: 400,
        });
    }
    await prisma.policy.create({
        data: {
            policyID: policyID,
        },
    });
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
    });
}