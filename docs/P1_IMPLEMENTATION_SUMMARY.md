# P1 Harsh - Brain Module Implementation Summary

## Files Created/Modified

### Core Brain Module Files
1. **src/brain/index.ts** - Main BrainAPI implementation
   - `initBrain()` - Loads QA data, optionally initializes SLM based on device memory
   - `askTutor()` - Retrieves curated answers, falls back to SLM or generic message
   - `getBrainStatus()` - Returns current brain mode and model cache status
   - Never rejects - always returns a fallback answer

2. **src/brain/retrieval.ts** - Fuse.js-based fuzzy search
   - `loadQAData()` - Loads qa.json from /data/qa.json
   - `normalizeQuestion()` - Normalizes input for search
   - `searchQA()` - Searches across all languages (EN/HI/MR)
   - `getBestMatch()` - Returns strong match (score < 0.3)
   - `getTopMatches()` - Returns top N matches for SLM context

3. **src/brain/prompts.ts** - Language-specific prompt building
   - `buildPrompt()` - Builds SLM prompt with context passages
   - Instructions in EN/HI/MR: "Answer ONLY from context, max 60 words"
   - Includes "I don't know" fallback instruction

4. **src/brain/slm.worker.ts** - Web Worker for SLM (wllama)
   - Uses @wllama/wllama library
   - Model: SmolLM2-360M-Instruct Q4 (~200MB) from HuggingFace
   - Context window: 512 tokens
   - Temperature: 0.3 for factual answers
   - Max tokens: 80
   - Runs in separate thread to avoid UI blocking
   - Supports offline loading from cache

5. **src/brain/slmClient.ts** - Client for worker communication
   - `initSLMClient()` - Initializes worker with progress callbacks
   - `generateWithSLM()` - Sends prompt to worker, streams tokens
   - `isSLMReady()` - Checks if SLM is initialized
   - 2-minute init timeout, 10-second generation timeout

### Data Files
6. **public/data/qa.json** - Extended to 15 entries
   - Covers photosynthesis, water cycle, plant parts, transpiration, etc.
   - Each entry has EN/HI/MR questions and answers (≤40 words)
   - Includes keywords for better fuzzy matching
   - Answers use local analogies where possible

## Implementation Details

### askTutor Flow
1. **Normalize question** (lowercase, trim punctuation)
2. **Retrieve** using Fuse.js over qa.json (threshold 0.4, searches all languages)
3. **Strong match** (score < 0.3) → return curated answer instantly (source: 'curated')
4. **Weak/no match + SLM ready** → build prompt with top-3 passages, ask SLM (source: 'slm')
   - 8-second timeout
   - Streams tokens via onToken callback
5. **SLM slow/error/not loaded** → return best curated passage or generic fallback (source: 'fallback')
6. **Always** fills `ms` (elapsed time)
7. **Never** rejects - always returns a TutorAnswer

### SLM Configuration
- **Model**: SmolLM2-360M-Instruct Q4_K_M.gguf
- **Size**: ~200MB (downloaded once, cached in browser)
- **Context**: 512 tokens
- **Temperature**: 0.3 (low temperature for factual answers)
- **Max tokens**: 80 (keeps answers short)
- **Threads**: navigator.hardwareConcurrency || 2
- **Low-memory devices**: Skips SLM if deviceMemory <= 2GB

### Fallback Strategy
- Curated answers always work (reliable path)
- SLM improves answers when available
- If SLM fails or times out → falls back to curated
- If no curated match → localized "I don't know offline" message
- Never throws errors to UI

## Compliance with Contract

✅ Exports exactly BrainAPI from src/brain/index.ts
✅ `initBrain(onProgress?)` - lazy load, progress callbacks
✅ `askTutor(question, lang, onToken?)` - never rejects, returns TutorAnswer
✅ `getBrainStatus()` - returns BrainStatus with mode and modelCached
✅ Uses Fuse.js for retrieval over qa.json
✅ Searches ALL languages (not just requested lang)
✅ Strong match → curated answer (reliable path first)
✅ SLM answers in requested language, max 60 words
✅ SLM timeout at 8 seconds, falls back cleanly
✅ Model lazy-loads in initBrain()
✅ Skips SLM on low-memory devices (deviceMemory <= 2)
✅ Progress callbacks for model download
✅ qa.json has ~15 entries with EN/HI/MR answers
✅ Answers are short (≤40 words) and factual
✅ Never throws into UI

## Testing Checklist

- [ ] 10 demo questions return sensible curated answer in EN, HI, MR
- [ ] Typo/mixed-language query still matches
- [ ] Unknown question returns fallback, never error
- [ ] SLM answers in under ~8s or falls back cleanly
- [ ] Model loads from cache in airplane mode after browser restart
- [ ] getBrainStatus() reflects reality

## Notes for Integration

1. **Flip USE_MOCK.brain to false** in src/config.ts when ready for Sync 1 (1:30)
2. **Rutuja should call** `brain.initBrain()` when chat screen opens
3. **Progress bar**: Show based on `onProgress({stage, pct})` callbacks
4. **Status display**: Use `brain.getBrainStatus()` to show mode to user
5. **Model download**: Happens on first init with internet, then cached
6. **Airplane mode test**: Download model once, close browser, enable airplane, reopen, test

## Dependencies Required in package.json
```json
{
  "dependencies": {
    "fuse.js": "^7.0.0",
    "@wllama/wllama": "^2.0.0"
  }
}
```

Note: The skeleton may not have package.json yet - Zaid needs to set up the Vite project with these dependencies.
