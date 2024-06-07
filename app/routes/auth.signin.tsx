import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { db } from "~/db/instance";
import { Password, User } from "~/db/schema";
import { hashPassword, requireAnonymous } from "~/utils/auth.server";
import { commitSession, getSession } from "~/utils/session.server";

const SignupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof SignupSchema>;

const resolver = zodResolver(SignupSchema);

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

  // Create a new user
  const [user] = await db
    .insert(User)
    .values({ name: data.name, email: data.email })
    .returning();

  await db
    .insert(Password)
    .values({ hash: await hashPassword(data.password), userId: user.id });

  session.set("user", user);

  return redirect("/dashboard", {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
}

export default function Signin() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/auth/signup";

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
