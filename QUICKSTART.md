# QUICK START GUIDE

## 🚀 First Run in 30 Seconds

### On Windows:

1. Open PowerShell or Command Prompt
2. Navigate to the project:
   ```
   cd code-reviewer
   ```
3. Run the batch file:
   ```
   run.bat
   ```
4. Follow the menu prompts!

### On Linux/Mac:

1. Open Terminal
2. Navigate to the project:
   ```
   cd code-reviewer
   ```
3. Make script executable:
   ```
   chmod +x run.sh
   ```
4. Run the script:
   ```
   ./run.sh
   ```
5. Follow the menu prompts!

### Manual Compilation (All Platforms):

```bash
# In the code-reviewer directory
javac -d bin src/com/reviewer/*.java src/com/reviewer/topics/*.java
java -cp bin com.reviewer.CodingReviewerApp
```

## 📋 What You Get

✅ 6 comprehensive study topics  
✅ Detailed concept explanations  
✅ Working sample code for each topic  
✅ 40+ challenging exercises  
✅ Interactive menu-driven interface  
✅ Hands-on learning experience

## 🎯 Suggested First Steps

1. **Start Topic 1** - Loop Structures (foundation)
2. **View Concepts** - Read the fundamentals
3. **Run Sample Code** - See working examples
4. **Try a Challenge** - Apply what you learned
5. **Progress through topics** - Build your skills

## 💡 Pro Tips

- Don't skip the concepts section
- Run the sample code to see actual output
- Challenges build progressively
- Try to solve challenges BEFORE looking at sample code
- Take notes on key concepts
- Return to previous topics if stuck

## 📞 Troubleshooting

### "Command not found" or "'javac' is not recognized"

- Java is not installed or not in PATH
- Download Java from java.com or oracle.com
- Add Java bin directory to your PATH

### "FileNotFoundException"

- Make sure you're in the code-reviewer directory
- Check that all src files exist

### Compilation errors

- Ensure Java version is 8 or higher
- Check file paths are correct
- Try deleting bin folder and recompiling

## 🎓 Learning Tips

1. **Understand first** - Learn concepts before coding
2. **Type the code** - Don't just copy-paste
3. **Modify examples** - Change values and see what happens
4. **Debug** - Add prints to understand flow
5. **Challenge yourself** - Try harder versions of challenges
6. **Teach others** - Explain concepts to solidify learning

---

Ready to learn? Run `run.bat` (Windows) or `./run.sh` (Linux/Mac) and start studying! 🎉
