// THE ONLY IMPORT POINT for cross-module calls. UI imports from here. Never import ../brain etc. directly.
import type { BrainAPI, VoiceAPI, DataAPI } from './contract/types';
import { USE_MOCK } from './config';
import * as brainReal from './brain';
import * as voiceReal from './voice';
import * as dataReal from './data';
import * as brainMock from './mocks/brain.mock';
import * as voiceMock from './mocks/voice.mock';
import * as dataMock from './mocks/data.mock';
export { i18n } from './i18n';
export const brain: BrainAPI = USE_MOCK.brain ? brainMock : brainReal;
export const voice: VoiceAPI = USE_MOCK.voice ? voiceMock : voiceReal;
export const data: DataAPI = USE_MOCK.data ? dataMock : dataReal;
