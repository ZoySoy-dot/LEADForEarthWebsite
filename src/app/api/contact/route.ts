import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, subject, message } = await req.json();

  if (!firstName || !lastName || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  try {
    await prisma.inquiry.create({
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim().toLowerCase(),
        subject: String(subject).trim(),
        message: String(message),
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save inquiry:", err);
    return NextResponse.json({ error: "Failed to save inquiry." }, { status: 500 });
  }
}
