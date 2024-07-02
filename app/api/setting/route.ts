import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
    const setting = await prisma.settings.findFirst();
    if (!setting) {
        return new Response(JSON.stringify({ error: "No settings found" }), {
            status: 404,
        });
    }
    return new Response(JSON.stringify(setting.strictPolicy), {
        status: 200,
    });
}

export async function POST(request: Request) {
    const { strictPolicy } = await request.json();
    const setting = await prisma.settings.findFirst();
    if (setting && strictPolicy === setting.strictPolicy) {
        return new Response(JSON.stringify({ error: "No change needed" }), {
            status: 400,
        });
    }
    if (setting) {
        const newSetting = await prisma.settings.update({
            where: {
                id: setting.id,
            },
            data: {
                strictPolicy,
            },
        });
    } else {
        const newSetting = await prisma.settings.create({
            data: {
                strictPolicy,
            },
        });
    }
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
    });
}