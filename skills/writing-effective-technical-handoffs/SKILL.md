---
name: writing-effective-technical-handoffs
description: Use when engineering work is being paused, delegated, moved to another session or agent, or transferred to another person and the next worker needs enough verified context to continue without rediscovery.
---

# Writing Effective Technical Handoffs

A technical handoff is a continuation artifact, not a chat transcript. Preserve the minimum verified context another engineer or agent needs to resume work accurately.

## Write for a cold reader
Assume the recipient has no active working memory. Include exact names and identifiers rather than relying on “this”, “that branch”, or “the failing test”.

Capture:
- the objective and current scope;
- current repository/product state;
- decisions already made and why;
- work completed, with concrete files/PRs/commits when relevant;
- verification evidence and the head/version it applies to;
- unresolved problems, hypotheses, and known failed approaches;
- constraints and explicit prohibitions;
- the next action in executable terms.

## Separate certainty levels
Label information by what it actually is:
- **confirmed** — directly observed in code, runtime, logs, tools, or accepted decisions;
- **hypothesis** — plausible but not yet proven;
- **planned** — intended future work that has not happened;
- **blocked** — cannot proceed until a named dependency or decision changes.

Never promote an earlier hypothesis into a confirmed fact just because it survived several conversations.

## Preserve evidence, not confidence
When status matters, record the evidence:
- exact test/check command and result;
- CI run/job identifier and head SHA;
- reproduction steps and observed output;
- migration/deployment state;
- open PR/issue and branch names.

Do not write “everything passes” when only a subset was run. Make it possible for the recipient to distinguish stale evidence from evidence for the current head.

## Preserve decision boundaries
Record decisions that should not be reopened casually, including the rationale and conditions that would justify revisiting them. Also record what was intentionally deferred so a future worker does not mistake deferral for omission.

Keep user or repository constraints explicit: merge policy, migration approval requirements, branch targets, forbidden tools, compatibility requirements, or other rules that materially affect execution.

## Compress without erasing causality
Prefer a concise state model over chronological narration. Include failed attempts only when they prevent repeated work or reveal a useful constraint. Remove conversational filler, speculation that no longer matters, and duplicated history.

Never include credentials, private tokens, secrets, or unnecessary personal information in a handoff.

## End with a restart point
Finish with one concrete next action and the conditions for considering it complete. If several actions are independent, order them by dependency or priority.

A good restart point answers: “What should I do first, against which exact state, and what evidence tells me I can move on?”

## Verification
Before handing off, check that a cold reader can determine:
- what the task is;
- what has actually happened;
- what remains uncertain;
- what must not be repeated or changed;
- where the authoritative artifacts live;
- what to do next.

## References
- Google Engineering Practices, Writing good CL descriptions: https://google.github.io/eng-practices/review/developer/cl-descriptions.html
- Google Engineering Practices, Small CLs: https://google.github.io/eng-practices/review/developer/small-cls.html
- GitHub Docs, Helping others review your changes: https://docs.github.com/en/pull-requests/concepts/helping-others-review-your-changes
