// Scribe smoke test — exercises the whole engine end-to-end in a throwaway dir (never touches
// ~/.oriro). Run: node test/smoke.mjs   (after `npm run build`).
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Route the store to a temp dir BEFORE importing scribe (paths read this env at call time).
const dir = mkdtempSync(join(tmpdir(), "scribe-smoke-"));
process.env.ORIRO_SCRIBE_DIR = dir;

const s = await import("../dist/index.js");
const day = new Date().toISOString().slice(0, 10);
const SECRET = "sk-ant-abcdefghijklmnopqrstuvwxyz012345";

// 1) default OFF — records/injects nothing
assert.equal(s.isScribeEnabled(), false, "consent must default OFF");
assert.equal(s.buildContext(), "", "no context when OFF");

// 2) opt in
s.setScribeConsent(true);
assert.equal(s.isScribeEnabled(), true, "consent ON after opt-in");

// 3) redaction is exposed and works
const r = s.redact(`key ${SECRET} and email a@b.com`);
assert.ok(r.text.includes("⟨REDACTED:"), "redact replaces secrets with markers");
assert.ok(!r.text.includes(SECRET), "raw key removed by redact()");

// 4) capture a turn carrying a secret -> it must be REDACTED BEFORE DISK
s.scribeTurn({
  user: `wire the payment webhook (token=${SECRET})`,
  note: "added handler in webhook.ts",
  files: ["webhook.ts"],
  tools: ["Edit"],
});
const journal = readFileSync(join(dir, `${day}.md`), "utf8");
assert.ok(journal.includes("payment webhook"), "turn was captured");
assert.ok(!journal.includes(SECRET), "SECRET is NOT on disk (redacted before write)");
assert.ok(journal.includes("⟨REDACTED:"), "secret shows as a redaction marker on disk");

// 5) context injection carries the timeline + digest
const ctx = s.buildContext();
assert.ok(ctx.includes("Work history") && ctx.includes("payment webhook"), "buildContext injects memory");

// 6) recall / search / day reads
const hits = s.searchScribe("payment webhook");
assert.ok(hits.length >= 1 && hits[0].date === day, "searchScribe finds the turn");
assert.ok(s.listDays().includes(day), "listDays includes today");
assert.ok(s.readDay(day).includes("webhook.ts"), "readDay returns the day's journal");

// 7) opt out -> injection stops immediately
s.setScribeConsent(false);
assert.equal(s.buildContext(), "", "no context after opt-out");

console.log(`SCRIBE SMOKE: all assertions passed ✓  (store: ${dir})`);
