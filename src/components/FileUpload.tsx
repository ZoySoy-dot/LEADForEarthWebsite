"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ACCEPT_ATTR,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  extOf,
  formatBytes,
  isAllowedExt,
  isImageFile,
  thumbUrl,
  viewUrl,
  type UploadedFile,
} from "@/lib/uploads";

type Pending = { id: string; name: string; progress: number };

type CloudinaryResult = {
  secure_url: string;
  public_id: string;
  bytes?: number;
  format?: string;
};

// POST a file straight to Cloudinary. XMLHttpRequest rather than fetch purely
// because fetch still has no upload progress event, and these files are large
// enough on school wifi that a progress bar matters.
function xhrUpload(
  url: string,
  body: FormData,
  onProgress: (pct: number) => void
): Promise<CloudinaryResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(json as CloudinaryResult);
        else reject(new Error(json?.error?.message ?? "Upload failed."));
      } catch {
        reject(new Error("Upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    xhr.send(body);
  });
}

export default function FileUpload({
  value,
  onChange,
  label,
  hint,
  disabled,
  schoolName,
}: {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
  // Used server-side to file the upload under the right sector and school.
  schoolName?: string;
}) {
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = pending.length > 0;
  const usedBytes = value.reduce((sum, f) => sum + f.bytes, 0);
  const slotsLeft = MAX_FILES - value.length;
  const canAdd = !disabled && !busy && slotsLeft > 0;

  async function uploadOne(file: File, id: string): Promise<UploadedFile> {
    const signRes = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, bytes: file.size, schoolName }),
    });
    const sign = await signRes.json();
    if (!signRes.ok) throw new Error(sign?.error ?? "Could not start the upload.");

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", sign.apiKey);
    body.append("timestamp", String(sign.timestamp));
    body.append("signature", sign.signature);
    body.append("folder", sign.folder);
    body.append("public_id", sign.publicId);
    body.append("tags", sign.tags);

    const result = await xhrUpload(
      `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`,
      body,
      (pct) => setPending((p) => p.map((x) => (x.id === id ? { ...x, progress: pct } : x)))
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: sign.resourceType,
      name: file.name,
      bytes: result.bytes ?? file.size,
      format: result.format ?? extOf(file.name),
    };
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");

    const incoming = Array.from(fileList);
    const rejected: string[] = [];
    const accepted: File[] = [];
    let runningTotal = usedBytes;

    for (const file of incoming) {
      if (accepted.length >= slotsLeft) {
        rejected.push(`${file.name} (limit is ${MAX_FILES} files)`);
      } else if (!isAllowedExt(file.name)) {
        rejected.push(`${file.name} (unsupported type)`);
      } else if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} (over ${formatBytes(MAX_FILE_BYTES)})`);
      } else if (runningTotal + file.size > MAX_TOTAL_BYTES) {
        rejected.push(`${file.name} (would exceed the ${formatBytes(MAX_TOTAL_BYTES)} total)`);
      } else {
        runningTotal += file.size;
        accepted.push(file);
      }
    }

    if (rejected.length) setError(`Skipped: ${rejected.join(", ")}.`);

    // Sequential, not parallel: school connections are often the bottleneck and
    // one file at a time gives an honest progress bar instead of four stalled ones.
    let current = [...value];
    for (const file of accepted) {
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      setPending((p) => [...p, { id, name: file.name, progress: 0 }]);
      try {
        const uploaded = await uploadOne(file, id);
        current = [...current, uploaded];
        onChange(current);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setPending((p) => p.filter((x) => x.id !== id));
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove(file: UploadedFile) {
    onChange(value.filter((f) => f.publicId !== file.publicId));
    // Best effort: drop it from Cloudinary too so abandoned files do not eat the
    // storage quota. If it fails, the form state is already correct.
    fetch("/api/upload/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: file.publicId, resourceType: file.resourceType }),
    }).catch(() => { /* ignore */ });
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-body)" }}>
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (canAdd) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (canAdd) handleFiles(e.dataTransfer.files);
        }}
        className="rounded-xl border border-dashed transition-colors"
        style={{
          borderColor: dragging ? "var(--brand)" : "var(--border-input)",
          backgroundColor: dragging ? "var(--surface-accent)" : "var(--surface)",
          opacity: canAdd ? 1 : 0.6,
        }}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={!canAdd}
          className="w-full px-4 py-7 flex flex-col items-center gap-1.5 text-center rounded-xl disabled:cursor-not-allowed"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 16V4" />
            <path d="M7.5 8.5 12 4l4.5 4.5" />
            <path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {slotsLeft > 0 ? "Choose files or drag them here" : `Limit reached (${MAX_FILES} files)`}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Photos, PDFs, Word, Excel, PowerPoint. Up to {formatBytes(MAX_FILE_BYTES)} each.
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {(value.length > 0 || pending.length > 0) && (
        <ul className="mt-3 space-y-2">
          {value.map((file) => (
            <li
              key={file.publicId}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-input)" }}
            >
              <span
                className="relative shrink-0 w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: "var(--surface-sunken)" }}
              >
                {isImageFile(file.name) ? (
                  <Image
                    src={thumbUrl(file.url, 120)}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="text-[10px] font-semibold uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {extOf(file.name) || "file"}
                  </span>
                )}
              </span>

              <span className="min-w-0 flex-1">
                <a
                  href={viewUrl(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm truncate hover:underline"
                  style={{ color: "var(--text-primary)" }}
                >
                  {file.name}
                </a>
                <span className="block text-xs" style={{ color: "var(--text-muted)" }}>
                  {formatBytes(file.bytes)}
                </span>
              </span>

              <button
                type="button"
                onClick={() => handleRemove(file)}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                className="shrink-0 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger-fg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </li>
          ))}

          {pending.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-input)" }}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm truncate" style={{ color: "var(--text-primary)" }}>
                  {p.name}
                </span>
                <span
                  className="block mt-1.5 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--surface-sunken)" }}
                >
                  <span
                    className="block h-full rounded-full transition-[width] duration-200"
                    style={{ width: `${p.progress}%`, backgroundColor: "var(--brand)" }}
                  />
                </span>
              </span>
              <span className="shrink-0 text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                {p.progress}%
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-start justify-between gap-3 mt-1.5">
        <p className="text-xs" style={{ color: error ? "var(--danger-fg)" : "var(--text-muted)" }}>
          {error || hint}
        </p>
        {value.length > 0 && (
          <p className="text-xs shrink-0 tabular-nums" style={{ color: "var(--text-subtle)" }}>
            {value.length} / {MAX_FILES} files, {formatBytes(usedBytes)}
          </p>
        )}
      </div>
    </div>
  );
}
