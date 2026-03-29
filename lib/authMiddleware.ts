import { checkAuth } from "./actions/auth";

export async function requireUser() {
  const { user } = await checkAuth();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireUserWithId(id: string) {
  const { user } = await checkAuth();
  if (!user || user.id !== id) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (!user.isAdmin) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
