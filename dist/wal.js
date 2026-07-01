// ORIRO Scribe, write-ahead log (5A.3). Every turn is recorded as durable "pending"
// BEFORE the journal write, and marked "commit" after. A crash or a failed write leaves
// the entry pending, so the supervisor replays it next turn, zero loss, ever.
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, writeFileSync, writeSync, } from "node:fs";
import { join } from "node:path";
import { scribeDir } from "./paths.js";
function walFile() {
    return join(scribeDir(), "_wal.jsonl");
}
function appendLine(obj) {
    mkdirSync(scribeDir(), { recursive: true });
    const fd = openSync(walFile(), "a");
    try {
        writeSync(fd, `${JSON.stringify(obj)}\n`);
        fsyncSync(fd);
    }
    finally {
        closeSync(fd);
    }
}
export function walAppend(id, rec) {
    appendLine({ t: "add", id, rec });
}
export function walCommit(id) {
    appendLine({ t: "commit", id });
}
/** Entries written but not yet committed (i.e. not durably journaled). */
export function walPending() {
    if (!existsSync(walFile()))
        return [];
    const committed = new Set();
    const adds = new Map();
    for (const line of readFileSync(walFile(), "utf8").split("\n")) {
        if (!line.trim())
            continue;
        try {
            const e = JSON.parse(line);
            if (e.t === "commit")
                committed.add(e.id);
            else if (e.t === "add" && e.rec)
                adds.set(e.id, e.rec);
        }
        catch {
            /* skip a torn line */
        }
    }
    const out = [];
    for (const [id, rec] of adds) {
        if (!committed.has(id))
            out.push({ id, rec });
    }
    return out;
}
/** Rewrite the WAL keeping only still-pending entries (bounded growth). */
export function walCompact() {
    if (!existsSync(walFile()))
        return;
    const pending = walPending();
    const body = pending.map((p) => JSON.stringify({ t: "add", id: p.id, rec: p.rec })).join("\n");
    writeFileSync(walFile(), body ? `${body}\n` : "", "utf8");
}
//# sourceMappingURL=wal.js.map