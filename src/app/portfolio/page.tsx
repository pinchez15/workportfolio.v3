import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PortfolioPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/");
  }

  // For now, redirect to a placeholder portfolio
  // In the future, this will fetch the user's portfolio data and redirect to /username
  const username = user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0] || `user_${userId.slice(0, 8)}`;
  
  redirect(`/${username}`);
} 