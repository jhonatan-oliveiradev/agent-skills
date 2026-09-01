# Claude Code support

Agent Skills Studio keeps `skills/<slug>/SKILL.md` as the single canonical skill source. The repository does not maintain Claude-specific copies of skills.

Claude Code follows the Agent Skills open standard and discovers skills from these local locations:

- personal: `~/.claude/skills/<skill-name>/SKILL.md`
- project: `.claude/skills/<skill-name>/SKILL.md`

Reference: https://code.claude.com/docs/en/skills

## Install for Claude Code

### Personal scope

Personal skills are available across local Claude Code projects.

```bash
./install.sh --target claude-code
```

```powershell
./install.ps1 --target claude-code
```

The default scope is `personal`, so the commands above install into `~/.claude/skills/`.

### Project scope

Run the installer from the project that should receive the skills:

```bash
/path/to/agent-skills/install.sh --target claude-code --scope project
```

```powershell
C:\path\to\agent-skills\install.ps1 --target claude-code --scope project
```

Project scope installs into `<current-working-directory>/.claude/skills/`.

### Select one skill or pack

All existing selection behavior is shared between Agent Skills and Claude Code targets:

```bash
./install.sh --target claude-code --skill craft-premium-motion
./install.sh --target claude-code --pack motion
```

```powershell
./install.ps1 --target claude-code --skill craft-premium-motion
./install.ps1 --target claude-code --pack motion
```

### Explicit destination

`--destination` remains the highest-priority location override after target/scope validation:

```bash
./install.sh --target claude-code --destination /custom/skills
```

## Backward compatibility

Calling the installers without `--target` keeps the existing Agent Skills behavior and installs personal skills into `~/.agents/skills/`:

```bash
./install.sh
```

```powershell
./install.ps1
```

The `agents` target currently supports only the `personal` scope. Claude Code supports `personal` and `project` scopes in this v1 integration.

## Compatibility policy

The portable contract remains the Agent Skills standard. Canonical skills should prefer standard frontmatter (`name`, `description`, and other standard fields when needed) rather than Claude Code-only extensions unless a future skill explicitly declares that dependency.

This keeps the same skill method usable by Codex/Agent Skills-compatible environments and Claude Code without maintaining divergent copies.
