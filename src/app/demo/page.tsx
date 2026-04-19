import { DashboardClient } from "@/components/dashboard-client";
import { DEMO_HISTORY, DEMO_STATS, DEMO_USER_NAME } from "@/lib/demo-data";

export default function DemoPage() {
  return (
    <DashboardClient
      initialHistory={DEMO_HISTORY}
      initialStats={DEMO_STATS}
      userName={DEMO_USER_NAME}
      isDemo
    />
  );
}
