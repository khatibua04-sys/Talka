@echo off
REM Talka Setup Script for Windows
setlocal enabledelayedexpansion

echo ��️  Setting up Talka - Text-to-Speech Platform
echo ================================================

REM Check prerequisites
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python is required but not installed. Aborting.
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is required but not installed. Aborting.
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Setup environment
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env and update the SECRET_KEY
)

REM Create directories
if not exist "uploads\voices" mkdir uploads\voices
if not exist "outputs" mkdir outputs

cd ..

REM Setup Frontend
echo.
echo 🎨 Setting up Frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

REM Setup environment
if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.local.example .env.local
)

cd ..

echo.
echo ✅ Setup completed successfully!
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python main.py
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo ⚠️  Don't forget to update backend\.env with a secure SECRET_KEY!

pause
