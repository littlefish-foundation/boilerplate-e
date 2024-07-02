import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import SettingsPage from "./settingsPage";

export default async function Page() {
    const users = await prisma.user.findMany();
    const session = await auth();
    const accessUser = session?.user;
    console.log("f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a".length)
    if (accessUser?.verifiedPolicy != "admin") { 
        redirect("/");
    }
    
    return (
        <SettingsPage />
      );
      
}