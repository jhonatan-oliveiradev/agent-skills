$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
node (Join-Path $ScriptDir "scripts/bootstrap-project.mjs") @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
