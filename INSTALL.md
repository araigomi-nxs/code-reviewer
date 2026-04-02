# INSTALLATION & VERIFICATION GUIDE

Ensure everything is set up correctly before starting your studies!

## ✅ Pre-Installation Checklist

- [ ] Java 8+ is installed on your computer
- [ ] You can open a terminal/command prompt
- [ ] You have internet access (if downloading Java)
- [ ] You have write permissions in the project directory

## 🔍 Step 1: Verify Java Installation

### Windows (PowerShell or CMD):

```bash
java -version
javac -version
```

### Linux/Mac (Terminal):

```bash
java -version
javac -version
```

**Expected Output** (example):

```
java version "11.0.0" or higher
Java(TM) SE Runtime Environment
```

### If Java is not found:

1. Download Java from: https://www.java.com/
2. Or download JDK from: https://www.oracle.com/
3. Install following the wizard
4. Restart terminal/command prompt
5. Try `java -version` again

## 📂 Step 2: Verify Project Structure

Your `code-reviewer` folder should contain:

```
✓ src/
  ✓ com/reviewer/
    ✓ CodingReviewerApp.java
    ✓ StudyTopic.java
    ✓ topics/
      ✓ LoopStructures.java
      ✓ ForEachLoop.java
      ✓ Recursion.java
      ✓ Arrays2D.java
      ✓ ArrayListTopic.java
      ✓ OOPBasics.java
✓ README.md
✓ QUICKSTART.md
✓ CONTENTS.md
✓ CHALLENGES.md
✓ run.bat (Windows) or run.sh (Linux/Mac)
```

If any file is missing, re-extract the project.

## 🛠️ Step 3: Test Compilation

### Option A: Using Batch/Shell Script (Recommended)

**Windows** - Double-click `run.bat`
**Linux/Mac** - Run `./run.sh` in terminal

### Option B: Manual Compilation

Navigate to project directory and run:

```bash
# Create bin directory
mkdir bin

# Compile all files
javac -d bin src/com/reviewer/*.java src/com/reviewer/topics/*.java
```

**Expected Output**: No errors, just returns to prompt

**If you see errors**:

```
error: Source files copied incorrectly
error: Package structure wrong
```

→ Check file paths match exactly: `com/reviewer/topics/`

## 🚀 Step 4: Test Execution

After successful compilation, run:

```bash
java -cp bin com.reviewer.CodingReviewerApp
```

**Expected Output** - Main menu appears:

```
========== CODING STUDY REVIEWER ==========
Easy Level (Foundations)
==========================================
1. Loop Structures
2. For-Each Loop
3. Recursion
4. 2D Arrays
5. ArrayList
6. OOP Basics
7. Exit
Choose a topic:
```

## ✨ Step 5: Test a Topic

1. Press `1` and Enter (Loop Structures)
2. You should see:

```
========== LOOP STRUCTURES ==========

--- Loop Structures ---
1. View Concepts & Examples
2. Run Sample Code
3. Test Your Knowledge (Challenge)
4. Back to Main Menu
Choose an option:
```

3. Press `2` (Run Sample Code)
4. Press `y` (yes) to run code
5. You should see output like:

```
Running sample code for Loop Structures...

FOR LOOP:
1 2 3 4 5
```

- If you see this output: ✅ **Everything is working!**
- If not, troubleshoot below

## 🔧 Troubleshooting

### Problem: "javac command not found"

**Solution**:

- Java is not installed or PATH not set
- Download and install Java
- Add to PATH environment variable

### Problem: "Class not found" or "File not found"

**Solution**:

- Check folder structure matches exactly: `src/com/reviewer/topics/`
- Verify all Java files exist
- Try deleting `bin` folder and recompiling

### Problem: "Exception in thread main"

**Solution**:

- All files compiled correctly?
- Run from correct directory?
- Try: `java -cp bin com.reviewer.CodingReviewerApp` (exact command)

### Problem: Menu appears but topics don't work

**Solution**:

- Ensure all 6 topic files are present in `topics/` folder
- Recompile everything: Delete `bin` and run `run.bat`

### Problem: Sample code runs but no output

**Solution**:

- Normal for some operations, text might be buffered
- Add extra output: Edit java files and run again
- Or select "View Concepts" to see expected output

## 📊 Verification Checklist

After completing steps 1-5, verify:

| Item                       | Status |
| -------------------------- | ------ |
| Java installed and working | ✓ / ✗  |
| Project files extracted    | ✓ / ✗  |
| Compilation successful     | ✓ / ✗  |
| Application starts         | ✓ / ✗  |
| Menu displays              | ✓ / ✗  |
| Topic 1 accessible         | ✓ / ✗  |
| Sample code runs           | ✓ / ✗  |
| Output displays            | ✓ / ✗  |

**All ✓ marks?** → You're ready to start learning! 🎉

## 🎯 First 5 Minutes

1. ✅ Verify installation (this guide)
2. ✅ Run application
3. ✅ Select Topic 1: Loop Structures
4. ✅ Choose "View Concepts"
5. ✅ Choose "Run Sample Code"
6. ✅ Start learning!

## 💾 System Requirements

| Requirement | Minimum           | Recommended                      |
| ----------- | ----------------- | -------------------------------- |
| Java        | 8                 | 11+                              |
| RAM         | 128 MB            | 512 MB                           |
| Disk        | 10 MB             | 50 MB                            |
| OS          | Windows/Mac/Linux | Windows 10+ / Mac 10.12+ / Linux |

## 📞 Still Having Issues?

1. **Read error message carefully** - It tells you what's wrong
2. **Check paths are correct** - folders need exact names
3. **Try manual commands** - Don't use batch file, type manually
4. **Verify file encoding** - Should be UTF-8
5. **Check write permissions** - Can you create files?
6. **Try different terminal** - PowerShell vs CMD (Windows)

## ✅ Quick Verification Test

Save this test code as `Test.java`, compile and run:

```java
public class Test {
    public static void main(String[] args) {
        System.out.println("Java is working!");
        System.out.println("Version: " + System.getProperty("java.version"));
    }
}
```

Compile: `javac Test.java`
Run: `java Test`

If it prints output, Java is correctly installed!

---

**Next Steps**: Once verified, read `QUICKSTART.md` to begin learning! 🚀
