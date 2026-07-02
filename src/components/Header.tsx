"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#what-we-do" },
  { label: "Our Foundations", href: "#foundations" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <Image
            src="/leadforearth-logo.png"
            alt="LEADForEarth Logo"
            width={52}
            height={52}
            className="object-contain"
            priority
          />
          <span
            className="text-xl font-bold leading-tight"
            style={{ color: "#1a5c2a" }}
          >
            LEAD
            <span style={{ color: "#2d2d2d" }}>ForEarth</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200 hover:text-green-700"
              style={{ color: "#2d2d2d" }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/report"
            className="px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors duration-200 hover:bg-green-50"
            style={{ borderColor: "#1a5c2a", color: "#1a5c2a" }}
          >
            Submit Report
          </Link>
          <a
            href="#contact"
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            style={{ backgroundColor: "#1a5c2a" }}
          >
            Get Involved
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium border-b border-gray-100 last:border-0 hover:text-green-700"
              style={{ color: "#2d2d2d" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/report"
            className="mt-3 block text-center px-5 py-2 rounded-full text-sm font-semibold border-2 hover:bg-green-50"
            style={{ borderColor: "#1a5c2a", color: "#1a5c2a" }}
            onClick={() => setMenuOpen(false)}
          >
            Submit Report
          </Link>
          <a
            href="#contact"
            className="mt-3 block text-center px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "#1a5c2a" }}
            onClick={() => setMenuOpen(false)}
          >
            Get Involved
          </a>
        </div>
      )}
    </header>
  );
}
