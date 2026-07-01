import { type CaptureResult, type TurnRecord } from "./capture.js";
/** Supervised, durable, self-healing capture. Returns null on (logged) failure; never throws. */
export declare function supervisedCapture(rec: TurnRecord): CaptureResult | null;
//# sourceMappingURL=supervisor.d.ts.map