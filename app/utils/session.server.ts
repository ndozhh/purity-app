import { createCookieSessionStorage } from "@remix-run/node";

export const AUTH_SESSION_COOKIE_NAME = "__session";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: AUTH_SESSION_COOKIE_NAME,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: import.meta.env.VITE_SESSION_SECRET.split(","),
      secure: import.meta.env.PROD,
    },
  });

export { getSession, commitSession, destroySession };
