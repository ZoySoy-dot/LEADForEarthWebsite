"use client";

import { useState, useTransition } from "react";
import { addAdmin, removeAdmin } from "./actions";

const INPUT_CLS =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition";

export function AddAdminForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await addAdmin(formData);
      if (res.error) setError(res.error);
      else {
        setSuccess(`Added ${String(formData.get("email"))}.`);
        (document.getElementById("add-admin-form") as HTMLFormElement | null)?.reset();
      }
    });
  }

  return (
    <form id="add-admin-form" action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
        <input
          name="email"
          type="email"
          required
          placeholder="email@school.edu.ph"
          className={INPUT_CLS}
          disabled={pending}
        />
        <input
          name="name"
          type="text"
          placeholder="Name (optional)"
          className={INPUT_CLS}
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full font-semibold text-[13.5px] text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#1a5c2a",
            boxShadow: "0 6px 16px -4px rgba(26,92,42,0.4)",
          }}
        >
          {pending ? "Adding…" : "Add Admin"}
        </button>
      </div>
      {error && (
        <p className="text-[13px] text-red-600 font-medium">{error}</p>
      )}
      {success && (
        <p className="text-[13px] font-medium" style={{ color: "#1a5c2a" }}>{success}</p>
      )}
    </form>
  );
}

export function RemoveAdminButton({
  id, email, disabled,
}: { id: string; email: string; disabled?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (disabled) return;
    if (!confirm(`Remove admin access for ${email}?`)) return;
    setError(null);
    startTransition(async () => {
      const res = await removeAdmin(id);
      if (res.error) setError(res.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || pending}
        title={disabled ? "You can't remove your own access." : "Remove admin"}
        className="px-3 py-1.5 rounded-full text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        {pending ? "Removing…" : "Remove"}
      </button>
      {error && <span className="text-[11px] text-red-600">{error}</span>}
    </div>
  );
}
