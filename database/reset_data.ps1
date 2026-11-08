# ============================================================
# ExamForge Database Reset Utility
# Re-runs 003_official_data_reset.sql into MySQL cleanly
# ============================================================

$mysqlBin = "C:\Program Files (x86)\MySQL\MySQL Server 5.5\bin\mysql.exe"
if (-not (Test-Path $mysqlBin)) {
    $mysqlBin = "mysql"
}

$sqlFile = Join-Path $PSScriptRoot "migrations\003_official_data_reset.sql"

Write-Host "Resetting ExamForge database with official subjects, topics, Admin Puneet, and Student Puneet..." -ForegroundColor Cyan

Get-Content $sqlFile | & $mysqlBin -u root -p12345 --default-character-set=utf8

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success: Database reset completed with official data!" -ForegroundColor Green
} else {
    Write-Host "Error executing reset script." -ForegroundColor Red
}
