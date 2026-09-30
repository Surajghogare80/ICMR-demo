@echo off
echo Starting PMOSense AI Frontend...
cd frontend
start "PMOSense Frontend" cmd /k "npm run dev"
echo Frontend started on http://localhost:5173
