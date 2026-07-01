export interface ScribeTurnInput {
    user?: string;
    router?: string;
    tools?: string[];
    files?: string[];
    note?: string;
    context?: string;
}
/** Scribe one completed turn — gated on consent; never throws (supervisedCapture guarantees it). */
export declare function scribeTurn(input: ScribeTurnInput): void;
export declare function noteUserInput(text: string): void;
export declare function takePendingUserInput(): string;
/** No-fail injection: full-history timeline + rolling digest, read straight off disk (decoupled from
 *  writer health). Empty string when consent is off or nothing is recorded yet. Fold this into the
 *  system/context of the next turn so the router always starts already in context. */
export declare function buildContext(): string;
//# sourceMappingURL=context.d.ts.map