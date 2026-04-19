import { auth0 } from "@/lib/auth0";
import { HomeClient } from "@/components/home-client";
import { redirect } from "next/navigation";

export default async function HomePage() {
  let session = null;

  try {
    session = await auth0.getSession();
  } catch {
    session = null;
  }

  if (session?.user) {
    redirect("/dashboard");
  }

  return <HomeClient />;
}
