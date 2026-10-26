/** How long the managed OpenCode spawn waits for the sidecar to print its listening line. */
export const DEFAULT_ENGINE_SPAWN_TIMEOUT_MS = 15_000;

/**
 * An explicit option wins, then OPENWORK_ENGINE_SPAWN_TIMEOUT_MS, then the default.
 * Anything that is not a positive number is ignored, like the other OPENWORK_ENGINE_* overrides.
 */
export function resolveEngineSpawnTimeoutMs(explicit?: number, env: Record<string, string | undefined> = process.env): number {
  if (typeof explicit === "number" && Number.isFinite(explicit) && explicit > 0) return explicit;
  const fromEnv = Number(env.OPENWORK_ENGINE_SPAWN_TIMEOUT_MS);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_ENGINE_SPAWN_TIMEOUT_MS;
}
