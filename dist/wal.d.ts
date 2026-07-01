import type { TurnRecord } from "./capture.js";
export declare function walAppend(id: string, rec: TurnRecord): void;
export declare function walCommit(id: string): void;
/** Entries written but not yet committed (i.e. not durably journaled). */
export declare function walPending(): {
    id: string;
    rec: TurnRecord;
}[];
/** Rewrite the WAL keeping only still-pending entries (bounded growth). */
export declare function walCompact(): void;
//# sourceMappingURL=wal.d.ts.map