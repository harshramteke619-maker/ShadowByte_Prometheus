// Client for communicating with the SLM Web Worker
import type { InitProgress } from '../contract/types';

let worker: Worker | null = null;
let isInitialized = false;

export async function initSLMClient(
  onProgress?: (p: InitProgress) => void
): Promise<void> {
  if (isInitialized) return;

  try {
    // Create worker using Vite's worker import syntax
    // This will be bundled by Vite automatically
    const workerUrl = new URL('./slm.worker.ts', import.meta.url);
    worker = new Worker(workerUrl, { type: 'module' });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('SLM initialization timeout'));
      }, 120000); // 2 minute timeout for model download

      worker!.onmessage = (e) => {
        if (e.data.type === 'init-complete') {
          clearTimeout(timeout);
          isInitialized = true;
          resolve();
        } else if (e.data.type === 'error') {
          clearTimeout(timeout);
          reject(new Error(e.data.payload.message));
        }
      };

      worker!.onerror = (error) => {
        clearTimeout(timeout);
        reject(error);
      };

      // Send init message
      worker!.postMessage({
        type: 'init',
        payload: {
          onProgress: (pct: number) => {
            onProgress?.({ stage: 'Downloading AI model', pct });
          }
        }
      });
    });
  } catch (error) {
    console.error('Failed to initialize SLM client:', error);
    throw error;
  }
}

export async function generateWithSLM(
  prompt: string,
  onToken?: (token: string) => void
): Promise<string> {
  if (!worker || !isInitialized) {
    throw new Error('SLM not initialized');
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('SLM generation timeout'));
    }, 10000); // 10 second timeout per generation

    worker!.onmessage = (e) => {
      if (e.data.type === 'generate-complete') {
        clearTimeout(timeout);
        resolve(e.data.payload);
      } else if (e.data.type === 'error') {
        clearTimeout(timeout);
        reject(new Error(e.data.payload.message));
      }
    };

    worker!.onerror = (error) => {
      clearTimeout(timeout);
      reject(error);
    };

    worker!.postMessage({
      type: 'generate',
      payload: {
        prompt,
        onToken: (token: string) => {
          if (onToken) {
            onToken(token);
          }
        }
      }
    });
  });
}

export function abortSLM(): void {
  if (worker) {
    worker.postMessage({ type: 'abort' });
  }
}

export function isSLMReady(): boolean {
  return isInitialized;
}

export function cleanupSLM(): void {
  if (worker) {
    worker.terminate();
    worker = null;
    isInitialized = false;
  }
}
