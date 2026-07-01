/** Root of the scribe store (user-local). */
export declare function scribeDir(): string;
/** Dated append-only journal file for a given YYYY-MM-DD. */
export declare function journalFile(date: string): string;
/** The rolling, size-capped digest ("markdown of the markdown") injected to the router. */
export declare function digestFile(): string;
/** The compact full-history timeline skeleton (≈one line per day, spans day one → today). */
export declare function timelineFile(): string;
/** Side-store for oversized artifacts kept in full but referenced (not inlined) from the journal. */
export declare function artifactsDir(): string;
//# sourceMappingURL=paths.d.ts.map