// Make the AI judge feel thankful — make.fun entry.
// Writes the thank-you text from entry.txt to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output). Validates the competition gate before writing:
// the text must be UTF-8, 1-1000 Unicode code points, not only whitespace.
// Node 22, standard library only; deterministic output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const textBytes = readFileSync(join(here, "entry.txt"));
const text = textBytes.toString("utf8");

// Gate: 1-1000 Unicode code points, not only whitespace.
// Array.from splits by code point, so an astral character counts as one
// (String.length would count its UTF-16 surrogate pair as two).
const length = Array.from(text).length;
if (length < 1 || length > 1000) {
  throw new Error(
    `gate violated: entry.txt must be 1-1000 Unicode code points, got ${length}`,
  );
}
if (text.trim().length === 0) {
  throw new Error("gate violated: entry.txt must not be only white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), textBytes);
} catch (err) {
  throw new Error(
    `cannot write entry to ${join(outDir, "entry.txt")}: ${(err as Error).message}`,
  );
}

// Read back and verify the written file is byte-identical to entry.txt.
const written = readFileSync(join(outDir, "entry.txt"));
if (!written.equals(textBytes)) {
  throw new Error(
    "verification failed: written entry.txt is not byte-identical to entry.txt",
  );
}
console.log(`Wrote ${length}-character entry to ${join(outDir, "entry.txt")}`);
