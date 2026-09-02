import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "catalog", "generated", "catalog.json"), "utf8"));
const benchmarkPath = path.join(root, "catalog", "routing-scenarios.json");

async function readBenchmark() {
  return JSON.parse(await readFile(benchmarkPath, "utf8"));
}

test("routing benchmark covers every canonical skill as a primary owner", async () => {
  const benchmark = await readBenchmark();
  const primaries = new Set(benchmark.scenarios.map((scenario) => scenario.primary).filter(Boolean));
  const canonical = catalog.skills.map((skill) => skill.slug);

  assert.deepEqual([...primaries].sort(), [...canonical].sort());
});

test("routing scenarios reference only canonical methods and never duplicate ownership", async () => {
  const benchmark = await readBenchmark();
  const slugs = new Set(catalog.skills.map((skill) => skill.slug));
  const ids = new Set();

  assert.equal(benchmark.schemaVersion, 1);
  assert.ok(Array.isArray(benchmark.scenarios));

  for (const scenario of benchmark.scenarios) {
    assert.ok(typeof scenario.id === "string" && scenario.id.length > 0);
    assert.ok(!ids.has(scenario.id), `duplicate routing scenario id: ${scenario.id}`);
    ids.add(scenario.id);

    assert.ok(typeof scenario.prompt === "string" && scenario.prompt.length >= 20);
    assert.ok(typeof scenario.rationale === "string" && scenario.rationale.length >= 20);
    assert.ok(Array.isArray(scenario.supporting));
    assert.ok(Array.isArray(scenario.excluded));

    if (scenario.primary !== null) assert.ok(slugs.has(scenario.primary), `unknown primary: ${scenario.primary}`);
    assert.equal(new Set(scenario.supporting).size, scenario.supporting.length, `${scenario.id}: duplicate supporting method`);
    assert.equal(new Set(scenario.excluded).size, scenario.excluded.length, `${scenario.id}: duplicate excluded method`);
    assert.ok(!scenario.supporting.includes(scenario.primary), `${scenario.id}: primary duplicated as supporting`);
    assert.ok(!scenario.excluded.includes(scenario.primary), `${scenario.id}: primary cannot also be excluded`);

    for (const slug of [...scenario.supporting, ...scenario.excluded]) {
      assert.ok(slugs.has(slug), `${scenario.id}: unknown referenced method ${slug}`);
    }
  }
});

test("routing benchmark includes deliberate no-skill and overlap-boundary scenarios", async () => {
  const benchmark = await readBenchmark();
  const noSkill = benchmark.scenarios.filter((scenario) => scenario.primary === null);
  assert.ok(noSkill.length >= 2, "benchmark should include at least two deliberate no-skill scenarios");
  assert.ok(noSkill.every((scenario) => scenario.supporting.length === 0), "no-skill scenarios cannot have supporting methods");

  const ids = new Set(benchmark.scenarios.map((scenario) => scenario.id));
  for (const id of [
    "brand-voice-vs-conversion",
    "conversion-vs-ux-copy",
    "editing-vs-humanizing",
    "architecture-vs-boundaries-vs-refactor",
    "security-review-boundaries",
    "testing-layer-boundaries",
    "frontend-fidelity-chain",
    "review-vs-shipping",
    "method-selection-vs-skill-authoring",
    "codebase-current-vs-future-architecture",
    "codebase-evidence-vs-engineering-plan",
    "codebase-test-impact-vs-test-strategy",
    "execution-trace-vs-root-cause",
    "semantic-search-vs-text-match",
    "codegraph-optional-runtime",
    "codegraph-explicit-setup",
    "codebase-context-sufficiency",
    "codegraph-runtime-present",
    "codegraph-runtime-inconclusive",
    "codegraph-no-mutation-authorization",
    "codebase-text-match-is-not-structure",
  ]) {
    assert.ok(ids.has(id), `missing routing boundary scenario: ${id}`);
  }
});

test("Codebase Intelligence boundaries have exact routing contracts", async () => {
  const benchmark = await readBenchmark();
  const scenarios = new Map(benchmark.scenarios.map((scenario) => [scenario.id, scenario]));
  const expected = {
    "codebase-current-vs-future-architecture": {
      primary: "mapping-existing-codebase-structure",
      supporting: [],
      excluded: ["designing-software-boundaries"],
    },
    "codebase-evidence-vs-engineering-plan": {
      primary: "planning-codebase-changes-with-evidence",
      supporting: [],
      excluded: ["planning-engineering-work"],
    },
    "codebase-test-impact-vs-test-strategy": {
      primary: "analyzing-change-blast-radius",
      supporting: [],
      excluded: ["designing-test-strategies"],
    },
    "execution-trace-vs-root-cause": {
      primary: "tracing-code-execution-paths",
      supporting: [],
      excluded: ["investigating-codebase-semantically"],
    },
    "semantic-search-vs-text-match": {
      primary: "investigating-codebase-semantically",
      supporting: [],
      excluded: ["mapping-existing-codebase-structure"],
    },
    "codegraph-optional-runtime": {
      primary: "mapping-existing-codebase-structure",
      supporting: [],
      excluded: [],
    },
    "codegraph-explicit-setup": {
      primary: null,
      supporting: [],
      excluded: [],
    },
    "codebase-context-sufficiency": {
      primary: "planning-codebase-changes-with-evidence",
      supporting: [],
      excluded: [],
    },
    "codegraph-runtime-present": {
      primary: "tracing-code-execution-paths",
      supporting: [],
      excluded: ["investigating-codebase-semantically"],
    },
    "codegraph-runtime-inconclusive": {
      primary: "tracing-code-execution-paths",
      supporting: [],
      excluded: ["investigating-codebase-semantically"],
    },
    "codegraph-no-mutation-authorization": {
      primary: "mapping-existing-codebase-structure",
      supporting: [],
      excluded: [],
    },
    "codebase-text-match-is-not-structure": {
      primary: "investigating-codebase-semantically",
      supporting: [],
      excluded: [
        "mapping-existing-codebase-structure",
        "tracing-code-execution-paths",
        "analyzing-change-blast-radius",
      ],
    },
  };

  for (const [id, contract] of Object.entries(expected)) {
    assert.deepEqual(
      scenarios.has(id)
        ? {
            primary: scenarios.get(id).primary,
            supporting: scenarios.get(id).supporting,
            excluded: scenarios.get(id).excluded,
          }
        : undefined,
      contract,
      `${id}: unexpected routing contract`,
    );
  }
});

test("routing benchmark represents every active pack through at least one primary method", async () => {
  const benchmark = await readBenchmark();
  const primarySlugs = new Set(benchmark.scenarios.map((scenario) => scenario.primary).filter(Boolean));

  for (const pack of catalog.packs.filter((entry) => entry.status === "active")) {
    assert.ok(pack.skillSlugs.some((slug) => primarySlugs.has(slug)), `active pack has no primary routing scenario: ${pack.slug}`);
  }
});
