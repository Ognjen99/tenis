import "server-only";

import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminSession = {
  isLoggedIn?: boolean;
};

const sessionPassword =
  process.env.SESSION_SECRET ??
  "development-session-secret-change-before-deployment";

export const sessionOptions: SessionOptions = {
  cookieName: "tennis-league-admin",
  password: sessionPassword,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getAdminSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions);
}

export async function isAdminLoggedIn() {
  const session = await getAdminSession();
  return Boolean(session.isLoggedIn);
}

export async function requireAdmin() {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  return password === configuredPassword;
}
