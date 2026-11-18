@echo off
title AI Portfolio Launcher
echo ===================================================
echo           STARTING AI-PORTFOLIO SERVICES
echo ===================================================

if exist "%~dp0backend" (
    set "BACKEND_DIR=%~dp0backend"
    set "FRONTEND_DIR=%~dp0frontend"
) else (
    set "BACKEND_DIR=%~dp0ai-portfolio\backend"
    set "FRONTEND_DIR=%~dp0ai-portfolio\frontend"
)

echo Starting Backend (FastAPI on http://127.0.0.1:8000)...
start "AI-Portfolio Backend" cmd /k "cd /d "%BACKEND_DIR%" && venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo Starting Frontend (Vite on http://127.0.0.1:5173)...
start "AI-Portfolio Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo ===================================================
echo All services launched!
echo Open your browser at: http://localhost:5173
echo ===================================================
