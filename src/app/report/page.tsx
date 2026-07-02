import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReportForm from "@/components/ReportForm";

export const metadata: Metadata = {
  title: "Report | LEADForEarth",
  description:
    "Submit your institution's #LEADforEarth campaign report.",
};

export default function ReportPage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-0.5">
            <Image
              src="/logo-icon.png"
              alt="LEADForEarth Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
            <span
              className="text-lg font-bold leading-tight"
              style={{ color: "#1a5c2a" }}
            >
              LEAD
              <span style={{ color: "#2d2d2d" }}>ForEarth</span>
            </span>
          </Link>
          <span className="text-gray-200 select-none">|</span>
          <Link
            href="/"
            className="text-sm font-medium transition-colors duration-200 hover:text-green-700"
            style={{ color: "#9ca3af" }}
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="pt-[72px]">
        <ReportForm />
      </main>
    </>
  );
}
