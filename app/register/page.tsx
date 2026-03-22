"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createUser } from "@/lib/actions/user";
import Link from "next/link";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const RegisterPage = () => {
  const [state, formAction, loading] = useActionState(createUser, null);

  const router = useRouter();

  useEffect(() => {
    if (!state) return;

    if (!state.success) {
      toast.error(state.error);
    } else {
      toast.success("Prijava uspešna");
      router.replace("/");
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20">
        <form action={formAction}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Nov uporabniški račun</h2>

          <div className="mb-4">
            <Label htmlFor="firstName">Ime</Label>
            <Input type="text" id="firstName" name="firstName" autoComplete="name" required />
          </div>

          <div className="mb-4">
            <Label htmlFor="lastName">Priimek</Label>
            <Input type="text" id="lastName" name="lastName" autoComplete="name" required />
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" autoComplete="email" required />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Geslo</Label>
            <Input type="password" id="password" name="password" required autoComplete="password" />
          </div>

          <div className="mb-6">
            <Label htmlFor="confirm-password">Potrditev gesla</Label>
            <Input
              type="password"
              id="confirm-password"
              name="confirm-password"
              autoComplete="confirm-password"
              required
            />
          </div>

          <div className="flex flex-col gap-5">
            <Button type="submit" disabled={loading} loading={loading}>
              Ustvarite račun
            </Button>

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
