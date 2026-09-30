@echo off
echo ============================================================
echo  PMOSense AI - Development Environment Setup
echo ============================================================
echo.

echo [1/2] Installing Backend Dependencies...
cd backend
call npm install
echo Backend dependencies installed!
echo.

cd ..

echo [2/2] Installing Frontend Dependencies...
cd frontend
call npm install
echo Frontend dependencies installed!
echo.

cd ..

echo ============================================================
echo  SETUP COMPLETE!
echo ============================================================
echo.
echo To start the app:
echo   Backend:   cd backend  ^&^& npm run dev   (port 5000)
echo   Frontend:  cd frontend ^&^& npm run dev   (port 5173)
echo.
echo Visit: http://localhost:5173
echo ============================================================
pause
