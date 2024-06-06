import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  return json({
    user: session.get("user"),
  });
}

export default function Dashboard() {
  return <div>Dashboard</div>;
}
