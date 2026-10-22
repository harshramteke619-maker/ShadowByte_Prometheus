// src/api.ts
// The ONLY cross-module interface for the application
// All UI screens and components MUST import brain, voice, data, and i18n from here

import { USE_MOCK } from './config';
import { mockBrain } from './mocks/mockBrain';
import { mockVoice } from './mocks/mockVoice';
import { mockData } from './mocks/mockData';
import { mockI18n } from './mocks/mockI18n';
import { BrainAPI, VoiceAPI, DataAPI, I18NAPI } from './contract/types';

// Real modules will be plugged in by team members as they flip USE_MOCK flags
export const brain: BrainAPI = mockBrain;
export const voice: VoiceAPI = mockVoice;
export const data: DataAPI = mockData;
export const i18n: I18NAPI = mockI18n;

export * from './contract/types';
