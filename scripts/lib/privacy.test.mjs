import assert from "node:assert/strict";
import test from "node:test";

import { containsForbiddenPrivateData, forbiddenPrivatePatterns } from "./privacy.mjs";

test("exposes one shared private-data policy", () => {
  assert.equal(forbiddenPrivatePatterns.length, 5);
  assert.equal(containsForbiddenPrivateData("ghp_abcdefghijklmnopqrstuvwxyz"), true);
  assert.equal(containsForbiddenPrivateData("https://docs.example.com/public"), false);
});
