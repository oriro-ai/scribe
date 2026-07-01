// Scribe quick start — run:  node examples/quick-start.mjs
// Uses a throwaway dir so it won't touch your real ~/.oriro store. Remove the ORIRO_SCRIBE_DIR line
// to use the real on-device store.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
process.env.ORIRO_SCRIBE_DIR ||= mkdtempSync(join(tmpdir(), "scribe-demo-"));

import { setScribeConsent, scribeTurn, buildContext, searchScribe } from "../dist/index.js";

// 1) Opt in (Scribe is OFF by default — it records/injects nothing until you say yes).
setScribeConsent(true);

// 2) Record turns as you (or your agent) work. Secrets/PII are redacted BEFORE disk automatically.
scribeTurn({
  user: "set up the auth flow with JWT (secret=sk-ant-EXAMPLEwontbestored0123456789)",
  note: "added JWT middleware in auth.ts",
  files: ["auth.ts"],
  tools: ["Edit"],
});
scribeTurn({
  user: "fix the rate limiter — it drops bursts",
  note: "switched to a token-bucket in limiter.ts",
  files: ["limiter.ts"],
  tools: ["Edit", "Bash"],
});

// 3) NEXT session: fold this into your prompt so the model starts already in context.
console.log("──────── injected context (buildContext) ────────");
console.log(buildContext() || "(nothing yet)");

// 4) Recall past work on demand (e.g. behind a `scribe_recall` tool your model can call).
console.log("\n──────── recall: searchScribe('rate limiter') ────────");
console.log(searchScribe("rate limiter"));
