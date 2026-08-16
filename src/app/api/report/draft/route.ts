import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

// Cross-device autosave for the /report form. Body shape is opaque JSON:
// { form, step, skipReflection }. The client is the schema authority; the
// server only enforces "one draft per Google account".
async function sessionEmail(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  return email ?? null;
}

export async function GET() {
  const userEmail = await sessionEmail();
  if (!userEmail) return NextResponse.json({ draft: null }, { status: 401 });

  const draft = await prisma.reportDraft.findUnique({ where: { userEmail } });
  return NextResponse.json({ draft: draft?.data ?? null, updatedAt: draft?.updatedAt ?? null });
}

export async function PUT(req: NextRequest) {
  const userEmail = await sessionEmail();
  if (!userEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = (await req.json()) as Prisma.InputJsonValue;
  await prisma.reportDraft.upsert({
    where: { userEmail },
    create: { userEmail, data },
    update: { data },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const userEmail = await sessionEmail();
  if (!userEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.reportDraft.deleteMany({ where: { userEmail } });
  return NextResponse.json({ success: true });
}
