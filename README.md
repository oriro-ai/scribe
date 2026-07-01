# 🧠 Scribe, the memory layer for every AI-Router.

**A local-first, consent-gated, redacted, crash-safe work journal that lets any AI model stay in context across every session so work is never lost and never has to start over.**

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE) ![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg) ![deps](https://img.shields.io/badge/runtime%20deps-0-success.svg) ![built by ORIRO](https://img.shields.io/badge/built%20by-ORIRO-black.svg)

Built inside the [ORIRO](https://github.com/oriro-ai) CLI, now open for everyone. Zero runtime dependencies. Pure Node/TypeScript. Everything stays on your machine.


## The problem: AI has amnesia

Every AI assistant forgets the moment a session ends. The decisions you made, the files you changed, the bug you finally cracked, the approach you agreed on gone. Tomorrow you re-explain, re-paste, re-derive. The model that felt like a capable collaborator yesterday shows up today as a stranger.

That amnesia is the single biggest reason agents feel *shallow*: brilliant for one conversation, useless as a continuous coworker. A model that forgets can't build on its own work, honor earlier decisions, or improve from what it did before.

**Scribe fixes the amnesia.** It gives any AI router a durable, on-device memory of the work itself and quietly feeds that memory back into every new session, so the model always arrives *already in context*.

## The vision: every router stays in context, while it works

Scribe was built on one conviction: **the AI should remember the work the way a good colleague does automatically, privately, and without being asked.** Not a chat log in someone's cloud. A *working memory* that belongs to you, runs in the background, and is **model-agnostic** so *any* model reads from the same memory and one can pick up exactly where another left off. Memory becomes a first-class capability, owned by the person doing the work.

---

## Install

```bash
# from GitHub (recommended today)
npm install github:oriro-ai/scribe

# or pin a tag
npm install github:oriro-ai/scribe#v1.0.0
```

> Requires Node ≥ 18. Zero runtime dependencies Scribe is pure Node (`fs`/`path`/`os`).

## Quick start

```ts
import { setScribeConsent, scribeTurn, buildContext, searchScribe } from "@oriro/scribe";

setScribeConsent(true);                          // opt in (Scribe is OFF by default)

// record a completed turn — secrets/PII are redacted BEFORE anything touches disk
scribeTurn({
  user: "wire the payment webhook",
  note: "added the handler in webhook.ts",
  files: ["webhook.ts"],
  tools: ["Edit"],
});

// NEXT session — fold this into your prompt so the model starts already in context
const context = buildContext();

// recall past work on demand (great behind a `scribe_recall` tool your model can call)
const hits = searchScribe("payment webhook");
```

Run the live demo: `node examples/quick-start.mjs`.

## What you get

- **Automatic, per-turn capture.** Record every completed turn the request, what the model did, the tools it ran, the files it touched. No manual saving.
- **Two always-fresh views of memory:**
  - a **rolling digest** the "markdown of the markdown," hard-capped in size so it injects into any prompt *in a flash*;
  - a **full-history timeline** ~one line per day, day one → today, so the router can never forget that something happened.
- **No-fail context injection.** `buildContext()` reads the timeline + digest **straight off disk** — decoupled from the writer, so the model gets its context even mid-recovery.
- **On-demand recall.** Full-text search across every day (`searchScribe`), or read a whole day (`readDay`) expose it to your model as a `scribe_recall` tool and it recovers its own decisions, code, and files.
- **Defense-in-depth redaction before disk.** Every field is scrubbed for secrets/PII *before a byte is written*: private keys, provider API keys, tokens, JWTs, emails, phones, URL credentials → stable `⟨REDACTED:label⟩` markers, with a post-write self-audit. **The memory can never become the leak.**
- **Crash-safe, zero-loss durability.** Synchronous, `fsync`'d writes + a write-ahead log (pending → commit), so a captured turn is never lost not even on a crash.
- **A self-healing, three-role writer.** **Primary** writes; **Standby** instantly retries on failure (the entry is already safe in the WAL); **Medic** logs the fault and replays pending WAL entries across crashes/restarts. It **never throws into your turn**.
- **Consent-gated + reversible.** Off by default; one call to opt in, one to opt out. Local, inspectable, reversible.
- **Model-agnostic + deterministic.** No LLM runs the memory — plain, auditable logic that behaves identically for every router.

## How it works

```
   your turn
      │
      ▼
 ┌──────────┐   redact BEFORE disk   ┌───────────┐   fsync    ┌──────────────┐
 │ capture  │ ─────────────────────▶ │  redact   │ ─────────▶ │ dated journal│  (YYYY-MM-DD.md)
 └──────────┘  (secrets/PII → marker)└───────────┘            └──────┬───────┘
      │                                                              │ distil
      │  WAL: add(pending) → commit                                  ▼
      │  (3-role Primary / Standby / Medic)                ┌───────────────────┐
      │                                                    │ digest (recent)   │  bounded, injectable
      ▼                                                    │ timeline (1/day)  │  full-history skeleton
 self-audit (re-scan journal + digest)                     └─────────┬─────────┘
                                                                     │ inject (no-fail, off disk)
                                                                     ▼
                                                    ROUTER starts already in context
                                                    (+ scribe_recall to fetch any past day/topic)
```

## Wire it into any agent loop

Three primitives fold into whatever agent framework you use:

```ts
import { setScribeConsent, noteUserInput, scribeTurn, buildContext, searchScribe, readDay } from "@oriro/scribe";

setScribeConsent(true);

// 1) at the START of a turn — inject memory + record the exact user input
messages.unshift({ role: "system", content: buildContext() }); // no-op string when OFF/empty
noteUserInput(userText);

// 2) at the END of a turn — record what happened (redacted automatically)
scribeTurn({ user: userText, router: "my-model", note: assistantReply, files, tools });

// 3) expose recall as a tool your model can call
function scribe_recall({ query, day }) {
  return day ? readDay(day) : searchScribe(query);
}
```

That's the whole integration. Any model — yours, ours, anyone's — now stays in context.

## API

| Function | What it does |
|---|---|
| `setScribeConsent(on: boolean)` | Opt in/out. **Default OFF.** |
| `isScribeEnabled()` / `hasScribeChoice()` | Current state / whether a choice was made. |
| `scribeTurn(input)` | Record a completed turn (gated, redacted, crash-safe; never throws). |
| `buildContext()` | The injectable timeline + digest (empty string when OFF). |
| `noteUserInput(text)` | Record the user's exact input just before prompting. |
| `searchScribe(query, limit?)` | Full-text search across every day → `{ date, line, text }[]`. |
| `readDay(date)` / `listDays()` | Read one day's journal / list all recorded days. |
| `readTimeline()` / `readScribeDigest()` | The raw timeline / digest. |
| `redact(text)` / `containsSecret(text)` | The secret/PII scrubber (used internally; exposed for reuse). |
| `supervisedCapture(record)` / `captureTurn(record)` | Lower-level capture (supervised = crash-safe; raw = one-shot). |
| `readHealth()` | Writer heartbeat + fault count. |

Full types ship with the package (`.d.ts`).

## Guarantees (never compromised)

- **Local-only.** Everything stays under `~/.oriro/scribe/`. Nothing is ever uploaded, synced, or sent anywhere.
- **Redacted before disk.** Raw secrets/PII never persist replaced with markers before the write, re-audited after.
- **Consent-gated, default OFF.** Records/injects nothing until you opt in; reversible any time.
- **Crash-safe.** WAL + self-healing writer; capture never throws and never loses a committed turn.

## Storage layout

```
~/.oriro/scribe/
├── 2026-07-01.md      # dated, append-only journal (one file per day)
├── _digest.md         # rolling, size-capped "recent context"
├── _timeline.md       # ~one line per day, day one → today
├── _wal.jsonl         # write-ahead log (crash recovery)
├── _health.json       # writer heartbeat + fault count
├── _faults.log        # durable fault log
└── artifacts/         # oversized fields kept in full, referenced from the journal
```

Override the location with `ORIRO_SCRIBE_DIR` (the scribe store) or `ORIRO_STATE_DIR` (all ORIRO state).

## Why Scribe is different

| | Typical "chat history" | **Scribe** |
|---|---|---|
| Where it lives | A vendor's cloud | **Your device, only** |
| Privacy | Content stored server-side | **Redacted before disk; never leaves the machine** |
| Who can use the memory | One product / one model | **Any model — model-agnostic** |
| Re-entering a session | You scroll / re-paste | **Auto-injected: digest + full timeline** |
| On failure | You lose the thread | **WAL + self-healing writer = zero loss** |
| Cost / dependency | Paid API, network | **Free, local, deterministic — no LLM in the loop** |
| Control | Opaque | **Consent-gated, inspectable, reversible** |

---

Most of the industry is racing to make models *smarter for one prompt*. Scribe is a different bet: that the thing between a clever assistant and a genuine collaborator is **continuity** remembering the work, privately, and carrying it forward. Turn it on once; from then on, the work remembers itself.

**Built by ORIRO. Open to all.** Issues and PRs welcome.

## License

[Apache-2.0](./LICENSE) © ORIRO ([oriro-ai](https://github.com/oriro-ai)).
