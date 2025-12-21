# Scripts

This folder contains helper scripts intended to simplify common local development tasks. The scripts are intentionally minimal and designed for manual use. The repository currently includes:

- `run-example.ps1` — PowerShell helper that runs the TypeScript example via `ts-node`.

Usage

Run a script from the repository root in PowerShell:

```powershell
pwsh ./scripts/run-example.ps1
```

Notes

- Scripts are convenience helpers, not part of the library runtime. They are optional and can be edited to match local tooling or shells.
