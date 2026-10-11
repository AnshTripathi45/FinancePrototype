@echo off
echo ======================================================================
echo FINDING THE NEXT SIGNAL - ATMOS 2026 (Track C: FMCG & Consumer)
echo Launching Autonomous Financial Research Agent Prototype...
echo ======================================================================
echo.
cd /d "%~dp0"
echo Starting FastAPI Backend and UI Dashboard on http://127.0.0.1:8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
