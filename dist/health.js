// ORIRO Scribe, health + fault log for the supervised writer (5A.3). Deterministic,
// local, no LLM. The Medic records faults here and the heartbeat proves liveness.
import { closeSync, fsyncSync, mkdirSync, openSync, readFileSync, writeFileSync, writeSync, } from "node:fs";
import { join } from "node:path";
import { scribeDir } from "./paths.js";
function healthFile() {
    return join(scribeDir(), "_health.json");
}
function faultLogFile() {
    return join(scribeDir(), "_faults.log");
}
function read() {
    try {
        return JSON.parse(readFileSync(healthFile(), "utf8"));
    }
    catch {
        return { faultCount: 0 };
    }
}
function write(h) {
    mkdirSync(scribeDir(), { recursive: true });
    writeFileSync(healthFile(), `${JSON.stringify(h, null, 2)}\n`, "utf8");
}
/** Heartbeat: a successful write happened just now. */
export function recordHealth() {
    const h = read();
    h.lastWriteAt = new Date().toISOString();
    write(h);
}
/** Medic: append a fault to the durable fault log and bump the count. Never throws. */
export function recordFault(role, err) {
    try {
        mkdirSync(scribeDir(), { recursive: true });
        const msg = `${new Date().toISOString()} [${role}] ${err instanceof Error ? err.message : String(err)}`;
        const fd = openSync(faultLogFile(), "a");
        try {
            writeSync(fd, `${msg}\n`);
            fsyncSync(fd);
        }
        finally {
            closeSync(fd);
        }
        const h = read();
        h.faultCount = (h.faultCount ?? 0) + 1;
        h.lastFault = msg;
        write(h);
    }
    catch {
        /* health logging must never break the writer */
    }
}
export function readHealth() {
    return read();
}
//# sourceMappingURL=health.js.map