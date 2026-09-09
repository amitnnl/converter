@echo off
title PressWebP PHP Server
cd /d "%~dp0"

echo Starting PHP built-in web server at http://localhost:8080...
start "" "http://localhost:8080"
php -S localhost:8080
if %ERRORLEVEL% NEQ 0 (
    echo PHP is not found in PATH. Opening with CONVERTER.bat instead...
    call "%~dp0CONVERTER.bat"
)
pause
