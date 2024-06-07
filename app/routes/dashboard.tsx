import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return json({
    user,
  });
}

export default function Dashboard() {
  return <div>Dashboard</div>;
}
