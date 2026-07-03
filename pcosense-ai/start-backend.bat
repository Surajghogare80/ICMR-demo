@echo off
echo Starting PCOSense AI Backend...
cd backend
start "PCOSense Backend" cmd /k "npm run dev"
echo Backend started on http://localhost:5000
