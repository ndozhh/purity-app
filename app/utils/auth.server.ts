import bcryptjs from "bcryptjs";
import { destroySession, getSession } from "./session.server";
import { redirect } from "@remix-run/node";
import { User } from "~/db/schema";

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcryptjs.hash(password, 12);

  return hashedPassword;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = await bcryptjs.compare(password, hashedPassword);

  return isValid;
};

export async function requireAnonymous(request: Request) {
  const session = await getSession(request.headers.get("cookie"));

  if (session.get("user")) {
    throw redirect("/dashboard");
  }

  return null;
}

export async function requireUser(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  const user = session.get("user");

  if (!user) {
    throw redirect("/auth/signin", {
      headers: {
        "set-cookie": await destroySession(session),
      },
    });
  }

  return user as User;
}
