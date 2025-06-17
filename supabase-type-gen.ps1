# supabase-type-gen.ps1
param(
    [string]$ProjectRef = "",
    [string]$OutputPath = "./database.types.ts",
    [string]$EnvFile = ".env"
)

# 콘솔 인코딩 및 코드페이지 설정
Write-Host "Setting console encoding to UTF-8..." -ForegroundColor Green
chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [Console]::OutputEncoding
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# .env 파일에서 PROJECT_REF 읽기
if ($ProjectRef -eq "" -and (Test-Path $EnvFile)) {
    Write-Host "Reading PROJECT_REF from .env file..." -ForegroundColor Yellow
    $envContent = Get-Content $EnvFile -Encoding UTF8
    foreach ($line in $envContent) {
        if ($line -match "^SUPABASE_PROJECT_REF=(.+)$") {
            $ProjectRef = $matches[1].Trim('"')
            Write-Host "PROJECT_REF loaded from .env file." -ForegroundColor Green
            break
        }
    }
}

# Supabase 타입 생성
Write-Host "Generating Supabase types..." -ForegroundColor Green
if ($ProjectRef -eq "") {
    # project-ref가 제공되지 않은 경우 로컬 사용
    Write-Host "Using local Supabase" -ForegroundColor Yellow
    npx supabase gen types typescript --local > $OutputPath
} else {
    # project-ref가 있는 경우 원격 사용
    Write-Host "Using remote Supabase (Project: $($ProjectRef.Substring(0, 8))...)" -ForegroundColor Yellow
    npx supabase gen types typescript --project-id $ProjectRef > $OutputPath
}

# 파일이 생성되었는지 확인
if (Test-Path $OutputPath) {
    Write-Host "Type file generated: $OutputPath" -ForegroundColor Green
    
    # 파일을 UTF-8로 다시 저장
    Write-Host "Converting file encoding to UTF-8..." -ForegroundColor Yellow
    
    # 파일 내용을 읽고 UTF-8로 다시 저장
    $content = Get-Content -Path $OutputPath -Raw -Encoding UTF8
    $utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
    [System.IO.File]::WriteAllText($OutputPath, $content, $utf8NoBomEncoding)
    
    Write-Host "Complete! File saved with UTF-8 encoding." -ForegroundColor Green
} else {
    Write-Host "Failed to generate type file." -ForegroundColor Red
}

# 사용법 안내
Write-Host "`nUsage:" -ForegroundColor Cyan
Write-Host "  1. Add SUPABASE_PROJECT_REF=your-project-ref to .env file" -ForegroundColor Gray
Write-Host "  2. .\supabase-type-gen.ps1                                    # Auto-read from .env" -ForegroundColor Gray
Write-Host "  3. .\supabase-type-gen.ps1 -ProjectRef 'manual-ref'           # Manual specification" -ForegroundColor Gray
Write-Host "  4. .\supabase-type-gen.ps1 -OutputPath './custom/path.ts'     # Custom output path" -ForegroundColor Gray

# .env 파일이 없으면 샘플 생성 제안
if (-not (Test-Path $EnvFile)) {
    Write-Host "`n.env file not found. Create sample? (y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    if ($response -eq "y" -or $response -eq "Y") {
        $sampleEnv = @"
# Supabase Configuration
SUPABASE_PROJECT_REF=your-project-ref-here
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Other environment variables...
"@
        $sampleEnv | Out-File -FilePath $EnvFile -Encoding UTF8
        Write-Host ".env sample file created. Please update PROJECT_REF." -ForegroundColor Green
    }
}
