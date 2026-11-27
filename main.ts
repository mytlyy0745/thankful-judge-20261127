// Make the AI judge feel thankful — make.fun entry.
// Writes the thank-you text from entry.txt to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output). Validates the competition gate before writing:
// the text must be UTF-8, 1-1000 Unicode code points, not only whitespace.
// Node 22, standard library only; deterministic output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");

// Gate: 1-1000 Unicode code points, not only whitespace.
// Spread counts code points (a surrogate pair counts as one).
const length = [...text].length;
if (length < 1 || length > 1000) {
  throw new Error(`entry.txt must be 1-1000 characters, got ${length}`);
}
if (text.trim().length === 0) {
  throw new Error("entry.txt must not be only white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
console.log(`Wrote ${length}-character entry to ${join(outDir, "entry.txt")}`);
