import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);

  return null;
}
