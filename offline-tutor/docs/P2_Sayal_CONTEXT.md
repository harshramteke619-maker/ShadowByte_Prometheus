# PROJECT CONTEXT (shared by all 4 members): ED-02 Offline-First AI Learning Assistant
Hackathon, **4 hours total**. Team: **P1 Harsh** (Brain), **P2 Sayal** (Voice + i18n), **P3 Rutuja** (Frontend + PWA, **integration owner**), **P4 Zaid** (Data, gamification, sync, repo owner).

## What we are building
A PWA that works **fully offline (airplane mode)** on low-end Android: bite-sized STEM lessons + quiz with XP/streaks, a chat tutor (curated Q&A retrieval first, small quantized LLM on top), local voice in/out in English/Hindi/Marathi, lesson-pack sharing by QR/file, and a sync badge that flips to "Synced" when internet returns.
Out of scope for now: pitch/slides, full curriculum, pre-recorded audio, WebGPU, auth, real backend, WebRTC (stretch only).

## Golden rules (read twice)
1. **Reliable path first, AI on top.** Curated answer must always work; the SLM only improves it.
2. **Edit only your own folder.** Never edit someone else's files. Need a change? Message the owner.
3. **Cross-module calls go ONLY through `src/api.ts`.** Never `import '../brain'` etc. from another module.
4. **`src/contract/types.ts` is frozen after 0:15.** Changes need all 4 to agree in the group chat.
5. **Mocks:** `src/config.ts` has `USE_MOCK = {brain, voice, data}`. Everyone builds against mocks from minute 0. When YOUR real module passes its checklist, flip YOUR flag to `false`, push, and tell Rutuja.
6. **Never throw into the UI.** `askTutor` and `listen` never reject: return a fallback / `''`.
7. **Git:** branches `harsh/brain`, `sayal/voice`, `rutuja/ui`, `zaid/data`. Pull `main` + merge into your branch every 30 min. Rutuja merges to `main`. Commit small. Do not commit model files (`*.gguf`, `public/models/*` are gitignored).
8. **HTTPS early:** service workers and the microphone only work on `localhost` or HTTPS. Phone testing over `http://192.168.x.x` will NOT work. Rutuja deploys a build to an HTTPS host (Netlify / Vercel / GitHub Pages) by ~1:00 so everyone can test on a real phone.
9. **Models are never downloaded live in the demo.** Load once on the demo phone with internet, verify after restart in airplane mode.
10. **Feature freeze at 3:15.** After that, bug fixes and demo runs only.

## Repo setup (Zaid, first 10 min)
```bash
npm create vite@latest offline-tutor -- --template react-ts
cd offline-tutor
npm i dexie fuse.js pako qrcode html5-qrcode @wllama/wllama @huggingface/transformers
npm i -D tailwindcss @tailwindcss/vite vite-plugin-pwa @types/pako
# copy the skeleton's src/, public/, docs/, .gitignore over the Vite files, then:
git init && git add . && git commit -m "skeleton" && git push
```
Everyone else: `git clone`, `npm i`, `npm run dev`.

## Folder structure and OWNERS
```
offline-tutor/
├── docs/                         # context files (this file)
├── public/
│   ├── data/
│   │   ├── content.json          # P4 Zaid: modules + quiz (EN/HI/MR)
│   │   └── qa.json               # P1 Harsh: curated Q&A for retrieval
│   ├── icons/                    # P3 Rutuja: PWA icons (192, 512)
│   └── models/                   # gitignored: local GGUF/ONNX files if used
├── src/
│   ├── contract/types.ts         # FROZEN shared types (nobody edits alone)
│   ├── config.ts                 # USE_MOCK flags (each owner flips their own)
│   ├── api.ts                    # ONLY cross-module import point
│   ├── main.tsx, App.tsx         # P3
│   ├── brain/                    # P1 Harsh
│   │   ├── index.ts              #   exports BrainAPI
│   │   ├── retrieval.ts          #   Fuse.js search over qa.json
│   │   ├── slmClient.ts          #   talks to worker, timeout, streaming
│   │   ├── slm.worker.ts         #   wllama in a Web Worker
│   │   └── prompts.ts            #   tiny prompts per language
│   ├── voice/                    # P2 Sayal
│   │   ├── index.ts              #   exports VoiceAPI
│   │   ├── listen.ts             #   record + Whisper, Web Speech fallback
│   │   ├── speak.ts              #   speechSynthesis + voice picking
│   │   └── whisper.worker.ts     #   Transformers.js ASR in a worker
│   ├── i18n/                     # P2 Sayal
│   │   ├── index.ts              #   exports i18n (I18NAPI)
│   │   └── strings.ts            #   ALL UI strings EN/HI/MR
│   ├── data/                     # P4 Zaid
│   │   ├── index.ts              #   exports DataAPI
│   │   ├── db.ts                 #   Dexie schema
│   │   ├── progress.ts           #   progress + mastery
│   │   ├── quiz.ts               #   quiz access
│   │   ├── gamification.ts       #   XP, level, streak, badges
│   │   ├── pack.ts               #   export/import lesson pack (pako)
│   │   └── sync.ts               #   online/offline queue + status
│   ├── mocks/                    # fake brain/voice/data so UI works from minute 0
│   ├── pwa/                      # P3: SW registration, offline status hook
│   └── ui/                       # P3
│       ├── screens/              #   Home, Lesson, Quiz, Chat, Share, Setup
│       ├── components/           #   OfflineBadge, MicButton, AnswerCard, LangToggle...
│       └── hooks/
├── vite.config.ts                # P3 (vite-plugin-pwa + tailwind)
└── package.json                  # Zaid sets up; add deps by telling the group
```

## The contract (full code in `src/contract/types.ts`)
| Owner | Function | Notes |
|---|---|---|
| Harsh | `initBrain(onProgress?)` | lazy; call when chat opens |
| Harsh | `askTutor(question, lang, onToken?) -> Promise<TutorAnswer>` | never rejects. `TutorAnswer = {text, source: 'curated'\|'slm'\|'fallback', matchedId?, ms}` |
| Harsh | `getBrainStatus()` | `curated-only \| slm-loading \| slm-ready` |
| Sayal | `initVoice(onProgress?)`, `listen(lang) -> string`, `stopListening()` | `''` on failure; lazy-loads Whisper |
| Sayal | `speak(text, lang)`, `stopSpeaking()`, `getVoiceStatus()` | silent no-op if no voice |
| Sayal | `i18n.t(key, lang?)`, `getLang()`, `setLang()`, `onLangChange(cb)` | all UI text lives in `strings.ts` |
| Zaid | `initData()`, `getModules()`, `getQuiz(id)` | seeds from `/data/content.json` |
| Zaid | `getProgress()`, `saveProgress(patch)`, `updateMastery(id, correct)`, `addXP(n)`, `completeModule(id)` | mastery 0..1 |
| Zaid | `exportPack(ids?)`, `importPack(str)` | compressed base64 |
| Zaid | `getSyncStatus()`, `onSyncStatus(cb)` | `offline \| pending \| syncing \| synced` |
`Lang = 'en' | 'hi' | 'mr'`.

## Data shapes
- **content.json:** `{version, modules:[{id, subject, title:{en,hi,mr}, explanation:{en,hi,mr}, visual, quiz:[{id, moduleId, q:{..}, options:{en:[..],hi:[..],mr:[..]}, answerIndex, hint?}]}]}`
- **qa.json:** `{version, entries:[{id, keywords:[..], q:{en,hi,mr}, a:{en,hi,mr}}]}`

## Timeline and sync points
| Time | Everyone |
|---|---|
| 0:00-0:15 | Zaid pushes skeleton. All read this file. Agree contract. |
| 0:15-1:30 | Build own module against mocks. |
| **1:00** | Rutuja deploys HTTPS build. Sayal and Harsh test on a real phone. |
| **1:30** | Sync 1: text question in chat returns a curated answer; lessons + quiz render. |
| 1:30-2:30 | Flip mocks to real, one module at a time. |
| **2:30** | Sync 2: voice -> answer -> speak works; quiz saves XP in IndexedDB. |
| 2:30-3:15 | SLM, QR share, sync badge, polish. |
| **3:15** | FEATURE FREEZE. |
| 3:15-4:00 | Airplane-mode test x3 on the demo phone, backup screen recording, fixes only. |

**Priority if time runs out:** (1) offline PWA + lessons + quiz + IndexedDB progress, (2) curated chat, (3) voice, (4) SLM, (5) QR share + sync badge.

## How to use your AI assistant (Claude / ChatGPT)
Paste this whole file as the first message, then say: *"I am <name>, <role>. Help me build only my module, following the contract exactly. Write TypeScript. Do not change other folders or types.ts."* Ask it for one file at a time and test each before the next.

---
# YOUR ROLE: P2 SAYAL - Voice (STT + TTS) and Language (i18n)
**You own:** `src/voice/*` and `src/i18n/*`. **Export:** `VoiceAPI` from `src/voice/index.ts` and `i18n` from `src/i18n/index.ts`.
**Consumers:** Rutuja's UI (mic button, speaker button, language toggle, every screen label).

## `listen(lang) -> Promise<string>`
1. Record from the mic (MediaRecorder or AudioWorklet -> 16 kHz mono Float32). Stop on button tap or after ~8 s max.
2. Transcribe with **Whisper in Transformers.js** (`pipeline('automatic-speech-recognition', ...)`) using **whisper-base** (whisper-tiny as lighter fallback). Set `language` explicitly to `'hindi'`, `'marathi'`, or `'english'` and `task:'transcribe'`; auto-detect is worse. Run in `whisper.worker.ts`.
3. **Lazy-load:** load Whisper only in `initVoice()` (first mic tap), with `onProgress`. Transformers.js caches model files in the browser; verify they load in airplane mode.
4. **Fallback:** if Whisper is not ready or fails, try the Web Speech API (`SpeechRecognition`, lang `en-IN`/`hi-IN`/`mr-IN`). If that also fails, return `''`. **Never reject.**
5. Rutuja shows the transcript in an **editable box** before sending, so small errors are fine.

## `speak(text, lang)`
- Use `speechSynthesis`. Voices on Android load asynchronously: wait for `onvoiceschanged` (with a timeout).
- Pick voice by language prefix (`hi`, `mr`, `en`). If no Marathi voice exists, fall back to a Hindi voice (same Devanagari script). If no voice at all, resolve silently.
- `getVoiceStatus()` returns `{sttReady, ttsVoices:{en,hi,mr}}` so Rutuja can hide the speaker button when unavailable.
- `stopSpeaking()` cancels current speech.

## i18n
- `strings.ts` holds **every** UI string as `{key: {en,hi,mr}}`. Rutuja will message you for new keys; keep a running list. Add keys proactively: buttons, chat placeholders, quiz feedback ("Correct!", "Try again"), setup/download screen text, share screen text, offline/sync labels, error messages.
- Language persists in localStorage (`lang`). `setLang` must notify `onLangChange` subscribers.

## Your timeline
| Time | Task |
|---|---|
| 0:15-0:45 | Expand `strings.ts` (30-40 keys). `speak()` working with voice picking. |
| 0:45-1:30 | Recording + Web Speech fallback `listen()` working. **Test on a real Android phone via Rutuja's HTTPS build at ~1:00** (mic needs HTTPS). |
| 1:30 | **Flip `USE_MOCK.voice=false`** (even if only Web Speech works). |
| 1:30-2:30 | Whisper worker + caching + progress. |
| 2:30-3:15 | Pick the **10 phrases per language that transcribe reliably** and give the list to the team for demo. |
| 3:15+ | Bug fixes only. |

## Definition of done
- [ ] Mic tap -> transcript for EN/HI/MR on a real phone
- [ ] Whisper works offline after first load; fallback kicks in when it does not
- [ ] `speak()` works for EN and HI; MR falls back gracefully
- [ ] Language toggle switches all UI text instantly
- [ ] No unhandled promise rejection from `listen`/`speak`

## Pitfalls
Mic and service workers need HTTPS/localhost. Whisper-base accuracy in Marathi is limited, so keep queries short. Do not run Whisper on the main thread. Free the model memory when not needed.

---
