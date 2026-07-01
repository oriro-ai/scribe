import { readDigest } from "./digest.js";
import { type RedactionSummary } from "./redact.js";
export interface TurnRecord {
    /** ISO timestamp; caller supplies it (runtime has real time). */
    ts: string;
    /** YYYY-MM-DD bucket for the dated journal. */
    date: string;
    user?: string;
    router?: string;
    tools?: string[];
    files?: string[];
    note?: string;
    /** Optional context refresh (who/where/goal) for the digest. */
    context?: string;
}
export interface CaptureResult {
    journalDate: string;
    redactions: RedactionSummary[];
    bytes: number;
    auditClean: boolean;
}
/** Redact EVERY raw field of a turn record ONCE, up front, BEFORE any truncation/summarization.
 *  (Truncating/whitespace-collapsing first defeated the multiline private-key and long-token
 *  patterns and leaked real key material into the digest/timeline/WAL.) Idempotent: re-redacting
 *  an already-redacted record is a no-op, so the WAL can safely store the redacted form. */
export declare function redactRecord(rec: TurnRecord): {
    rec: TurnRecord;
    redactions: RedactionSummary[];
};
/** Capture one turn into the journal + digest + timeline. Synchronous and durable. */
export declare function captureTurn(rec: TurnRecord): CaptureResult;
/** Re-export digest reader for the (5A.2) injection layer + command. */
export { readDigest };
//# sourceMappingURL=capture.d.ts.map