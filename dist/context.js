// ORIRO Scribe — framework-agnostic wiring. Three primitives any agent/router uses:
//   • scribeTurn  — record one completed turn (gated on consent; never throws — supervisedCapture
//                   guarantees a scribe fault can't break the turn),
//   • buildContext — a no-fail context blob (full-history timeline + rolling digest) read DIRECTLY
//                    off disk, so it works even mid-failover (the read is decoupled from writer health),
//   • noteUserInput — record the user's exact input just before prompting, so it pairs with the reply.
// Wire these into your own agent loop; see examples/. (The ORIRO CLI's Pi-specific tool registration
// lives in the private CLI; this package is the portable engine any model can call.)
import { existsSync, readFileSync } from "node:fs";
import { readDigest } from "./capture.js";
import { isScribeEnabled } from "./consent.js";
import { timelineFile } from "./paths.js";
import { supervisedCapture } from "./supervisor.js";
/** Scribe one completed turn — gated on consent; never throws (supervisedCapture guarantees it). */
export function scribeTurn(input) {
    if (!isScribeEnabled())
        return;
    const ts = new Date().toISOString();
    supervisedCapture({ ts, date: ts.slice(0, 10), ...input });
}
// The caller (REPL / channel host) knows the user's exact input — record it just before prompting so
// it pairs with the assistant reply on turn end. Without this the journal captured only the AI's reply,
// so user-stated facts were never recalled across sessions.
let pendingUserInput = "";
export function noteUserInput(text) {
    pendingUserInput = text;
}
export function takePendingUserInput() {
    const u = pendingUserInput;
    pendingUserInput = "";
    return u;
}
/** No-fail injection: full-history timeline + rolling digest, read straight off disk (decoupled from
 *  writer health). Empty string when consent is off or nothing is recorded yet. Fold this into the
 *  system/context of the next turn so the router always starts already in context. */
export function buildContext() {
    if (!isScribeEnabled())
        return "";
    const parts = [];
    try {
        const t = timelineFile();
        if (existsSync(t))
            parts.push(`# Work history — every day so far\n${readFileSync(t, "utf8").trim()}`);
    }
    catch {
        /* read must never break the turn */
    }
    try {
        const d = readDigest();
        if (d?.trim())
            parts.push(`# Current context (recent)\n${d.trim()}`);
    }
    catch {
        /* idem */
    }
    if (!parts.length)
        return "";
    return `${parts.join("\n\n")}\n\n(Call scribe_recall to fetch the full text of any past day or topic.)`;
}
//# sourceMappingURL=context.js.map