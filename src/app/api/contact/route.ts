import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Created once at module level — connection is reused across requests
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, subject, message } = await req.json();

  if (!firstName || !lastName || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  await transporter.sendMail({
    from: `"LEADForEarth Website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECIPIENT ?? process.env.SMTP_USER,
    replyTo: email,
    subject: `[LEADForEarth] ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1a5c2a;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="color:#fff;margin:0;font-size:20px">New message from LEADForEarth website</h2>
        </div>
        <div style="background:#f7faf7;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e0e0e0">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#757575;font-size:13px;width:110px">From</td>
                <td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
            <tr><td style="padding:8px 0;color:#757575;font-size:13px">Email</td>
                <td style="padding:8px 0"><a href="mailto:${email}" style="color:#1a5c2a">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#757575;font-size:13px">Subject</td>
                <td style="padding:8px 0">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0"/>
          <p style="color:#2d2d2d;line-height:1.7;white-space:pre-wrap;margin:0">${message}</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
