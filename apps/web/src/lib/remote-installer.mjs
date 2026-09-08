const DEFAULT_REVISION = "main";
const COMMIT_SHA_PATTERN = /^[0-9a-f]{40}$/i;
const INSTALL_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REPOSITORY_ARCHIVE_BASE =
  "https://github.com/jhonatan-oliveiradev/agent-skills/archive";

export const REMOTE_INSTALL_URL = "https://skills.jhonatanoliveira.com/install";
export const REMOTE_QUICK_INSTALL_COMMAND = `curl -fsSL ${REMOTE_INSTALL_URL} | bash`;

function requireInstallSlug(slug) {
  if (typeof slug !== "string" || !INSTALL_SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid install slug: ${String(slug)}`);
  }
  return slug;
}

export function getRemoteSkillInstallCommand(slug) {
  return `curl -fsSL ${REMOTE_INSTALL_URL} | bash -s -- --skill ${requireInstallSlug(slug)}`;
}

export function getRemotePackInstallCommand(slug) {
  return `curl -fsSL ${REMOTE_INSTALL_URL} | bash -s -- --pack ${requireInstallSlug(slug)}`;
}

export function getRemoteTargetInstallCommand(target) {
  return `curl -fsSL ${REMOTE_INSTALL_URL} | bash -s -- --target ${requireInstallSlug(target)}`;
}

export function resolveRemoteInstallRevision(value) {
  return typeof value === "string" && COMMIT_SHA_PATTERN.test(value)
    ? value.toLowerCase()
    : DEFAULT_REVISION;
}

export function generateRemoteInstallScript({ revision } = {}) {
  const safeRevision = resolveRemoteInstallRevision(revision);
  const archiveUrl = `${REPOSITORY_ARCHIVE_BASE}/${safeRevision}.tar.gz`;

  return `#!/usr/bin/env bash
set -euo pipefail

readonly archive_url="${archiveUrl}"

for dependency in curl tar bash node mktemp mkdir rm; do
  if ! command -v "$dependency" >/dev/null 2>&1; then
    printf 'Agent Skills Studio remote installer requires %s.\n' "$dependency" >&2
    exit 127
  fi
done

temporary_directory="$(mktemp -d "\${TMPDIR:-/tmp}/agent-skills-install.XXXXXX")"
cleanup() {
  rm -rf -- "$temporary_directory"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

archive="$temporary_directory/repository.tar.gz"
repository="$temporary_directory/repository"
installer="$repository/install.sh"

curl -fsSL "$archive_url" -o "$archive"
mkdir -p -- "$repository"
tar -xzf "$archive" -C "$repository" --strip-components=1

if [[ ! -f "$installer" ]]; then
  printf 'Agent Skills Studio archive does not contain install.sh.\n' >&2
  exit 1
fi

bash "$installer" "$@"
`;
}
