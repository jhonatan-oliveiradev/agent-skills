# Intake and Confidence

## Reference admission

Record before implementation:

| Field | Questions |
|---|---|
| Subject | Object, character, creature, environment, or hybrid? |
| Views | Which sides are visible? Is there a turntable or only one frame? |
| Camera | Orthographic, perspective, focal distortion, crop, unknown? |
| Visibility | Occlusion, transparency, motion blur, missing edges? |
| Identity | Which silhouette breaks, markings, hardware, facial or costume features make it recognizable? |
| Runtime | Browser, device class, target FPS, Three.js wrapper, interaction needs? |
| Output | Factory only, reusable component, GLB export, rig, collisions, destruction? |
| Freedom | Exact, likeness-maximized, stylized, or conceptually inspired? |

Reject a corrupt, inaccessible, tiny, or severely occluded reference. Request more views when unseen geometry materially affects the requested result.

## Confidence map

Assign each region:

- `observed`: directly visible with usable detail;
- `partially-observed`: visible but distorted or occluded;
- `inferred`: hidden and reconstructed by symmetry or design logic;
- `unsupported`: no defensible evidence.

Report confidence by region, not only one global score. An accepted inference is permission to design the hidden surface, not evidence that it matches an unseen original.

## Suitability verdict

Use one:

- `proceed`: references support the requested fidelity;
- `proceed-with-inference`: visible views can be matched, hidden areas are explicitly designed;
- `request-input`: another view, dimensions, runtime target, or style decision changes the result materially;
- `change-representation`: procedural code is inferior to GLB, authored mesh, sprite, billboard, or another pipeline;
- `stop`: the fidelity claim is impossible or misleading.

## Acceptance contract

Define:

1. review cameras and backgrounds;
2. features that are identity-critical;
3. measurements that can be derived from evidence;
4. user-approved proposed thresholds;
5. inferred surfaces and their design rules;
6. performance budget supplied by the target runtime;
7. claims that must not be made.

Do not assign numeric thresholds merely because a metric exists.
