// Outbound mail.
//
// Fail-soft by design: a report submission must never fail because SMTP is
// down or unconfigured. Every function here returns a boolean and logs rather
// than throwing, so callers can carry on regardless.
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<boolean> {
  if (!mailConfigured()) {
    // Local dev usually has no SMTP credentials; say so once, plainly.
    console.warn("[mail] SMTP_USER/SMTP_PASS not set; skipping send to", opts.to);
    return false;
  }
  try {
    await transporter.sendMail({
      from: `"LEADForEarth" <${process.env.SMTP_USER}>`,
      replyTo: process.env.SMTP_USER,
      ...opts,
    });
    return true;
  } catch (err) {
    console.error("[mail] send failed:", err);
    return false;
  }
}

const BRAND = "#1b5e20";

/**
 * Confirmation sent when a report is filed. Carries the reflection link, which
 * is the only copy of the edit token the submitter ever receives, so this mail
 * is what makes "add your reflection later" possible at all.
 */
export async function sendReportConfirmation(opts: {
  to: string;
  submitterName: string;
  schoolName: string;
  projectTitle: string;
  reflectUrl: string;
  reportUrl: string;
}): Promise<boolean> {
  const { to, submitterName, schoolName, projectTitle, reflectUrl, reportUrl } = opts;
  const greeting = submitterName.trim() ? `Hi ${submitterName.trim()},` : "Hi,";

  const text = [
    greeting,
    "",
    `We've received your #LEADforEarth report for "${projectTitle}" from ${schoolName}.`,
    "",
    "One optional step left: the reflection. It covers climate literacy, participant feedback,",
    "the Lasallian reflection, and lessons learned. It's the part the committee reads most",
    "closely, and you can fill it in whenever you have time.",
    "",
    `Add your reflection: ${reflectUrl}`,
    "",
    "Keep this link. It's the only way back into your reflection, and it doesn't expire.",
    "",
    `View your report: ${reportUrl}`,
    "",
    "Thank you for taking part.",
    "The LEADForEarth Committee",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#2d2d2d;line-height:1.6">
      <p>${escapeHtml(greeting)}</p>
      <p>
        We've received your #LEADforEarth report for
        <strong>${escapeHtml(projectTitle)}</strong> from ${escapeHtml(schoolName)}.
      </p>
      <p>
        One optional step left: the <strong>reflection</strong>. It covers climate literacy,
        participant feedback, the Lasallian reflection, and lessons learned. It's the part the
        committee reads most closely, and you can fill it in whenever you have time.
      </p>
      <p style="margin:28px 0">
        <a href="${reflectUrl}"
           style="background:${BRAND};color:#fff;text-decoration:none;padding:13px 26px;border-radius:999px;font-weight:bold;display:inline-block">
          Add your reflection
        </a>
      </p>
      <p style="font-size:13px;color:#666">
        Keep this email. That link is the only way back into your reflection, and it doesn't expire.
      </p>
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0" />
      <p style="font-size:13px">
        <a href="${reportUrl}" style="color:${BRAND}">View your submitted report</a>
      </p>
      <p style="font-size:13px;color:#666">
        Thank you for taking part.<br />The LEADForEarth Committee
      </p>
    </div>
  `;

  return sendMail({
    to,
    subject: `Your #LEADforEarth report: ${projectTitle}`,
    text,
    html,
  });
}
