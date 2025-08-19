@echo off
echo ========================================
echo    PolicyBridge AI - Full Stack Setup
echo ========================================
echo.

echo Starting Django Backend...
start "Django Backend" cmd /k "cd backend && start.bat"

echo Waiting for backend to initialize...
timeout /t 10 /nobreak >nul

echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both services are starting up!
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Admin: http://localhost:8000/admin
echo.
echo Press any key to close this window...
pause >nul
