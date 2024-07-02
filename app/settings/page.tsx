import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import SettingsPage from "./settingsPage";

export default async function Page() {
    const users = await prisma.user.findMany();
    const session = await auth();
    const accessUser = session?.user;
    if (accessUser?.verifiedPolicy != "admin") { 
        redirect("/");
    }
    
    return (
        <SettingsPage />
      );
      
}