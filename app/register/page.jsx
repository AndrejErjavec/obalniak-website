"use client";

import {useActionState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createUser } from "@/app/lib/actions/user";
import Link from "next/link";

const RegisterPage = () => {
  const initialState = {
    success: false,
    error: false,
  }

  const [state, formAction, loading] = useActionState(createUser, initialState);

  const router = useRouter();

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("Uporabniški račun je bil ustvarjen");
      router.push('/login');
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20">
        <form action={formAction}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Nov uporabniški račun
          </h2>

          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-gray-700 font-bold mb-2"
            >
              Ime
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="border rounded w-full py-2 px-3"
              autoComplete="name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-gray-700 font-bold mb-2"
            >
              Priimek
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="border rounded w-full py-2 px-3"
              autoComplete="name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border rounded w-full py-2 px-3"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Geslo
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border rounded w-full py-2 px-3"
              required
              autoComplete="password"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-gray-700 font-bold mb-2"
            >
              Potrditev gesla
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className="border rounded w-full py-2 px-3"
              autoComplete="confirm-password"
              required
            />
          </div>

          <div className="flex flex-col gap-5">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? (<>Ustvarjanje računa...</>) : <>Ustvarite račun</>}
            </button>

            <p className="text-center">
              Že imate uporabniši račun?{" "}
              <Link href="/login" className="text-blue-500">
                Prijava
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
