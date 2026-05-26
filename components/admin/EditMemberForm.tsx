"use client";

import { MembershipRequestStatus, User } from "@/app/generated/prisma";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { updateMember } from "@/lib/actions/user";
import { experienceLevel } from "@/util";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

type EditMemberFormState = {
  firstName: string;
  lastName: string;
  email: string;
  experienceLevel: string;
  status: MembershipRequestStatus;
};

type EditableDecisionStatus = Extract<MembershipRequestStatus, "ACCEPTED" | "REJECTED">;

type EditMemberFormProps = {
  member: User;
  onClose: () => void;
  onSaved: (user: User, status: "UPDATED" | "REJECTED") => void;
};

export default function EditMemberForm({ member, onClose, onSaved }: EditMemberFormProps) {
  const [form, setForm] = useState<EditMemberFormState>({
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    experienceLevel: member.experienceLevel || "",
    status: member.status,
  });
  const [saving, setSaving] = useState(false);

  const updateForm = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateStatus = (status: EditableDecisionStatus) => {
    setForm((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    const result = await updateMember(member.id, {
      ...form,
      experienceLevel: form.experienceLevel || null,
    });
    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    onSaved(result.data.user, result.data.status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-gray-900 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Uredi člana</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100"
            aria-label="Zapri"
          >
            Zapri
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="edit-firstName">Ime</Label>
            <Input
              id="edit-firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={updateForm}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-lastName">Priimek</Label>
            <Input
              id="edit-lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={updateForm}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" name="email" type="email" value={form.email} onChange={updateForm} required />
          </div>

          <div>
            <Label htmlFor="edit-experienceLevel">Izkušenost</Label>
            <select
              id="edit-experienceLevel"
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={updateForm}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 shadow-xs transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Izberite izkušenost</option>
              {Object.entries(experienceLevel).map(([key, level]) => (
                <option value={key} key={key}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Status potrditve</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateStatus(MembershipRequestStatus.ACCEPTED)}
                className={`rounded-md border px-4 py-3 text-sm font-medium transition ${
                  form.status === MembershipRequestStatus.ACCEPTED
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                }`}
              >
                Potrdi
              </button>
              <button
                type="button"
                onClick={() => updateStatus(MembershipRequestStatus.REJECTED)}
                className={`rounded-md border px-4 py-3 text-sm font-medium transition ${
                  form.status === MembershipRequestStatus.REJECTED
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                }`}
              >
                Zavrni
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Prekliči
            </Button>
            <Button type="submit" loading={saving}>
              Shrani
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
