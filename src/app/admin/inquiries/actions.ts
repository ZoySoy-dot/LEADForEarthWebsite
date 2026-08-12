"use server";

import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

export async function sendReply(
  inquiryId: string,
  body: string
): Promise<{ error?: string; ok?: boolean }> {
  const session = await auth();
  const authorEmail = session?.user?.email?.toLowerCase();
  const authorName = session?.user?.name ?? null;
  if (!authorEmail) return { error: "Unauthorized" };

  // Extra defense-in-depth: only admins can send replies (layout already gates).
  const admin = await prisma.adminUser.findUnique({
    where: { email: authorEmail },
    select: { id: true },
  });
  if (!admin) return { error: "Unauthorized" };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Reply cannot be empty." };

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });
  if (!inquiry) return { error: "Inquiry not found." };

  // Threading headers: chain each new reply to the prior outbound Message-ID(s).
  const prevIds = inquiry.replies.map((r) => r.messageId).filter((id): id is string => !!id);
  const inReplyTo = prevIds.length ? prevIds[prevIds.length - 1] : undefined;
  const references = prevIds.length ? prevIds.join(" ") : undefined;

  const subject = inquiry.subject.toLowerCase().startsWith("re:")
    ? inquiry.subject
    : `Re: ${inquiry.subject}`;

  try {
    const info = await transporter.sendMail({
      from: `"LEADForEarth Committee" <${process.env.SMTP_USER}>`,
      to: inquiry.email,
      replyTo: process.env.SMTP_USER,
      subject,
      inReplyTo,
      references,
      text: `${trimmed}\n\n— ${authorName ?? authorEmail}\nLEADForEarth Committee`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#2d2d2d">
          <div style="background:#1a5c2a;padding:20px 28px;border-radius:12px 12px 0 0">
            <p style="color:#c8e6c9;margin:0;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase">LEADForEarth Committee</p>
          </div>
          <div style="background:#f7faf7;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e0e0e0">
            <p style="line-height:1.7;white-space:pre-wrap;margin:0 0 20px 0">${escapeHtml(trimmed)}</p>
            <p style="color:#757575;font-size:13px;margin:0">— ${escapeHtml(authorName ?? authorEmail)}<br/>LEADForEarth Committee</p>
          </div>
        </div>
      `,
    });

    await prisma.$transaction([
      prisma.inquiryReply.create({
        data: {
          inquiryId: inquiry.id,
          authorEmail,
          authorName,
          body: trimmed,
          messageId: info.messageId ?? null,
        },
      }),
      prisma.inquiry.update({
        where: { id: inquiry.id },
        data: { status: "replied" },
      }),
    ]);

    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${inquiry.id}`);
    return { ok: true };
  } catch (err) {
    console.error("Failed to send reply:", err);
    return { error: "Failed to send reply. Check SMTP credentials." };
  }
}

export async function archiveInquiry(inquiryId: string): Promise<{ error?: string; ok?: boolean }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  try {
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status: "archived" },
    });
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${inquiryId}`);
    return { ok: true };
  } catch {
    return { error: "Failed to archive." };
  }
}
