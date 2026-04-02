@echo off
REM Compilation and Run Script for Coding Study Reviewer
REM This batch file compiles and runs the application

echo ===== Coding Study Reviewer - Compiler =====
echo.

REM Create bin directory if it doesn't exist
if not exist bin mkdir bin

echo Compiling Java files...
echo.

REM Compile all Java files
javac -d bin src\com\reviewer\*.java src\com\reviewer\topics\*.java

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Compilation failed!
    exit /b 1
)

echo Compilation successful!
echo.
echo ===== Starting Application =====
echo.

REM Run the application
java -cp bin com.reviewer.CodingReviewerApp

pause
