@echo off
REM English Learning App - Setup Script for Windows (PNPM)

echo 🎓 Setting up English Learning App with PNPM...
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js ^(v18 or higher^) first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Check if PNPM is installed
where pnpm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing PNPM...
    call npm install -g pnpm
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install PNPM
        pause
        exit /b 1
    )
)

echo ✅ PNPM ready
echo.

REM Configure Git to use HTTPS
echo 🔧 Configuring Git...
git config --global url."https://github.com/".insteadOf git@github.com:
git config --global url."https://".insteadOf git://
echo ✅ Git configured
echo.

REM Install dependencies
echo 📦 Installing dependencies with PNPM...
call pnpm install

if %ERRORLEVEL% EQU 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Failed to install dependencies
    echo Trying with --shamefully-hoist flag...
    call pnpm install --shamefully-hoist
    if %ERRORLEVEL% NEQ 0 (
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Setup complete! You can now run:
echo.
echo   pnpm run dev     - Start development server
echo   pnpm run build   - Build for production
echo   pnpm run electron - Run Electron app
echo.
echo Happy learning! 📚
pause