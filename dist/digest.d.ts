/** Prepend a recent-activity line to the digest and trim to the cap (newest kept). */
export declare function updateDigest(summary: string, context?: string): void;
/** Add/merge a one-line topic under the given day in the timeline skeleton. */
export declare function updateTimeline(date: string, topic: string): void;
/** Read the current digest (for injection / the scribe command). */
export declare function readDigest(): string;
/** Read the timeline skeleton (for injection / the scribe command). */
export declare function readTimeline(): string;
//# sourceMappingURL=digest.d.ts.map