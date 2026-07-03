@echo off
echo Starting PCOSense AI Frontend...
cd frontend
start "PCOSense Frontend" cmd /k "npm run dev"
echo Frontend started on http://localhost:5173
