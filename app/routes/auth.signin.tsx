import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import { eq } from "drizzle-orm";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { db } from "~/db/instance";
import { User } from "~/db/schema";
import { requireAnonymous, verifyPassword } from "~/utils/auth.server";
import { commitSession, getSession } from "~/utils/session.server";

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof SigninSchema>;
type ActionData = {
  error?: string;
};

const resolver = zodResolver(SigninSchema);

export const meta: MetaFunction = () => {
  return [{ title: "Iniciar sesión | Purity ✨" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);

  if (errors) {
    return json({ errors, defaultValues });
  }

  const session = await getSession(request.headers.get("cookie"));

  // Find user by email
  const user = await db.query.User.findFirst({
    where: eq(User.email, data.email),
    with: {
      password: true,
    },
  });

  if (!user) {
    return json(
      {
        error: "Credenciales incorrectas",
      },
      {
        status: 404,
      }
    );
  }

  // Check password
  const isPasswordValid = await verifyPassword(
    data.password,
    user.password.hash
  );

  if (!isPasswordValid) {
    return json(
      {
        error: "Credenciales incorrectas",
      },
      {
        status: 404,
      }
    );
  }

  // Set user in session
  session.set("user", user);

  return redirect("/dashboard", {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
}

export default function Signin() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/auth/signin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="card w-[28rem] bg-white shadow-lg h-[44rem] p-12">
        {actionData?.error ? (
          <div role="alert" className="alert alert-error mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{actionData.error}</span>
          </div>
        ) : null}
        <h3 className="text-4xl text-slate-800 text-center font-semibold">
          Ingresa a tu cuenta
        </h3>
        <Form
          className="flex flex-col gap-1"
          method="POST"
          onSubmit={handleSubmit}
        >
          <label className="form-control w-full rounded-2xl">
            <div className="label">
              <span className="label-text font-bold text-sky-900">
                Correo electrónico
              </span>
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="Ingresa tu correo electrónico"
              autoComplete="email"
              className={clsx("input input-bordered w-full rounded-2xl", {
                "input-error": errors.email,
              })}
            />
            {errors.email ? (
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.email?.message}
                </span>
              </div>
            ) : null}
          </label>
          <label className="form-control w-full rounded-2xl">
            <div className="label">
              <span className="label-text font-bold text-sky-900">
                Contraseña
              </span>
            </div>
            <input
              {...register("password")}
              type="password"
              placeholder="Ingresa tu contraseña"
              autoComplete="new-password"
              className={clsx("input input-bordered w-full rounded-2xl", {
                "input-error": errors.password,
              })}
            />
            {errors.password ? (
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.password?.message}
                </span>
              </div>
            ) : null}
          </label>
          <button
            disabled={isSubmitting}
            className="btn btn-info mt-9 rounded-2xl"
            type="submit"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : null}
            Ingresar
          </button>
        </Form>
        <span className="text-gray-500 text-center mt-8">
          ¿Aún no tienes una cuenta?{" "}
          <Link to="/auth/signup" className="text-info">
            Regístrate
          </Link>
        </span>
      </div>
    </div>
  );
}
