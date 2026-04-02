#!/bin/bash
# Compilation and Run Script for Coding Study Reviewer
# This script compiles and runs the application on Linux/Mac

echo "===== Coding Study Reviewer - Compiler ====="
echo ""

# Create bin directory if it doesn't exist
mkdir -p bin

echo "Compiling Java files..."
echo ""

# Compile all Java files
javac -d bin src/com/reviewer/*.java src/com/reviewer/topics/*.java

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Compilation failed!"
    exit 1
fi

echo "Compilation successful!"
echo ""
echo "===== Starting Application ====="
echo ""

# Run the application
java -cp bin com.reviewer.CodingReviewerApp
