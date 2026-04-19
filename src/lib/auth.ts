import { auth0 } from "@/lib/auth0";

export type AuthUser = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

export async function requireAuthUser(): Promise<AuthUser> {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    sub: session.user.sub,
    email: session.user.email,
    name: session.user.name,
    picture: session.user.picture,
  };
}
