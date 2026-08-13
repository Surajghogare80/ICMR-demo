@echo off
echo Starting PMOSense AI Backend...
cd backend
start "PMOSense Backend" cmd /k "npm run dev"
echo Backend started on http://localhost:5000
