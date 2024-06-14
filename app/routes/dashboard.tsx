import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { requireUser } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Purity ✨" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return json({
    user,
  });
}

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <Form method="POST" action="/auth/logout">
        <button type="submit" className="btn btn-outline btn-secondary">
          Cerrar sesión
        </button>
      </Form>
    </div>
  );
}
