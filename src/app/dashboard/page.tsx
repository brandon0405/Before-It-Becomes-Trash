import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard-client";
import { getHistory, getStats } from "@/lib/db/repository";
import { requireAuthUser } from "@/lib/auth";

export default async function DashboardPage() {
  let user;

  try {
    user = await requireAuthUser();
  } catch {
    redirect("/auth/login?returnTo=/dashboard");
  }

  const [history, stats] = await Promise.all([getHistory(user), getStats(user)]);

  return <DashboardClient initialHistory={history} initialStats={stats} userName={user.name ?? "eco-rescuer"} />;
}
