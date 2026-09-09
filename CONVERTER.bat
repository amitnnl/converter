@echo off
title PressWebP 1:1 Video Converter
cd /d "%~dp0"

echo ===================================================================
echo   PressWebP 1:1 Video-to-WebP Converter (Portable Newsroom Edition)
echo ===================================================================
echo   Starting local server and launching browser...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo PowerShell server could not start. Trying alternate launchers...
    where php >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        start "" "http://localhost:8080"
        php -S localhost:8080
    ) else if exist "C:\xampp\php\php.exe" (
        start "" "http://localhost:8080"
        "C:\xampp\php\php.exe" -S localhost:8080
    ) else (
        echo Opening index.html directly in default browser...
        start "" "%~dp0index.html"
    )
)

pause
