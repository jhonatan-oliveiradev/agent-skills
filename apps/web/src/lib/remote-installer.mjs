const DEFAULT_REVISION = "main";
const COMMIT_SHA_PATTERN = /^[0-9a-f]{40}$/i;
const REPOSITORY_ARCHIVE_BASE =
  "https://github.com/jhonatan-oliveiradev/agent-skills/archive";

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

temporary_directory="$(mktemp -d "${TMPDIR:-/tmp}/agent-skills-install.XXXXXX")"
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
