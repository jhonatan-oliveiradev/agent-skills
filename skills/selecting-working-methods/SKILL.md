---
name: selecting-working-methods
description: Use when a task could match multiple Agent Skills, the owning method is unclear, or a minimal ordered set of working methods must be chosen before execution.
---

# Selecting Working Methods

## Principle
Route the task before executing it. Choose the smallest sufficient set of methods that owns the real work, then delegate execution to those methods.

## Selection workflow
1. Restate the task as the decisions or transformations that must happen, not as prompt keywords.
2. Choose one **primary method** that owns the central decision, change, or investigation.
3. Add another method only when it owns a separate responsibility the primary method does not cover.
4. Prefer the **smallest sufficient** set. Do not load a whole pack merely because one member applies.
5. Order selected methods by dependency: discovery and architecture before implementation; verification, security review, or delivery when their required artifact exists.
6. When methods overlap, prefer the most specific method for the decision at hand. Broader methods may frame the work but should not duplicate execution.
7. If no skill materially improves the task, select **no skill**. A forced match is worse than normal reasoning.
8. State the chosen method or ordered method sequence briefly, then **delegate**. This router does not execute the specialized workflow itself.

## Ownership test
Before adding a method, identify what it owns:
- **Artifact owner:** the method responsible for the main thing being produced or changed.
- **Stage owner:** the method responsible for the current lifecycle stage; do not preload a later-stage method before its input exists.
- **Verification owner:** a review or testing method may verify the artifact without becoming a second implementation owner.

Do not use a supporting method to redo the primary method. If two candidates claim the same artifact and stage, choose the more specific owner and exclude the other unless the task contains a genuinely separate responsibility.

## Routing examples
- Build a Next.js screen from a Figma source: `translating-figma-to-nextjs` first; add `auditing-pixel-perfect-frontend` for visual verification when needed.
- Refactor a problematic backend boundary: `designing-software-boundaries` → `planning-safe-refactors`.
- Fix a reproduced defect: use the domain-specific method for the cause; add `building-regression-tests` to preserve the broken contract when appropriate.
- Review and then ship a pull request: `reviewing-pull-requests` evaluates the change; `shipping-github-vercel-changes` enters only when repository or deployment delivery is requested.
- Turn a recurring method into a new skill: `turning-techniques-into-skills`; do not use this router as an authoring substitute.

## Codebase evidence routing
Route by intent, not by runtime. Use Codebase Intelligence to understand an existing implementation; Architecture & Engineering to decide future structure; Engineering Workflow to turn approved direction into executable work; Quality & Testing to define proof; and systematic debugging to establish root cause. An available graph runtime changes evidence acquisition, not method ownership.

## Guardrails
- Do not treat tags, categories, or pack membership as proof that a method applies.
- Do not select two methods to perform the same responsibility.
- Do not preload future-stage methods before their inputs exist.
- Re-route if evidence changes the nature of the task during execution.
- Runtime does not determine method ownership.
- Use Codebase Intelligence to understand an existing codebase or current structure before future design.
