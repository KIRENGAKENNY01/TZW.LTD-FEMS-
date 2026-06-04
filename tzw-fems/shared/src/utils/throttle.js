const lastRun = new Map();

/** Run async fn at most once per intervalMs per key */
export const throttleAsync = async (key, intervalMs, fn) => {
  const now = Date.now();
  const prev = lastRun.get(key) ?? 0;
  if (now - prev < intervalMs) return;
  lastRun.set(key, now);
  await fn();
};
