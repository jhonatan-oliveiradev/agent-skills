---
name: sprite-gen
description: Use when generating, editing, extracting, curating, animating, or exporting production-ready 2D game sprites, transparent frame sets, animation atlases, palette variants, layered rigs, or engine-ready sprite data with the bundled Sprite Gen pipeline.
license: Apache-2.0
metadata:
  upstream-version: "2.1.1"
---

# Sprite Gen

Use the bundled Sprite Gen runtime as the executable owner of 2D sprite production. Preserve the user's art direction and gameplay requirements while producing inspectable intermediate files, motion previews, transparent runtime assets, and machine-readable frame metadata.

## Start here

1. Resolve this skill directory as `SPRITE_GEN_ROOT`; never assume a checkout elsewhere.
2. Read [docs/user-workflow.md](docs/user-workflow.md).
3. Locate the environment-owned executable:
   - POSIX or WSL: `$SPRITE_GEN_ROOT/.venv/bin/sprite-gen`
   - native Windows: `$SPRITE_GEN_ROOT/.venv/Scripts/sprite-gen.exe`
4. If the environment is absent, explain that first-run setup creates a local virtual environment and installs the bundled Python package dependencies. Obtain confirmation before running the setup from [docs/interpreter.md](docs/interpreter.md). Do not fall back to an arbitrary global interpreter.
5. Run the appropriate read-only guide, passing choices already supplied by the user:

```bash
sprite-gen workflow --kind sprite
sprite-gen workflow --kind image
```

Ask only for choices the guide reports as unresolved. Always pass the resolved provider explicitly.

## Execution routes

| Request | Route | Read |
|---|---|---|
| Still/reference to sprite atlas | `prepare` → `gen-set` → `extract` → `compose-atlas` | [docs/atlas-workflow.md](docs/atlas-workflow.md) |
| Still/reference to animated video loops | `video-set` | [docs/video-pipeline.md](docs/video-pipeline.md) |
| Ordinary image generation or edit | `gen --provider codex|grok` | [docs/gen.md](docs/gen.md) |
| Directional consistency | `anchor` before dependent states | [docs/directional-anchor-workflow.md](docs/directional-anchor-workflow.md) |
| Existing sheet or uniform-background asset | `slice-sheet`, `cutout`, or `unpack-atlas` | [docs/sheet-slicing.md](docs/sheet-slicing.md) |
| Visual selection and correction | `curation` | [docs/curation.md](docs/curation.md) |
| Palette variants or layered equipment | `recolor`, `compose-layers` | [docs/recolor.md](docs/recolor.md), [docs/layer-tracks.md](docs/layer-tracks.md) |
| Runtime delivery | `export-pngs`, `export-aseprite`, atlas manifest | [docs/engine-export.md](docs/engine-export.md) |

Use `sprite-gen --help` for the installed command surface. Do not replace canonical extraction, alignment, curation, or atlas composition with temporary crop scripts while presenting the result as a Sprite Gen output.

## Production contract

- Lock the character silhouette, proportions, costume, equipment, palette, directions, states, frame budget, target scale, and engine needs before a full generation run.
- Use one-shot grid generation only as imported material; it is not a substitute for the component-row pipeline.
- Keep the original reference and run manifest with every deliverable.
- Inspect transparency against light and dark backgrounds.
- Judge animation through previews at target scale and speed, not only contact sheets.
- Reject duplicated pseudo-frames, foot sliding, silhouette drift, inconsistent weapons, broken directional anchors, clipping, chroma fringe, and visible loop teleports.
- Deliver checked files before offering the optional curation view.
- Treat cyclic locomotion as experimental until motion QA passes. Read [docs/qa-motion.md](docs/qa-motion.md).
- Export explicit frame rectangles and timing metadata. Never make the engine guess an irregular atlas as a grid.

## Provider boundaries

The Codex route requires an available Codex CLI/image-generation session. Grok image or video generation requires the user's own Grok login or `XAI_API_KEY`. Video processing additionally needs `ffmpeg`; exact animated WebP export needs `img2webp`. Report an unavailable provider or binary precisely and offer another supported route; never claim a generation or export that did not run.

Bundled from [aldegad/sprite-gen](https://github.com/aldegad/sprite-gen) v2.1.1 under Apache-2.0. Preserve [LICENSE](LICENSE) and [NOTICE](NOTICE) in redistributed copies.
