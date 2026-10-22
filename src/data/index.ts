// src/data/index.ts (Owned by P4 Zaid)
import { DataAPI } from '../contract/types';
import { mockData } from '../mocks/mockData';

// Zaid will replace this with Dexie DB + pako pack compression
export const data: DataAPI = mockData;
export default data;
