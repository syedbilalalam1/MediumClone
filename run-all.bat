@echo off
setlocal

REM Change to the directory where this script resides
cd /d "%~dp0"

REM Ensure backend env file exists
if not exist "server\env.server" (
  echo.
  echo Error: server\env.server not found. Please create it with your secrets.
  echo Example:
  echo PORT=3000
  echo MONGODB_URI=...
  echo JWT_SECRET=change-this
  echo CLOUDINARY_CLOUD_NAME=...
  echo CLOUDINARY_API_KEY=...
  echo CLOUDINARY_API_SECRET=...
  echo OPENROUTER_API_KEY=...
  echo OPENROUTER_MODEL=qwen/qwen3-235b-a22b:free
  echo OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
  pause
  exit /b 1
)

REM Create/update frontend .env.local with API URL
set VITE_API_URL=http://localhost:3000
> ".env.local" (echo VITE_API_URL=%VITE_API_URL%)

REM Check npm availability
where npm >nul 2>&1
if errorlevel 1 (
  echo.
  echo Error: npm is not on PATH. Install Node.js and try again.
  pause
  exit /b 1
)

REM Start backend in a new window
echo Starting backend on %VITE_API_URL% ...
start "backend" cmd /c "cd /d server && npm install && npm run dev"

REM Start frontend in a new window
echo Starting frontend (Vite)...
start "frontend" cmd /c "cd /d "%~dp0" && npm install && npm run dev"

echo.
echo Both servers are starting. Backend: http://localhost:3000  Frontend: http://localhost:5173
echo Close these windows to stop the servers.

endlocal
exit /b 0

