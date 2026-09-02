import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

test("stable repository keeps only canonical workflow files", async () => {
  const workflows = (await readdir(".github/workflows"))
    .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
    .sort();

  assert.deepEqual(workflows, ["validate.yml"]);
});
