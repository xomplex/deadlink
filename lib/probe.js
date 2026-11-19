// Liveness probe — distinguishes "server answers" from "network/DNS dead"
// without ever calling a CORS-blocked responder "dead".

/**
 * Probe a URL with a CORS-safe no-cors fetch.
 * @returns {'alive'|'dead'|'unknown'}
 * - resolves (opaque or readable)  -> server answered -> 'alive'
 * - rejects with a network error    -> DNS/connection failure -> 'dead'
 * - anything else / timeout         -> 'unknown' (never presented as dead)
 */
export async function probeLiveness(url, timeoutMs = 20000, fetchImpl = fetch) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    await fetchImpl(url, { mode: 'no-cors', signal: ctrl.signal, redirect: 'follow' });
    return 'alive';
  } catch (err) {
    if (err && err.name === 'AbortError') return 'unknown';
    // TypeError 'Failed to fetch' covers DNS failure, refused connection,
    // and CORS rejections alike — but a CORS rejection means the server
    // DID answer, so we cannot call it dead. no-cors mode prevents CORS
    // rejections entirely, so a rejection here is a genuine network failure.
    return 'dead';
  } finally {
    clearTimeout(timer);
  }
}
