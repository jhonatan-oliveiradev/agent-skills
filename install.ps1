$ErrorActionPreference = "Stop"
$SourceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetDir = Join-Path $HOME ".agents\skills"
New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
Get-ChildItem -Path $SourceDir -Directory | ForEach-Object {
    $SkillFile = Join-Path $_.FullName "SKILL.md"
    if (Test-Path $SkillFile) {
        $Destination = Join-Path $TargetDir $_.Name
        if (Test-Path $Destination) { Remove-Item -Recurse -Force $Destination }
        Copy-Item -Recurse -Force $_.FullName $Destination
        Write-Host "Installed $($_.Name)"
    }
}
Write-Host "Skills installed in $TargetDir"
