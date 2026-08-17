import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddAdminForm, RemoveAdminButton } from "./ui";

function fmt(d: Date | null): string {
  if (!d) return "-";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(d);
}

export default async function AdminsPage() {
  const session = await auth();
  const currentEmail = session?.user?.email?.toLowerCase() ?? "";

  const admins = await prisma.adminUser.findMany({
    orderBy: [{ lastLoginAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
          style={{ color: "var(--brand-mid)" }}
        >
          Access Control
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: "var(--text-heading)" }}
        >
          Admins
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
          Anyone on this list can sign in to the admin site with their Google account.
          Add the exact email of the Google account they use.
        </p>
      </div>

      {/* Add form */}
      <div
        className="rounded-3xl p-6 sm:p-8 mb-6"
        style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
      >
        <h2
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-5"
          style={{ color: "var(--brand-mid)" }}
        >
          Add Admin
        </h2>
        <AddAdminForm />
      </div>

      {/* List */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
      >
        <div className="px-6 sm:px-8 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--brand-mid)" }}
          >
            Current Admins
          </h2>
          <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{admins.length} total</span>
        </div>
        <ul>
          {admins.map((a) => {
            const isSelf = a.email.toLowerCase() === currentEmail;
            return (
              <li
                key={a.id}
                className="px-6 sm:px-8 py-4 flex items-center gap-4 last:border-0"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                {a.image ? (
                  <Image
                    src={a.image}
                    alt={a.name ?? a.email}
                    width={40}
                    height={40}
                    className="rounded-full shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
                    style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)" }}
                  >
                    {(a.name ?? a.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold truncate" style={{ color: "var(--text-heading)" }}>
                      {a.name ?? a.email}
                    </p>
                    {isSelf && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--surface-accent)", color: "var(--brand)" }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  {a.name && <p className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{a.email}</p>}
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
                    Added {fmt(a.createdAt)} · Last sign-in {fmt(a.lastLoginAt)}
                  </p>
                </div>
                <RemoveAdminButton id={a.id} email={a.email} disabled={isSelf} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
