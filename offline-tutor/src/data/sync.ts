import type { SyncStatus } from '../contract/types';
import { db } from './db';

type Listener = (s: SyncStatus) => void;

let _status: SyncStatus = 'offline';
const _listeners = new Set<Listener>();
let _debounceTimer: ReturnType<typeof setTimeout> | null = null;
let _listenersStarted = false;

function setStatus(s: SyncStatus): void {
  _status = s;
  for (const cb of _listeners) {
    try { cb(s); } catch { /* never throw */ }
  }
}

async function mockUpload(): Promise<void> {
  setStatus('syncing');
  await new Promise<void>((r) => setTimeout(r, 1200));
  try {
    await db.syncQueue.clear();
  } catch { /* swallow */ }
  setStatus('synced');
}

function handleOnline(): void {
  void mockUpload();
}

function handleOffline(): void {
  setStatus('offline');
}

export function startSyncListeners(): void {
  if (_listenersStarted) return;
  _listenersStarted = true;
  _status = (typeof navigator !== 'undefined' && navigator.onLine) ? 'pending' : 'offline';
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

export function getSyncStatus(): SyncStatus {
  return _status;
}

export function onSyncStatus(cb: Listener): () => void {
  _listeners.add(cb);
  try { cb(_status); } catch { /* never throw */ }
  return () => { _listeners.delete(cb); };
}

export function enqueueSnapshot(): void {
  if (_debounceTimer) clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(() => {
    _debounceTimer = null;
    void (async () => {
      try {
        await db.syncQueue.add({ ts: Date.now() });
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          void mockUpload();
        } else {
          setStatus('offline');
        }
      } catch {
        setStatus(_status === 'offline' ? 'offline' : 'pending');
      }
    })();
  }, 1000);
}
