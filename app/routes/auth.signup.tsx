import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import clsx from "clsx";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof SignupSchema>;

const resolver = zodResolver(SignupSchema);

export async function action({ request }: ActionFunctionArgs) {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);

  if (errors) {
    return json({ errors, defaultValues });
  }

  return json(data);
}

export default function Signup() {
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
          Crea tu cuenta
        </h3>
        <Form
          className="flex flex-col gap-1"
          method="POST"
          onSubmit={handleSubmit}
        >
          <label className="form-control w-full rounded-2xl">
            <div className="label">
              <span className="label-text font-bold text-sky-900">Nombre</span>
            </div>
            <input
              {...register("name")}
              type="text"
              placeholder="Ingresa tu nombre"
              autoComplete="name"
              className={clsx("input input-bordered w-full rounded-2xl", {
                "input-error": errors.name,
              })}
            />
            {errors.name ? (
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.name?.message}
                </span>
              </div>
            ) : null}
          </label>
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
          <button className="btn btn-info mt-9 rounded-2xl" type="submit">
            Crear cuenta
          </button>
        </Form>
        <span className="text-gray-500 text-center mt-8">
          Ya tienes una cuenta?{" "}
          <Link to="/auth/signin" className="text-info">
            Inicia sesión
          </Link>
        </span>
      </div>
    </div>
  );
}
