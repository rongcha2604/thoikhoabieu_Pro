@echo off
echo ========================================
echo   WIDGET DEBUG LOGS
echo ========================================
echo.
echo Showing logs for TimetableWidget and TimetableStorage...
echo Press Ctrl+C to stop.
echo.

cd android
call gradlew.bat installDebug
adb logcat -s TimetableWidget:D TimetableStorage:D

