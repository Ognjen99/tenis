"use server";

import { redirect } from "next/navigation";
import { getAdminSession, verifyAdminPassword } from "@/lib/session";
import { getString } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const password = getString(formData, "password");

  if (!verifyAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  await session.save();

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getAdminSession();
  session.destroy();
  redirect("/");
}
