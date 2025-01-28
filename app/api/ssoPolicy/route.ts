import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  const policies = await prisma.ssoPolicy.findMany();

  if (!policies) {
    return new Response("No policies found", { status: 404 });
  }

    return new Response(JSON.stringify(policies), { status: 200 });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { policyID} = body;
    
    if (!policyID) {
        return new Response("Missing required fields", { status: 400 });
    }
    
    const newPolicy = await prisma.ssoPolicy.create({
        data: {
        policyID,
        },
    });
    
    return new Response(JSON.stringify(newPolicy), { status: 201 });
    }