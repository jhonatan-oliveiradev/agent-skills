# Procedural Factory Contract

## Separation of concerns

Keep evidence and reconstruction parameters independent from Three.js runtime objects. The factory consumes validated data and creates fresh resources deterministically.

```ts
import * as THREE from "three";

export type EvidenceState =
  | "observed"
  | "partially-observed"
  | "inferred"
  | "unsupported";

export interface ReconstructionSpec {
  id: string;
  units: "meters";
  forwardAxis: "+Z" | "-Z";
  components: Array<{
    id: string;
    parentId?: string;
    evidence: EvidenceState;
    geometry: Record<string, unknown>;
    materialId: string;
    pivot?: [number, number, number];
  }>;
  reviewViews: Array<{
    id: string;
    position: [number, number, number];
    target: [number, number, number];
    evidenceSupported: boolean;
  }>;
}

export interface ProceduralModel {
  root: THREE.Group;
  nodes: ReadonlyMap<string, THREE.Object3D>;
  sockets: ReadonlyMap<string, THREE.Object3D>;
  animations: readonly THREE.AnimationClip[];
  dispose(): void;
}

export function createProceduralModel(
  spec: ReconstructionSpec,
): ProceduralModel {
  // Validate spec, build named hierarchy, then return owned resources.
  throw new Error("Implement from the validated reconstruction spec.");
}
```

## Required properties

- deterministic names and seeds;
- explicit units, axes, origin, floor contact, and camera convention;
- named hierarchy with stable pivots and sockets;
- generated geometries/materials owned by the instance or safely shared;
- explicit disposal for geometries, materials, textures, render targets, and helpers;
- runtime metadata that distinguishes observed and inferred components;
- no network dependency unless the user explicitly accepts one.

## Representation routing

Prefer, in order:

1. primitives and transformed groups for blockout;
2. `Shape` + extrusion for planar profiles;
3. curves + tubes for cables, tails, trims, and strands;
4. instancing for repeated parts;
5. generated `BufferGeometry` for continuous custom surfaces;
6. generated canvas/data textures for markings that do not require geometry;
7. external mesh or authored asset only after leaving the code-only contract.

A face, cloth shell, or other continuous silhouette must not become a pile of floating primitives merely because it is easier to code.

## Readiness claims

- `structured`: hierarchy and names exist;
- `action-ready`: pivots/sockets/colliders work under the intended action;
- `rig-valid`: bone indices, weights, bind matrices, and payload are internally valid;
- `animation-ready`: rig-valid plus representative pose stress and clipping/deformation review;
- `production-ready`: runtime, disposal, performance, browser/device, and visual gates pass.

Report the highest proven tier only.
