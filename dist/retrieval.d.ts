export interface ScribeHit {
    date: string;
    line: number;
    text: string;
}
/** All recorded days (YYYY-MM-DD), oldest → newest. */
export declare function listDays(): string[];
/** Full text of one day's journal (empty string if none). */
export declare function readDay(date: string): string;
/** Case-insensitive full-text search across every day's journal (newest-first scan). */
export declare function searchScribe(query: string, limit?: number): ScribeHit[];
//# sourceMappingURL=retrieval.d.ts.map