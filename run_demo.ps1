# Finding the Next Signal - ATMOS 2026 Prototype Launcher
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "FINDING THE NEXT SIGNAL - ATMOS 2026 (Track C: FMCG & Consumer)" -ForegroundColor Yellow
Write-Host "Launching Autonomous Financial Research Agent Prototype..." -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot
Write-Host "Opening Dashboard at http://127.0.0.1:8000" -ForegroundColor White
Start-Process "http://127.0.0.1:8000"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
