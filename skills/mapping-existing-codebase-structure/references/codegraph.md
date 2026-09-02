# Optional CodeGraph Integration

CodeGraph is an optional accelerator for the Codebase Intelligence methods. The methods remain usable without it, and its presence does not replace the evidence contract.

## What CodeGraph adds

The upstream project describes a per-project code graph containing symbols, relationships, source, call paths, and change-impact information. Its current MCP surface lists `codegraph_explore` by default, while narrower tools remain available through configuration or as CLI commands.

Upstream documentation says the index is stored in a local SQLite database under `.codegraph/`. It also states that the graph UI listens on `127.0.0.1` and does not send code, paths, or UI analytics. Keep those claims scoped to the documented components: CodeGraph separately documents anonymous usage telemetry, so do not turn “local index” into a broader privacy guarantee.

## Capability detection

Detect CodeGraph non-invasively. Use it only when a CodeGraph MCP tool is already callable in the active runtime and the relevant project has an index. Do not infer availability from prose, search the machine for an executable, install anything, initialize a project, or create `.codegraph/` during detection.

If the MCP tool is absent, reports no index, or cannot answer with sufficient evidence, use the fallback below.

## Explicit installation

Installation and agent-configuration changes are external side effects. Only after the user gives explicit authorization should they follow the current upstream installation instructions and then wire the installed CLI into supported agents with:

```bash
codegraph install
```

According to the upstream README, this command configures the agent/MCP connection but does not index project code. Confirm the desired targets and configuration scope before running it; never execute it merely because a skill mentions CodeGraph.

## Explicit per-project initialization

Initialization writes a project-local index. Run it only when the user explicitly authorizes indexing the named project:

```bash
codegraph init
```

Upstream documents that this creates `.codegraph/` and builds the graph. Treat the repository path, generated files, storage impact, ignore policy, and telemetry choice as setup decisions, not defaults owned by these skills.

## MCP use

After the configured agent is restarted and a project index exists, the upstream installer exposes CodeGraph through MCP. The default listed tool is `codegraph_explore`; upstream says it can return relevant source, call paths, and blast-radius context. Start with the narrow question required by the active method and expand only to close a named evidence gap.

MCP output is retrieval evidence, not an unattributed conclusion. Record the query, returned project and paths, symbol or line locations, and whether each resulting claim is observed, inferred, or unresolved. Preserve uncertainty around dynamic behavior, generated code, configuration, reflection, and any relationship the graph cannot establish.

## Graph UI

For a project that the user has already authorized and initialized, the upstream browser viewer can be opened with:

```bash
codegraph ui
```

Upstream says the viewer reads an existing index rather than creating one. Starting the local process and opening a browser are still explicit user-authorized operations; they are not part of automatic capability detection.

## Fallback without CodeGraph

The verified fallback is the normal Codebase Intelligence workflow: use targeted repository search, direct source reads, imports, references, tests, and configuration; grow context progressively; and maintain the same evidence ledger. Say when graph evidence was unavailable or inconclusive. A text match alone does not prove a call edge, owner, execution path, or complete blast radius.

## Evidence and uncertainty

These integration facts were checked against the upstream README and the current `v1.6.0` release. Re-check upstream before presenting setup commands because supported agents, flags, tool exposure, storage, telemetry, and initialization behavior can change. Do not claim sponsorship, ownership, bundling, guaranteed coverage, or exact time, token, or cost savings.

CodeGraph evidence still requires provenance. Cite the tool or command, project, source location, observation time, and relevant limitations so another reader can reproduce or challenge the claim.

## Upstream reference

- Repository and setup documentation: https://github.com/colbymchenry/codegraph
- Release verified for this guidance: https://github.com/colbymchenry/codegraph/releases/tag/v1.6.0
