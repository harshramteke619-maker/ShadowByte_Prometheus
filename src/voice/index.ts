// src/voice/index.ts (Owned by P2 Sayal)
import { VoiceAPI } from '../contract/types';
import { mockVoice } from '../mocks/mockVoice';

// Sayal will replace this with Whisper/Web Speech + Piper/SpeechSynthesis
export const voice: VoiceAPI = mockVoice;
export default voice;
