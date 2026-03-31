"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createSession } from "@/lib/actions/auth";
import { useAuth } from "@/context/authContext";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { isAbsoluteUrl } from "next/dist/shared/lib/utils";

const LoginPage = () => {
  const [message, setMessage] = useState(null);

  const [state, formAction, loading] = useActionState(createSession, null);
  const router = useRouter();

  const { isAuthenticated, setIsAuthenticated, setCurrentUser } = useAuth();

  if (isAuthenticated) {
    router.replace("/");
  }

  useEffect(() => {
    if (!state) return;

    if (!state.success) {
      setMessage(state.error);
    }

    if (state.success) {
      toast.success("Prijava uspešna");
      setIsAuthenticated(true);
      setCurrentUser(state.data);
      router.push("/");
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20">
        <form action={formAction}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Prijava</h2>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" autoComplete="email" required />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" autoComplete="password" required />
          </div>
          <div className="flex flex-col gap-5">
            <Button type="submit" disabled={loading} loading={loading}>
              Prijava
            </Button>
            {message && <p className="text-center text-red-600">{message}</p>}
            <p className="text-center">
              Še nimate uporabniškega računa?{" "}
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
