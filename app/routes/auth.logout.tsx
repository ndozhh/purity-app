import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  return redirect("/auth/signin", {
    headers: {
      "set-Cookie": await destroySession(session),
    },
  });
}
