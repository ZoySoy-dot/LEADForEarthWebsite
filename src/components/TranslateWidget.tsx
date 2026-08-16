"use client";

import { useEffect } from "react";

// Lazy-loads Google's Translate Element on the client. We use a custom UI
// (LanguageMenu) that sets the `googtrans` cookie + reloads; the widget then
// picks up the cookie and translates the page. The default Google dropdown
// is mounted on a hidden div so its markup exists but never shows.
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => unknown;
      };
    };
  }
}

const INCLUDED = ["zh-TW", "zh-CN", "ja", "ms", "tl", "my", "th"].join(",");

// Guard React's DOM reconciler against Google Translate. GT wraps text nodes
// in <font> tags, so when React later tries to remove or reorder those nodes
// their parentNode no longer matches what the fiber tree expects, throwing
// "Failed to execute 'insertBefore' / 'removeChild' on 'Node'". Returning
// the node instead of throwing lets React recover on the next render.
function patchDOMForTranslate() {
  const w = window as typeof window & { __lfeTranslatePatched?: boolean };
  if (w.__lfeTranslatePatched) return;
  w.__lfeTranslatePatched = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child) as T;
  } as typeof Node.prototype.removeChild;

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  } as typeof Node.prototype.insertBefore;
}

export default function TranslateWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    patchDOMForTranslate();

    // Sync <html lang> to the active translation so the browser's built-in
    // translate offer (Chrome/Edge) doesn't fire on top of ours.
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match) document.documentElement.lang = match[1];

    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      const g = window.google?.translate?.TranslateElement;
      if (!g) return;
      new g(
        {
          pageLanguage: "en",
          includedLanguages: INCLUDED,
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return <div id="google_translate_element" aria-hidden="true" style={{ display: "none" }} />;
}
