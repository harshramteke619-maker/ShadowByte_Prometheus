// Web Worker for SLM using @wllama/wllama
// This runs in a separate thread to avoid blocking the UI
// Import via Vite's worker syntax in slmClient.ts

import { Wllama } from '@wllama/wllama';

let wllama: Wllama | null = null;
let isLoaded = false;

// Model configuration - using a small quantized model
const MODEL_CONFIG = {
  // Using SmolLM2-360M-Instruct Q4 (very small, ~200MB)
  // Alternative: Qwen2.5-0.5B-Instruct Q4 (~400MB)
  modelUrl: 'https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct-GGUF/resolve/main/SmolLM2-360M-Instruct-Q4_K_M.gguf',
  nCtx: 512, // Context window size
  nThreads: (navigator as any).hardwareConcurrency || 2,
  temperature: 0.3,
  maxTokens: 80
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  try {
    switch (type) {
      case 'init':
        await initModel(payload.onProgress);
        self.postMessage({ type: 'init-complete' });
        break;

      case 'generate':
        const result = await generateText(payload.prompt, payload.onToken);
        self.postMessage({ type: 'generate-complete', payload: result });
        break;

      case 'abort':
        if (wllama) {
          try {
            await wllama.abort();
          } catch (e) {
            // Ignore abort errors
          }
        }
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      payload: { message: (error as Error).message }
    });
  }
};

async function initModel(onProgress?: (pct: number) => void) {
  if (isLoaded && wllama) return;

  wllama = new Wllama({
    allowOffline: true, // Allow loading from cache
    progressCallback: (progress: any) => {
      if (onProgress) {
        onProgress(Math.round(progress.pct * 100));
      }
    }
  });

  await wllama.loadModelFromUrl(MODEL_CONFIG.modelUrl, {
    nCtx: MODEL_CONFIG.nCtx,
    nThreads: MODEL_CONFIG.nThreads
  });

  isLoaded = true;
}

async function generateText(
  prompt: string,
  onToken?: (token: string) => void
): Promise<string> {
  if (!wllama || !isLoaded) {
    throw new Error('Model not loaded');
  }

  let fullText = '';

  await wllama.createCompletion({
    prompt,
    nPredict: MODEL_CONFIG.maxTokens,
    temperature: MODEL_CONFIG.temperature,
    sampling: {
      topK: 40,
      topP: 0.95,
      minP: 0.05
    },
    onToken: (token: string) => {
      fullText += token;
      if (onToken) {
        onToken(token);
      }
    }
  });

  return fullText.trim();
}
