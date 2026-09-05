import type { CompetencyId } from "./competencies";
import type { ProficiencyLevel, TargetRoleId } from "./types";

export interface RoleCapabilityRequirement {
  readonly competencyId: CompetencyId;
  readonly requiredLevel: ProficiencyLevel;
  readonly required: boolean;
}

export interface RoleCapabilityMap {
  readonly roleId: TargetRoleId;
  readonly requirements: readonly RoleCapabilityRequirement[];
}

const frontendRoleMap: RoleCapabilityMap = {
  roleId: "frontend-developer",
  requirements: [
    { competencyId: "programming-javascript", requiredLevel: "proficient", required: true },
    { competencyId: "programming-typescript", requiredLevel: "developing", required: true },
    { competencyId: "web-platform-foundations", requiredLevel: "proficient", required: true },
    { competencyId: "ui-component-modeling", requiredLevel: "proficient", required: true },
    { competencyId: "state-data-flow", requiredLevel: "proficient", required: true },
    { competencyId: "web-accessibility", requiredLevel: "developing", required: true },
    { competencyId: "testing-behavior", requiredLevel: "developing", required: true },
    { competencyId: "git-collaboration", requiredLevel: "developing", required: true },
    {
      competencyId: "application-security-foundations",
      requiredLevel: "foundation",
      required: true,
    },
    { competencyId: "architecture-boundaries", requiredLevel: "developing", required: true },
    { competencyId: "professional-evidence", requiredLevel: "developing", required: true },
  ],
};

const backendRoleMap: RoleCapabilityMap = {
  roleId: "backend-developer",
  requirements: [
    { competencyId: "programming-javascript", requiredLevel: "proficient", required: true },
    { competencyId: "programming-typescript", requiredLevel: "developing", required: true },
    { competencyId: "http-api-engineering", requiredLevel: "proficient", required: true },
    { competencyId: "node-runtime-foundations", requiredLevel: "proficient", required: true },
    { competencyId: "relational-data-modeling", requiredLevel: "proficient", required: true },
    { competencyId: "testing-behavior", requiredLevel: "developing", required: true },
    { competencyId: "git-collaboration", requiredLevel: "developing", required: true },
    {
      competencyId: "application-security-foundations",
      requiredLevel: "developing",
      required: true,
    },
    { competencyId: "architecture-boundaries", requiredLevel: "developing", required: true },
    { competencyId: "professional-evidence", requiredLevel: "developing", required: true },
  ],
};

const fullstackRoleMap: RoleCapabilityMap = {
  roleId: "fullstack-developer",
  requirements: [
    { competencyId: "programming-javascript", requiredLevel: "proficient", required: true },
    { competencyId: "programming-typescript", requiredLevel: "proficient", required: true },
    { competencyId: "web-platform-foundations", requiredLevel: "proficient", required: true },
    { competencyId: "ui-component-modeling", requiredLevel: "proficient", required: true },
    { competencyId: "state-data-flow", requiredLevel: "proficient", required: true },
    { competencyId: "web-accessibility", requiredLevel: "developing", required: true },
    { competencyId: "http-api-engineering", requiredLevel: "proficient", required: true },
    { competencyId: "node-runtime-foundations", requiredLevel: "proficient", required: true },
    { competencyId: "relational-data-modeling", requiredLevel: "developing", required: true },
    { competencyId: "testing-behavior", requiredLevel: "proficient", required: true },
    { competencyId: "git-collaboration", requiredLevel: "developing", required: true },
    {
      competencyId: "application-security-foundations",
      requiredLevel: "developing",
      required: true,
    },
    { competencyId: "architecture-boundaries", requiredLevel: "proficient", required: true },
    { competencyId: "professional-evidence", requiredLevel: "developing", required: true },
  ],
};

export const roleMaps = [
  frontendRoleMap,
  backendRoleMap,
  fullstackRoleMap,
] as const satisfies readonly RoleCapabilityMap[];

export function getRoleMap(roleId: TargetRoleId): RoleCapabilityMap {
  const roleMap = roleMaps.find((candidate) => candidate.roleId === roleId);
  if (!roleMap) throw new Error(`Unknown Career Lab role map: ${roleId}`);
  return roleMap;
}
