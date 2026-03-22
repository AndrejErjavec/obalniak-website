import { ActionResult } from "@/types";

export function ok<T>(data?: T): ActionResult<T> {
  return { success: true, data };
}

export function err(error: string, fields?: Record<string, string[]>): ActionResult<never> {
  return { success: false, error, fields };
}
