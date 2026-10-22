// src/config.ts
// Integration flags - P3 maintains this checklist
// When a team member passes their module test checklist, flip their flag to false

export const USE_MOCK = {
  brain: true, // P1 Harsh flips to false when wllama/curated RAG ready
  voice: true, // P2 Sayal flips to false when Whisper/Web Speech ready
  data: true,  // P4 Zaid flips to false when Dexie DB & pako ready
};
