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

// Wrap the brand name everywhere it appears so Google Translate leaves it
// alone. Walks all text nodes, skips any inside an existing .notranslate
// ancestor, and splits matching text into spans marked notranslate. Runs
// once per page load, before the GT script executes.
// Non-global for tests, global with capture group for splitting so the
// brand tokens are preserved as parts. Kept separate to avoid the shared
// `lastIndex` gotcha of reusing a `/g` regex across `.test()` calls.
const BRAND_TEST = /#?LEAD[Ff]or[Ee]arth/;
const BRAND_SPLIT = /(#?LEAD[Ff]or[Ee]arth)/g;
function protectBrandTerms() {
  if (!document.body) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent ?? "";
      if (!BRAND_TEST.test(text)) return NodeFilter.FILTER_REJECT;
      // Skip anything already inside a notranslate element (headers, etc.)
      // or inside script/style tags where DOM edits would break things.
      let el: Node | null = node.parentNode;
      while (el && el !== document.body) {
        if (el instanceof Element) {
          if (el.classList.contains("notranslate")) return NodeFilter.FILTER_REJECT;
          if (el.tagName === "SCRIPT" || el.tagName === "STYLE") return NodeFilter.FILTER_REJECT;
        }
        el = el.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const targets: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) targets.push(n as Text);

  for (const textNode of targets) {
    const text = textNode.textContent ?? "";
    const parts = text.split(BRAND_SPLIT);
    if (parts.length <= 1) continue;
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (BRAND_TEST.test(part)) {
        const span = document.createElement("span");
        span.className = "notranslate";
        span.setAttribute("translate", "no");
        span.textContent = part;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    }
    textNode.parentNode?.replaceChild(frag, textNode);
  }
}

// If the page is hidden (server rendered with `lfe-needs-translate` because
// the cookie is non-English), reveal it only once translation is BOTH marked
// applied by Google AND the DOM has stopped mutating for a settle window.
// GT adds `translated-ltr` early and then continues wrapping text nodes in
// <font> tags in chunks; revealing on the class alone flashes English text.
// We debounce off character-data + childList mutations so the reveal waits
// until the translation churn has actually settled.
function reveal() {
  const html = document.documentElement;
  if (html.classList.contains("lfe-translated")) return;
  html.classList.add("lfe-translated");
}
function watchForTranslation() {
  const html = document.documentElement;
  if (!html.classList.contains("lfe-needs-translate")) return;

  const SETTLE_MS = 350;   // no DOM churn for this long = translation done
  const HARD_MAX_MS = 4000; // absolute cap so we never stay hidden forever

  const hasTranslatedClass = () =>
    html.classList.contains("translated-ltr") ||
    html.classList.contains("translated-rtl");

  let settleTimer: number | null = null;
  let translatedSeen = hasTranslatedClass();

  const armSettleTimer = () => {
    if (!translatedSeen) return;
    if (settleTimer) window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      reveal();
      classObserver.disconnect();
      bodyObserver.disconnect();
    }, SETTLE_MS);
  };

  const classObserver = new MutationObserver(() => {
    if (!translatedSeen && hasTranslatedClass()) {
      translatedSeen = true;
    }
    armSettleTimer();
  });
  classObserver.observe(html, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Watch every text/DOM mutation. Each mutation resets the settle timer, so
  // we only reveal after GT has stopped rewriting nodes.
  const bodyObserver = new MutationObserver(() => {
    armSettleTimer();
  });
  const startBodyObserver = () => {
    if (!document.body) {
      requestAnimationFrame(startBodyObserver);
      return;
    }
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  };
  startBodyObserver();

  // If translation was already applied before this ran (rare, but possible
  // on very fast returns), still wait for the settle window.
  if (translatedSeen) armSettleTimer();

  window.setTimeout(() => {
    reveal();
    classObserver.disconnect();
    bodyObserver.disconnect();
  }, HARD_MAX_MS);
}

export default function TranslateWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    patchDOMForTranslate();
    protectBrandTerms();
    watchForTranslation();

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
