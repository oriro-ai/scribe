// ORIRO Scribe, public API. A local-first, consent-gated, redacted, crash-safe work journal that
// lets any AI router/agent stay in context across sessions. Zero runtime dependencies; pure Node.
//
// Quick start:
//   import { setScribeConsent, scribeTurn, buildContext, searchScribe } from "@oriro/scribe";
//   setScribeConsent(true);                       // opt in (default OFF)
//   scribeTurn({ user, note, files, tools });     // record a completed turn (redacted before disk)
//   const ctx = buildContext();                   // inject at the start of the next turn
//   const hits = searchScribe("payment webhook"); // recall past work on demand
//
// Everything lives under ~/.oriro/scribe/ (override: ORIRO_STATE_DIR / ORIRO_SCRIBE_DIR).
// ── Consent (default OFF; nothing is recorded or injected until you opt in) ──────────────────────
export { isScribeEnabled, setScribeConsent, hasScribeChoice } from "./consent.js";
// ── Wiring (fold these into your agent loop) ────────────────────────────────────────────────────
export { scribeTurn, buildContext, noteUserInput, takePendingUserInput } from "./context.js";
// ── Capture (supervised = crash-safe + never throws; captureTurn = raw one-shot) ────────────────
export { supervisedCapture } from "./supervisor.js";
export { captureTurn, readDigest } from "./capture.js";
// ── Recall / retrieval (full-text search, day reads, the timeline skeleton) ─────────────────────
export { listDays, readDay, searchScribe } from "./retrieval.js";
export { readTimeline } from "./digest.js";
// ── Redaction (runs automatically before every write; exposed for reuse/audit) ──────────────────
export { redact, containsSecret } from "./redact.js";
// ── Health / durability internals ───────────────────────────────────────────────────────────────
export { readHealth, recordHealth, recordFault } from "./health.js";
export { walAppend, walCommit, walPending, walCompact } from "./wal.js";
// ── Storage paths + lower-level stores (advanced) ───────────────────────────────────────────────
export { scribeDir, journalFile, digestFile, timelineFile, artifactsDir } from "./paths.js";
export { appendJournal, readJournal } from "./journal.js";
export { updateDigest, updateTimeline, readDigest as readScribeDigest } from "./digest.js";
//# sourceMappingURL=index.js.map