$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
node (Join-Path $RepoRoot "scripts/install-skills.mjs") @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
