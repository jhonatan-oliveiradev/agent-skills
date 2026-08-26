# Review Gates

## Ordered review

Run cheaper deterministic gates before subjective visual review.

| Gate | Evidence |
|---|---|
| Spec | Required parts, units, axes, hierarchy, evidence state |
| Geometry | Finite vertices, valid indices, normals, bounds, no accidental zero-area parts |
| Placement | Pivots, attachments, floor contact, component containment |
| Multi-angle | Front, rear, sides, and relevant three-quarter captures |
| Interior detail | Identity-critical differences inside the silhouette |
| Material | Region ownership, colors under neutral light, roughness/metalness behavior |
| Runtime | Typecheck/build, creation, disposal, repeat instantiation |
| Action | Pivots, sockets, collision or destruction behavior |
| Rig | Weight sums, influence count, bind state, joint hierarchy |
| Pose stress | Shoulders, elbows, hips, knees, neck, secondary parts, extreme poses |
| Performance | Target-device frame behavior and approved budget |

A clean global silhouette does not prove facial, clothing, hardware, or interior detail accuracy. Review critical regions separately.

## Correction loop

For each pass:

1. capture fixed review views;
2. record deterministic gate results;
3. compare evidence-supported regions;
4. identify the dominant defect;
5. choose one correction group;
6. change either the spec or the code;
7. recapture all affected views;
8. record whether the result improved, regressed, or stayed flat.

Choose exactly one next action:

- `continue`: current pass and critical regions meet approved gates;
- `refine-spec`: evidence interpretation, hierarchy, proportions, or acceptance rules are wrong;
- `refine-code`: implementation disagrees with a sound spec;
- `request-input`: missing evidence or a user choice controls success;
- `stop`: requested fidelity is infeasible or the loop has plateaued.

## Camera discipline

Lock a comparison camera before judging likeness. A camera correction can change the apparent silhouette, landmarks, and proportions without changing geometry. Do not mix camera and geometry edits in the same diagnostic step.

## Single-view subjects

- Score visible views for likeness only.
- Review hidden views for continuity and plausibility.
- Mark mirrored or designed surfaces as inferred.
- Do not average unsupported views into a flattering global score.

## Animation gate

A rig payload is necessary but insufficient. Run representative clips and extreme poses, then inspect:

- collapsing joints and lost volume;
- weight discontinuities and detached vertices;
- clothing/hair penetration;
- inverted normals and broken bounds;
- secondary-part anchors;
- root motion and floor contact;
- repeated playback and teardown.

Only then use “animation-ready.”
