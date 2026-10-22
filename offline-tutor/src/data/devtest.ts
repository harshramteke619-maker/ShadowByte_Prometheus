// Dev-only: attach data API to window for console testing
// Usage: open browser console → window.__data.getProgress()

if (import.meta.env.DEV) {
  void import('./index').then((api) => {
    (window as unknown as Record<string, unknown>).__data = api;
  });
}
