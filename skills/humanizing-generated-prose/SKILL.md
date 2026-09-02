---
name: humanizing-generated-prose
description: Use when supplied prose sounds generic, formulaic, over-polished, or recognizably AI-shaped and needs a more natural human rhythm while preserving facts, meaning, citations, protected text, and any supplied writer voice.
---

# Humanizing Generated Prose

## Overview

Rewrite generic generated prose into a deliberate human draft without changing its factual payload or pretending to know who authored it. Humanization is a fidelity-sensitive edit, not detector evasion.

## Protect the Source First

Before changing style, identify protected material. Unless the user explicitly puts it in scope, preserve quotations, citations, links, code, identifiers, proper nouns, numbers, dates, product names, legal language, and other exact strings whose mutation could change evidence or behavior.

If the user supplies a voice sample, infer only observable traits such as sentence density, directness, vocabulary range, formality, punctuation habits, and use of first person. Do not caricature a person or invent biographical mannerisms.

## Diagnose the Draft

Look for patterns that make the prose feel generated rather than assuming any single marker proves AI authorship:

- generic throat-clearing before the actual point;
- repeated sentence shapes and paragraph lengths;
- stacked abstractions with few concrete nouns or actions;
- inflated adjectives, empty significance claims, or vague praise;
- mechanical transition words between every paragraph;
- symmetrical lists or repeated rule-of-three structures without semantic need;
- unnecessary restatement of the prompt or conclusion;
- excessive hedging or certainty not supported by the source;
- canned openings, summaries, and closing invitations.

Do not impose arbitrary bans on punctuation or vocabulary. A dash, colon, heading, or transition is a problem only when its use is repetitive, unnatural for the target voice, or obscures meaning.

## Rewrite

1. Put the concrete point earlier.
2. Replace abstraction with source-supported actors, actions, objects, and consequences.
3. Vary sentence length where the idea benefits from it; do not manufacture randomness.
4. Remove redundant transitions and let adjacent ideas connect directly when the relationship is clear.
5. Keep useful asymmetry: not every section needs the same number of sentences, bullets, or rhetorical beats.
6. Preserve uncertainty at the same level as the source.
7. Match the supplied voice when evidence exists; otherwise prefer a neutral, natural, direct register.
8. Re-read against the original and restore any fact, qualification, citation, or protected span that drifted.

## Boundaries

- Do not optimize for AI-detector scores or claim that the result is human-authored; detector outputs are not a reliable writing-quality target.
- Do not fabricate anecdotes, opinions, sensory details, mistakes, slang, or personal experience to create fake authenticity.
- Use `editing-for-clarity-and-tone` when the main goal is conventional editorial improvement rather than generated-prose naturalization.
- Use `writing-brand-voice-and-messaging` when the task is to define a reusable verbal identity rather than adapt one draft.

## Completion Check

The revision should remain factually equivalent, preserve protected material, sound less templated at sentence and paragraph level, retain any distinctive supplied voice, and avoid replacing one rigid style recipe with another.
