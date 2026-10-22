// src/brain/index.ts (Owned by P1 Harsh)
import { BrainAPI } from '../contract/types';
import { mockBrain } from '../mocks/mockBrain';

// Harsh will replace this with real Fuse.js + wllama implementation
export const brain: BrainAPI = mockBrain;
export default brain;
