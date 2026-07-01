// ORIRO Scribe — local-only storage paths. Everything lives under the user's
// ~/.oriro/scribe/ (Cardinal Rule 2: never leaves the machine). The
// ORIRO_SCRIBE_DIR override exists for tests/demos so they never touch real state.
import { join } from "node:path";
import { CONFIG_DIR } from "./config.js";
/** Root of the scribe store (user-local). */
export function scribeDir() {
    const override = process.env.ORIRO_SCRIBE_DIR?.trim();
    return override && override.length > 0 ? override : join(CONFIG_DIR, "scribe");
}
/** Dated append-only journal file for a given YYYY-MM-DD. */
export function journalFile(date) {
    return join(scribeDir(), `${date}.md`);
}
/** The rolling, size-capped digest ("markdown of the markdown") injected to the router. */
export function digestFile() {
    return join(scribeDir(), "_digest.md");
}
/** The compact full-history timeline skeleton (≈one line per day, spans day one → today). */
export function timelineFile() {
    return join(scribeDir(), "_timeline.md");
}
/** Side-store for oversized artifacts kept in full but referenced (not inlined) from the journal. */
export function artifactsDir() {
    return join(scribeDir(), "artifacts");
}
//# sourceMappingURL=paths.js.map