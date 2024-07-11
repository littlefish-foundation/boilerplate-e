import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import SettingsPage from "./settingsPage";
import { cookies } from 'next/headers';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export default async function Page() {
    const authToken = cookies().get('auth-token')?.value;

    if (!authToken) {
        redirect("/login");
    }

    const payload = await verifyToken(authToken);

    if (!payload || payload.verifiedPolicy !== "admin") {
        redirect("/");
    }

    const users = await prisma.user.findMany();
    
    return <SettingsPage/>;
}