@echo off
echo === Iniciando Tunnel Manager ===
echo.

cd backend
start "Backend" cmd /k "npm install && npm start"

cd ..\frontend
start "Frontend" cmd /k "npm install && npm run dev"

echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Espera unos segundos a que arranquen los servidores...
pause
