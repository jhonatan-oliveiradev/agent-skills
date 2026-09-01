# ChatGPT distribution

Agent Skills Studio uses one canonical source tree: `skills/<slug>/SKILL.md`. ChatGPT distribution does not create a second copy of a method and does not use the filesystem installer target used by Codex-compatible runtimes or Claude Code.

ChatGPT currently supports two relevant distribution paths for this repository.

## Upload one Skill

Eligible ChatGPT Business, Enterprise, Healthcare, and Edu users can manage Skills from the ChatGPT plugin directory, subject to workspace settings, role, surface, region, and rollout availability.

In ChatGPT:

1. Open **Plugins**.
2. Open the **Skills** tab.
3. Select **Create**.
4. Select **Upload from computer**.
5. Review the Skill before installing it. Uploaded Skills can contain instructions, supporting files, and code, and ChatGPT performs a safety check before making them available.

Use the canonical Skill source from this repository. Do not create a ChatGPT-specific fork of `SKILL.md`.

## Import the Agent Skills Studio plugin from GitHub

Workspace administrators can import a plugin marketplace from GitHub and keep it synchronized with repository updates.

Repository source:

`https://github.com/jhonatan-oliveiradev/agent-skills`

In an eligible ChatGPT workspace:

1. Open **Workspace settings → Plugins**.
2. Select **Add → Import marketplace**.
3. Use `https://github.com/jhonatan-oliveiradev/agent-skills` as the Source.
4. Leave Path empty because `.agents/plugins/marketplace.json` is at the repository root.
5. Leave Branch empty to follow the default branch, or pin a branch/tag/commit when intentional.
6. Import the marketplace, review the result, and configure the plugin installation policy for the intended roles.

The marketplace points to the repository-root native plugin. `.codex-plugin/plugin.json` points back to `./skills/`, so ChatGPT and Codex consume the same canonical methods.

This is a skills-only plugin: it does not require a connected app or authentication. The repository also intentionally avoids MCP declarations in this plugin because imported plugins that declare MCP servers can be marked **Desktop only** and therefore cannot run in ChatGPT on the web.

## Availability and product boundaries

The Plugin directory is visible across ChatGPT plans, but installing or invoking a specific plugin depends on plan, workspace settings, role, region, surface, and the capabilities included by the plugin. Personal Skills are generally available to eligible Business, Enterprise, Healthcare, and Edu users and can be governed separately from Codex Skills.

The Agent Skills Studio website can document and package these distribution paths, but it cannot silently install a Skill or bypass ChatGPT workspace permissions. Installation remains an explicit ChatGPT action.

## Official OpenAI references

- Skills in ChatGPT: https://help.openai.com/en/articles/20001066-skills-in-chatgpt
- Plugins in ChatGPT and Codex: https://help.openai.com/en/articles/20001256-plugins-in-codex/
- Importing and syncing plugin marketplaces from GitHub: https://help.openai.com/en/articles/20001504
