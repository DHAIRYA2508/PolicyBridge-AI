# PolicyBridge AI - Full Stack Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    PolicyBridge AI - Full Stack Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Django Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\start.bat"

Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Starting React Frontend..." -ForegroundColor Green
Start-Process powershell -NoExit -Command "cd frontend; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Both services are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Admin: http://localhost:8000/admin" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
