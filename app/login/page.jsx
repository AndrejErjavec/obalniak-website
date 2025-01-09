"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {useActionState, useEffect} from "react";
import { toast } from "react-toastify";
import { createSession } from "../lib/actions/auth";
import { useAuth } from "@/context/authContext";

const LoginPage = () => {
  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAuth();

  const initialState = {
    success: false,
    error: false,
  }

  const [state, formAction, loading] = useActionState(createSession, initialState);

  const router = useRouter();

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("Logged in successfully!");
      setIsAuthenticated(true);
      setCurrentUser(state.user);
      router.push("/");
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20">
        <form action={formAction}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

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

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border rounded w-full py-2 px-3"
              autoComplete="password"
              required
            />
          </div>

          <div className="flex flex-col gap-5">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (<>Prijavljanje...</>) : <>Prijava</>}
            </button>

            <p className="text-center">
              Še nimate uporabniškega računa?
              <Link href="/register" className="text-blue-500">
                Registracija
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
