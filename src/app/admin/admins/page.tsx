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
          style={{ color: "#2d8c3e" }}
        >
          Access Control
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: "#0d3d1a" }}
        >
          Admins
        </h1>
        <p className="mt-3 text-[15px] text-gray-500 leading-relaxed max-w-xl">
          Anyone on this list can sign in to the admin site with their Google account.
          Add the exact email of the Google account they use.
        </p>
      </div>

      {/* Add form */}
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 mb-6"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -12px rgba(26,92,42,0.1)" }}
      >
        <h2
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-5"
          style={{ color: "#2d8c3e" }}
        >
          Add Admin
        </h2>
        <AddAdminForm />
      </div>

      {/* List */}
      <div
        className="bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -10px rgba(26,92,42,0.1)" }}
      >
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "#2d8c3e" }}
          >
            Current Admins
          </h2>
          <span className="text-[12px] text-gray-500">{admins.length} total</span>
        </div>
        <ul>
          {admins.map((a) => {
            const isSelf = a.email.toLowerCase() === currentEmail;
            return (
              <li
                key={a.id}
                className="px-6 sm:px-8 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0"
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
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                    style={{ backgroundColor: "#1a5c2a" }}
                  >
                    {(a.name ?? a.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold truncate" style={{ color: "#0d3d1a" }}>
                      {a.name ?? a.email}
                    </p>
                    {isSelf && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  {a.name && <p className="text-[12px] text-gray-500 truncate">{a.email}</p>}
                  <p className="text-[11px] text-gray-400 mt-0.5">
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
