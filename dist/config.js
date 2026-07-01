// ORIRO Scribe, config root. Everything lives under ~/.oriro (Cardinal Rule: local-only, never
// leaves the device). Override the whole state dir with ORIRO_STATE_DIR, or point the scribe store
// alone with ORIRO_SCRIBE_DIR (see paths.ts). Standalone shim, replaces the ORIRO CLI's ../utils.js.
import { homedir } from "node:os";
import { join } from "node:path";
/** Root of ORIRO's on-device state (default ~/.oriro; override with ORIRO_STATE_DIR). */
export const CONFIG_DIR = process.env.ORIRO_STATE_DIR?.trim() || join(homedir(), ".oriro");
//# sourceMappingURL=config.js.map