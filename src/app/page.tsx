import { auth0 } from "@/lib/auth0";
import { HomeClient } from "@/components/home-client";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth0.getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <HomeClient />;
}
