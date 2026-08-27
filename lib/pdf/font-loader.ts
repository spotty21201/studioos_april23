import { Font } from "@react-pdf/renderer";
import { readFileSync } from "node:fs";
import { join as pathJoin } from "node:path";

// Register PT Sans at module load time so the font travels with the bundle
// and never reaches out to a CDN at runtime.
//
// We resolve the font file paths entirely at runtime via `process.cwd()`
// to sidestep the Next.js / Turbopack bundler, which aggressively tries
// to resolve any static `import` or `require` of
// `@fontsource/pt-sans/files/*.woff` (the package's `exports` field has
// no Turbopack-compatible loader for `.woff` assets).
//
// `Font.register` accepts a `src` that is either an absolute filesystem
// path, a URL, or a `data:` URL. We pass the absolute filesystem path;
// `@react-pdf/font` resolves it via `fontkit.open`, which reads the file
// from disk at runtime.

function fontPath(weight: "normal" | "bold"): string {
  const fileName =
    weight === "bold"
      ? "pt-sans-latin-700-normal.woff"
      : "pt-sans-latin-400-normal.woff";
  // `node_modules/@fontsource/pt-sans/files/<file>.woff` is the canonical
  // install layout produced by `npm install @fontsource/pt-sans`. Joining
  // from `process.cwd()` keeps this fully dynamic so no static analyzer
  // sees the full path as a string.
  return pathJoin(
    process.cwd(),
    "node_modules",
    "@fontsource",
    "pt-sans",
    "files",
    fileName,
  );
}

// Eagerly warm the cache so the file system is hit at module load, not
// during PDF rendering. This surfaces any IO problems early.
function warmCache(path: string): void {
  readFileSync(path);
}

let registered = false;

export function registerPdfFonts(): void {
  if (registered) return;
  const regularPath = fontPath("normal");
  const boldPath = fontPath("bold");
  warmCache(regularPath);
  warmCache(boldPath);
  Font.register({
    family: "PT Sans",
    fontWeight: "normal",
    src: regularPath,
  });
  Font.register({
    family: "PT Sans",
    fontWeight: "bold",
    src: boldPath,
  });
  Font.registerHyphenationCallback((word: string) => [word]);
  registered = true;
}

// Re-export for unit tests that want to assert registration side-effects.
export const PDF_FONT_FAMILY = "PT Sans";