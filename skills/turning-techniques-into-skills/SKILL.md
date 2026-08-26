---
name: turning-techniques-into-skills
description: Use when a useful workflow, implementation pattern, debugging method, design technique, or repeated prompt should become a reusable Agent Skill for future projects.
---

# Turning Techniques into Skills

## Principle
A skill is a reusable operating procedure, not a postmortem. Create it only when the judgment or workflow will recur across projects.

## Authoring workflow
1. Define the trigger: what observable task or symptom should cause an agent to load this skill?
2. Capture a baseline scenario where an agent without the skill would likely make the wrong tradeoff.
3. Write the smallest workflow that prevents those failures.
4. Add defaults, acceptance checks, and common mistakes.
5. Keep `SKILL.md` concise; move heavy reference material or scripts into supporting files.
6. Test the trigger and workflow against realistic pressure cases.
7. Refine vague wording until the skill produces a consistent decision path.

## Frontmatter
Use a hyphenated action-oriented name. The description should begin with `Use when...` and describe triggering conditions, not summarize the workflow.

## Do not create a skill for
- a one-off project convention better suited to `AGENTS.md`;
- a trivial fact available in normal docs;
- purely mechanical rules better enforced by lint/tests;
- a story about how one bug was fixed.
