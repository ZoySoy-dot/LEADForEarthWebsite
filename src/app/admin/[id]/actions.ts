"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = new Set(["new", "pending", "approved"]);

async function assertAdmin(): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return { ok: false, error: "Unauthorized" };
  const admin = await prisma.adminUser.findUnique({ where: { email }, select: { id: true } });
  if (!admin) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

export async function updateStatus(id: string, status: string): Promise<{ error?: string; ok?: boolean }> {
  const gate = await assertAdmin();
  if (!gate.ok) return { error: gate.error };
  if (!VALID_STATUSES.has(status)) return { error: "Invalid status." };

  try {
    await prisma.report.update({ where: { id }, data: { status } });
    revalidatePath("/admin");
    revalidatePath(`/admin/${id}`);
    return { ok: true };
  } catch {
    return { error: "Failed to update status." };
  }
}

export async function deleteReport(id: string): Promise<{ error?: string }> {
  const gate = await assertAdmin();
  if (!gate.ok) return { error: gate.error };

  try {
    await prisma.report.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete report." };
  }
  revalidatePath("/admin");
  redirect("/admin");
}

// Editable subset; the fields most likely to need typo fixes.
// Structured (impact/effectiveness/SDGs) stay read-only; those live in JSON blobs.
export async function updateReport(
  id: string,
  data: {
    schoolName: string;
    projectTitle: string;
    description: string;
    dateImplemented: string;
    projectDuration: string;
    targetParticipants: string;
    projectLead: string;
    students: string;
    faculty: string;
    staffAdmin: string;
    community: string;
    totalParticipants: string;
    schoolPopulation: string;
    participationRate: string;
    submitterName: string;
    submitterRole: string;
    submitterPhone: string;
  }
): Promise<{ error?: string; ok?: boolean }> {
  const gate = await assertAdmin();
  if (!gate.ok) return { error: gate.error };

  const toInt = (v: string) => (v.trim() === "" ? null : Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : null);
  const toDec = (v: string) => (v.trim() === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);
  const toDate = (v: string) => (v.trim() === "" ? null : new Date(v));

  if (!data.schoolName.trim() || !data.projectTitle.trim()) {
    return { error: "School name and project title are required." };
  }

  try {
    await prisma.report.update({
      where: { id },
      data: {
        schoolName: data.schoolName.trim(),
        projectTitle: data.projectTitle.trim(),
        description: data.description.trim() || null,
        dateImplemented: toDate(data.dateImplemented),
        projectDuration: data.projectDuration.trim() || null,
        targetParticipants: data.targetParticipants.trim() || null,
        projectLead: data.projectLead.trim() || null,
        students: toInt(data.students),
        faculty: toInt(data.faculty),
        staffAdmin: toInt(data.staffAdmin),
        community: toInt(data.community),
        totalParticipants: toInt(data.totalParticipants),
        schoolPopulation: toInt(data.schoolPopulation),
        participationRate: toDec(data.participationRate),
        submitterName: data.submitterName.trim(),
        submitterRole: data.submitterRole.trim(),
        submitterPhone: data.submitterPhone.trim() || null,
      },
    });
    revalidatePath("/admin");
    revalidatePath(`/admin/${id}`);
    return { ok: true };
  } catch {
    return { error: "Failed to save changes." };
  }
}
