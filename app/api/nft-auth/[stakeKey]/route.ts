import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/app/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { stakeKey: string } }
) {
  const stakeKey = params.stakeKey;
  const { action, adaHandles, handleId } = await req.json();

  try {
    let user = await prisma.user.findUnique({
      where: { walletAddress: stakeKey },
      include: { adaHandles: true },
    });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await prisma.user.create({
        data: {
          walletAddress: stakeKey,
        },
        include: { adaHandles: true },
      });
    }

    if (action === 'getDefault') {
      // If adaHandles are provided, update or create them
      if (adaHandles && adaHandles.length > 0) {
        for (const handle of adaHandles) {
          await prisma.aDAHandle.upsert({
            where: { handleId: handle.id },
            update: { name: handle.name },
            create: { name: handle.name, handleId: handle.id, userId: user.id },
          });
        }
      }

      const defaultHandle = user.adaHandles.find(handle => handle.isDefault) || user.adaHandles[0];
      return NextResponse.json({
        defaultHandle: defaultHandle ? {
          name: defaultHandle.name,
          id: defaultHandle.handleId,
        } : null,
      });
    } else if (action === 'setDefault') {
      if (!handleId) {
        return NextResponse.json({ error: "Handle ID is required" }, { status: 400 });
      }

      // Set the specified handle as default
      await prisma.aDAHandle.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });

      await prisma.aDAHandle.update({
        where: { handleId: handleId, userId: user.id },
        data: { isDefault: true },
      });

      const updatedUser = await prisma.user.findUnique({
        where: { walletAddress: stakeKey },
        include: { adaHandles: true },
      });

      const defaultHandle = updatedUser?.adaHandles.find(handle => handle.isDefault);

      return NextResponse.json({
        defaultHandle: defaultHandle ? {
          name: defaultHandle.name,
          id: defaultHandle.handleId,
        } : null,
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing ADA Handle request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}