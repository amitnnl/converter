@echo off
setlocal enabledelayedexpansion
title PressWebP — 1-Click Android APK Builder
color 0b

echo ========================================================================
echo   PRESSWEBP -- 1-Click Android APK Builder
echo ========================================================================
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

set "JAVA_HOME=%LOCALAPPDATA%\Android\jdk-21"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%"

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] JDK 21 not found at %JAVA_HOME%
    pause
    exit /b 1
)

echo [1/3] Synchronizing web application assets to Android project...
call node sync-assets.js
call npx cap copy android
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to sync web assets.
    pause
    exit /b 1
)

echo.
echo [2/3] Compiling Android APK with Gradle (assembleDebug)...
cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Gradle build failed.
    pause
    exit /b 1
)

echo.
echo [3/3] Exporting PressWebP.apk to project root...
cd /d "%SCRIPT_DIR%"
copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "PressWebP.apk" >nul

echo.
echo ========================================================================
echo   SUCCESS: PressWebP.apk has been generated!
echo   Location: %SCRIPT_DIR%PressWebP.apk
echo ========================================================================
echo.
pause
