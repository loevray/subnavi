# supabase-type-gen.ps1
param(
    [string]$ProjectRef = "",
    [string]$OutputPath = "./database.types.ts",
    [string]$EnvFile = ".env.local"
)

Write-Host "Setting console encoding to UTF-8..." -ForegroundColor Green
chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [Console]::OutputEncoding
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

if ($ProjectRef -eq "" -and (Test-Path $EnvFile)) {
    Write-Host "Reading PROJECT_REF from $EnvFile..." -ForegroundColor Yellow
    $envContent = Get-Content $EnvFile -Encoding UTF8
    foreach ($line in $envContent) {
        if ($line -match "^SUPABASE_PROJECT_REF=(.+)$") {
            $ProjectRef = $matches[1].Trim('"')
            Write-Host "PROJECT_REF loaded from $EnvFile." -ForegroundColor Green
            break
        }
    }
}

Write-Host "Generating Supabase types..." -ForegroundColor Green
if ($ProjectRef -eq "") {
    Write-Error "SUPABASE_PROJECT_REF is missing. Set it in $EnvFile or pass -ProjectRef explicitly."
    exit 1
}

Write-Host "Using remote Supabase (Project: $($ProjectRef.Substring(0, [Math]::Min(8, $ProjectRef.Length)))...)" -ForegroundColor Yellow
npx supabase gen types typescript --project-id $ProjectRef > $OutputPath

if (Test-Path $OutputPath) {
    Write-Host "Type file generated: $OutputPath" -ForegroundColor Green
    Write-Host "Converting file encoding to UTF-8..." -ForegroundColor Yellow

    $content = Get-Content -Path $OutputPath -Raw -Encoding UTF8
    $utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
    [System.IO.File]::WriteAllText($OutputPath, $content, $utf8NoBomEncoding)

    Write-Host "Complete! File saved with UTF-8 encoding." -ForegroundColor Green
} else {
    Write-Host "Failed to generate type file." -ForegroundColor Red
}

Write-Host "`nUsage:" -ForegroundColor Cyan
Write-Host "  1. Add SUPABASE_PROJECT_REF=your-project-ref to .env.local" -ForegroundColor Gray
Write-Host "  2. .\supabase-type-gen.ps1                                    # Auto-read dev project from .env.local" -ForegroundColor Gray
Write-Host "  3. .\supabase-type-gen.ps1 -EnvFile '.env'                    # Read prod project from .env" -ForegroundColor Gray
Write-Host "  4. .\supabase-type-gen.ps1 -ProjectRef 'manual-ref'           # Manual project selection" -ForegroundColor Gray
Write-Host "  5. .\supabase-type-gen.ps1 -OutputPath './custom/path.ts'     # Custom output path" -ForegroundColor Gray

if (-not (Test-Path $EnvFile)) {
    Write-Host "`n$EnvFile file not found. Create sample? (y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    if ($response -eq "y" -or $response -eq "Y") {
        $sampleEnv = @"
# Supabase Configuration
SUPABASE_PROJECT_REF=your-project-ref-here
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Other environment variables...
"@
        $sampleEnv | Out-File -FilePath $EnvFile -Encoding UTF8
        Write-Host "$EnvFile sample file created. Please update PROJECT_REF." -ForegroundColor Green
    }
}
