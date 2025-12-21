# PowerShell helper to run the TypeScript example using ts-node (developer machine)
# Usage: pwsh ./scripts/run-example.ps1

if (-not (Get-Command ts-node -ErrorAction SilentlyContinue)) {
  Write-Host "ts-node not found. Install with: npm i -D ts-node typescript"
  exit 1
}

# Ensure environment variables are forwarded (optional)
$env:DISCORD_ID = $env:DISCORD_ID
$env:LANYARD_API_KEY = $env:LANYARD_API_KEY

# Run the example (transpile-only for speed)
ts-node --transpile-only examples/basic/example.ts
