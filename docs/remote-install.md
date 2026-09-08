# Remote installation

Agent Skills Studio exposes a small Bash bootstrap at:

```text
https://skills.jhonatanoliveira.com/install
```

The bootstrap is only a transport layer. It downloads the repository snapshot pinned to the deployed Git commit and then delegates every installation decision to the existing canonical `install.sh`, which in turn executes `scripts/install-skills.mjs`.

## Quick install

WSL, Ubuntu/Linux and macOS:

```bash
curl -fsSL https://skills.jhonatanoliveira.com/install | bash
```

The command can be run from any working directory. A manual repository clone is not required.

## Install one pack

```bash
curl -fsSL https://skills.jhonatanoliveira.com/install | bash -s -- --pack application-security
```

## Install one skill

```bash
curl -fsSL https://skills.jhonatanoliveira.com/install | bash -s -- --skill reviewing-web-security
```

Any supported `install.sh` arguments can be passed after `bash -s --`, including `--target`, `--scope`, `--destination`, repeated `--pack` values and repeated `--skill` values.

## Inspect before executing

If you prefer not to pipe a remote script directly into Bash, inspect or save it first:

```bash
curl -fsSL https://skills.jhonatanoliveira.com/install
```

```bash
curl -fsSL https://skills.jhonatanoliveira.com/install -o /tmp/agent-skills-install.sh
less /tmp/agent-skills-install.sh
bash /tmp/agent-skills-install.sh --pack application-security
```

## Windows PowerShell

The corrective remote-install slice does not introduce a second PowerShell bootstrap. Windows keeps using the existing canonical PowerShell wrapper after obtaining the repository:

```powershell
./install.ps1
./install.ps1 --pack application-security
./install.ps1 --skill reviewing-web-security
```

This deliberately avoids maintaining two independent remote installation engines. Windows compatibility continues to be protected by the existing PowerShell smoke test in the repository validation workflow.

## Requirements

The Bash bootstrap requires:

- Bash;
- `curl`;
- `tar`;
- Node.js 20 or newer;
- standard temporary-directory/file utilities available on supported Unix-like environments.

## Security and failure behavior

- The public bootstrap is served over HTTPS.
- A valid 40-character deployment Git SHA is used to pin the repository archive; arbitrary revision input is rejected and falls back to the canonical `main` ref.
- Pack and skill names are not interpolated into download URLs. They are passed unchanged to `install.sh`, where the canonical installer validates them.
- Temporary files are created under a private `mktemp` directory and removed on success, failure or handled termination signals.
- Download and installer failures propagate a non-zero exit status.
- The `/install` response is not CDN-cached, preventing a canonical-domain request from temporarily serving a bootstrap pinned to an earlier deployment.

## Local repository flow remains supported

Remote installation is additive. Existing local entry points remain valid and remain the source of truth for installation behavior:

```bash
./install.sh --pack application-security
./install.sh --skill reviewing-web-security
```

```powershell
./install.ps1 --pack application-security
./install.ps1 --skill reviewing-web-security
```
