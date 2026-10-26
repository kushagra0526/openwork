import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_ENGINE_SPAWN_TIMEOUT_MS, resolveEngineSpawnTimeoutMs } from "../src/spawn-timeout.js";

test("keeps the 15 second default when nothing is set", () => {
  assert.equal(DEFAULT_ENGINE_SPAWN_TIMEOUT_MS, 15_000);
  assert.equal(resolveEngineSpawnTimeoutMs(undefined, {}), 15_000);
});

test("OPENWORK_ENGINE_SPAWN_TIMEOUT_MS overrides the default", () => {
  assert.equal(resolveEngineSpawnTimeoutMs(undefined, { OPENWORK_ENGINE_SPAWN_TIMEOUT_MS: "45000" }), 45_000);
});

test("an explicit option wins over the environment", () => {
  assert.equal(resolveEngineSpawnTimeoutMs(20_000, { OPENWORK_ENGINE_SPAWN_TIMEOUT_MS: "45000" }), 20_000);
});

test("zero, negative, empty and non-numeric values fall back", () => {
  for (const raw of ["0", "-5", "", "abc", "NaN", "Infinity"]) {
    assert.equal(resolveEngineSpawnTimeoutMs(undefined, { OPENWORK_ENGINE_SPAWN_TIMEOUT_MS: raw }), 15_000, raw);
  }
  assert.equal(resolveEngineSpawnTimeoutMs(0, { OPENWORK_ENGINE_SPAWN_TIMEOUT_MS: "30000" }), 30_000);
});

test("reads process.env by default", () => {
  const before = process.env.OPENWORK_ENGINE_SPAWN_TIMEOUT_MS;
  process.env.OPENWORK_ENGINE_SPAWN_TIMEOUT_MS = "31000";
  try {
    assert.equal(resolveEngineSpawnTimeoutMs(), 31_000);
  } finally {
    if (before === undefined) delete process.env.OPENWORK_ENGINE_SPAWN_TIMEOUT_MS;
    else process.env.OPENWORK_ENGINE_SPAWN_TIMEOUT_MS = before;
  }
});
