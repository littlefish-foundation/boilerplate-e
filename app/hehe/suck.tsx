import { auth } from "../../auth";

export default async function Hehe() {
    const session = await auth();
    if (session) {
      if (!session.user) return false;
  
      return true;
    }
  }