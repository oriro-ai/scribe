export interface RedactionSummary {
    label: string;
    count: number;
}
export interface RedactionResult {
    text: string;
    redactions: RedactionSummary[];
}
/** Redact secrets/PII. Returns the safe text plus a per-label tally. */
export declare function redact(input: string): RedactionResult;
/** True if the text still contains a raw secret/PII pattern (post-redaction self-audit). */
export declare function containsSecret(text: string): boolean;
//# sourceMappingURL=redact.d.ts.map