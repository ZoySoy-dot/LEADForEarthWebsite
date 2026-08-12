"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function addAdmin(formData: FormData): Promise<{ error?: string; ok?: boolean }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  const emailRaw = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;

  if (!EMAIL_RE.test(emailRaw)) return { error: "Please enter a valid email address." };

  try {
    await prisma.adminUser.upsert({
      where: { email: emailRaw },
      update: { name: name ?? undefined },
      create: { email: emailRaw, name },
    });
    revalidatePath("/admin/admins");
    return { ok: true };
  } catch {
    return { error: "Failed to add admin." };
  }
}

export async function removeAdmin(id: string): Promise<{ error?: string; ok?: boolean }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  // Guard: don't let an admin lock themselves out.
  const target = await prisma.adminUser.findUnique({ where: { id }, select: { email: true } });
  if (!target) return { error: "Admin not found." };
  if (target.email.toLowerCase() === session.user.email.toLowerCase()) {
    return { error: "You can't remove your own admin access." };
  }

  // Guard: never allow removing the last remaining admin.
  const total = await prisma.adminUser.count();
  if (total <= 1) return { error: "Can't remove the last remaining admin." };

  try {
    await prisma.adminUser.delete({ where: { id } });
    revalidatePath("/admin/admins");
    return { ok: true };
  } catch {
    return { error: "Failed to remove admin." };
  }
}
