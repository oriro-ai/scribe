export { isScribeEnabled, setScribeConsent, hasScribeChoice } from "./consent.js";
export { scribeTurn, buildContext, noteUserInput, takePendingUserInput, type ScribeTurnInput } from "./context.js";
export { supervisedCapture } from "./supervisor.js";
export { captureTurn, readDigest, type TurnRecord, type CaptureResult } from "./capture.js";
export { listDays, readDay, searchScribe, type ScribeHit } from "./retrieval.js";
export { readTimeline } from "./digest.js";
export { redact, containsSecret, type RedactionResult, type RedactionSummary } from "./redact.js";
export { readHealth, recordHealth, recordFault } from "./health.js";
export { walAppend, walCommit, walPending, walCompact } from "./wal.js";
export { scribeDir, journalFile, digestFile, timelineFile, artifactsDir } from "./paths.js";
export { appendJournal, readJournal } from "./journal.js";
export { updateDigest, updateTimeline, readDigest as readScribeDigest } from "./digest.js";
//# sourceMappingURL=index.d.ts.map