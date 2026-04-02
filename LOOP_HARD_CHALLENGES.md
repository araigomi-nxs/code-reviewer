# Hard Challenges for Loop Structures

These challenges are designed to test your mastery of nested loops, array manipulation, and algorithmic thinking. Each challenge builds on fundamental loop concepts and introduces real-world programming patterns.

---

## Challenge 5: Multiplication Table (Nested Loops)

### 📋 Description

Create a program that generates and displays a multiplication table for numbers 1-10. The output should be nicely formatted as a grid showing the product of each pair of numbers.

### 🎯 Objectives

- Use nested loops to iterate through rows and columns
- Practice 2D output formatting
- Understand how nested loops create matrix-like structures
- Format output for readability

### 📝 Requirements

**Input**: None (fixed range 1-10)

**Output**: A formatted 10×10 multiplication table

**Example Output**:

```
    1   2   3   4   5   6   7   8   9  10
 1  1   2   3   4   5   6   7   8   9  10
 2  2   4   6   8  10  12  14  16  18  20
 3  3   6   9  12  15  18  21  24  27  30
 ...
10 10  20  30  40  50  60  70  80  90 100
```

### 🔧 Constraints

1. Must use nested loops (outer loop for rows, inner loop for columns)
2. Output must be properly aligned and formatted
3. Each cell should be right-aligned in a fixed width (min 4 characters)
4. Include headers (row and column labels)
5. No use of arrays or premade formatting libraries
6. Code should be clean and well-commented

### 💡 Key Concepts

- Nested loops (loop within a loop)
- String formatting
- Print statements with spacing
- Loop control variables
- Math operations inside loops

### 🚀 Extended Challenges

1. Read the range from user input (e.g., 1-12, 1-15)
2. Accept two different ranges (e.g., 1-5 and 1-8)
3. Add border characters to create a table frame
4. Use different formatting for multiples of specific numbers (highlight primes, perfect squares, etc.)

---

## Challenge 6: Reverse Array Using Index Traversal

### 📋 Description

Create a program that takes 5 numbers as input from the user, stores them in an array, and then reverses the order of the array using index traversal (without using built-in reverse functions or additional data structures).

### 🎯 Objectives

- Practice input handling and array operations
- Understand index-based array traversal
- Learn how to swap array elements
- Reverse data structures using bidirectional traversal
- Manipulate arrays in-place

### 📝 Requirements

**Input**: 5 integers from the user (one per line or space-separated)

**Output**:

- Original array
- Reversed array

**Example**:

```
Input:
10
20
30
40
50

Original array: 10 20 30 40 50
Reversed array: 50 40 30 20 10
```

### 🔧 Constraints

1. Must use a for loop with index-based traversal
2. Cannot use ArrayList or built-in reverse() function
3. Must reverse the array in-place (no second array allowed)
4. Must use a swapping technique (temp variable)
5. Must validate user input (handle non-integer input gracefully)
6. Output should display both original and reversed arrays
7. Include comments explaining the swapping logic

### 💡 Key Concepts

- Array indexing (accessing elements by index)
- For loops with custom increment/decrement
- Variable swapping using temporary variable
- Two-pointer technique
- In-place algorithms
- Input validation with Scanner

### 🚀 Extended Challenges

1. Reverse only part of the array (e.g., elements 2-4)
2. Accept variable number of inputs (user specifies how many)
3. Reverse multiple arrays and display them side-by-side
4. Implement reverse using while loop instead of for loop
5. Rotate array elements (shift left/right) instead of reverse
6. Create a function that returns a new reversed array without modifying the original

---

## Challenge 7: Manual Bubble Sort for Characters

### 📋 Description

Create a program that accepts 10 letters from the user, stores them in an array, and sorts them alphabetically using the bubble sort algorithm. The sorting must be done manually (without using Arrays.sort() or Collections.sort()).

### 🎯 Objectives

- Implement a fundamental sorting algorithm from scratch
- Understand how comparison-based sorting works
- Practice nested loops for algorithm implementation
- Learn to swap elements
- Debug algorithmic logic
- Practice with character data type

### 📝 Requirements

**Input**: 10 letters (uppercase or lowercase)

**Output**:

- Original array
- Sorted array (ascending alphabetical order)
- Number of passes and comparisons made (optional but recommended)

**Example**:

```
Input: Z A M B Q P L O T R

Original array: Z A M B Q P L O T R
Sorted array:   A B L M O P Q R T Z
Passes made: 9
Total comparisons: 45
```

### 🔧 Constraints

1. Must implement bubble sort algorithm from scratch
2. Cannot use Arrays.sort() or Collections.sort()
3. Must use character array (char[])
4. Use nested loops (outer loop for passes, inner loop for comparisons)
5. Must include swapping logic with temp variable
6. Must validate input (ensure exactly 10 letters)
7. Should be case-insensitive (treat 'A' and 'a' as the same)
8. Include comments explaining each phase of the algorithm
9. Bonus: Track and display number of passes and swaps

### 💡 Key Concepts

- Nested loops for algorithm implementation
- Character comparison using compareTo() or < > operators
- Bubble sort algorithm
- Element swapping
- Algorithm efficiency and optimization
- Breaking early when sorted (optimization)
- Character handling and case conversion

### 🚀 Extended Challenges

1. Sort in descending order (Z to A)
2. Sort mixed case letters while being case-insensitive
3. Implement selection sort or insertion sort instead
4. Add visual output showing each pass/swap
5. Accept variable number of letters (not just 10)
6. Sort strings/words instead of single characters
7. Implement optimized bubble sort (break when no swaps occur)
8. Compare performance of bubble sort vs Arrays.sort()
9. Create a function that accepts any array and sorts it

---

## 🎓 Skills Summary

These three challenges collectively test and develop:

| Skill                 | Challenge 5 | Challenge 6 | Challenge 7 |
| --------------------- | :---------: | :---------: | :---------: |
| Nested Loops          |     ✓✓      |      ✓      |     ✓✓      |
| Array Indexing        |      ✓      |     ✓✓      |     ✓✓      |
| Element Swapping      |             |     ✓✓      |     ✓✓      |
| Algorithm Design      |             |             |     ✓✓      |
| Input Validation      |             |      ✓      |      ✓      |
| Output Formatting     |      ✓      |      ✓      |      ✓      |
| In-Place Operations   |             |     ✓✓      |     ✓✓      |
| Character Comparisons |             |             |      ✓      |

---

## 💻 Implementation Tips

### For Challenge 5:

- Use `String.format()` or `System.out.printf()` for alignment
- Plan your column width before coding
- Test with a smaller table first (3×3) before going to 10×10

### For Challenge 6:

- Draw or visualize the swapping process on paper first
- Remember: swap uses a temp variable (int temp = arr[i]; arr[i] = arr[n-1-i]; arr[n-1-i] = temp;)
- Stop the loop at the midpoint (i < arr.length/2)

### For Challenge 7:

- Start by comparing only two elements to understand sorting
- Add debug output to track each pass
- Test with partially sorted data first (harder to detect bugs)
- Consider optimization: if no swaps occur in a pass, list is sorted

---

## 🧪 Testing Checklist

### Challenge 5:

- [ ] Displays correct visual alignment
- [ ] All multiplications are correct
- [ ] Headers are clearly labeled
- [ ] Works for different ranges (if extended)

### Challenge 6:

- [ ] Correctly reads all 5 inputs
- [ ] Displays both original and reversed arrays
- [ ] Array is actually reversed (not just printed backward)
- [ ] Handles non-integer input gracefully

### Challenge 7:

- [ ] All 10 letters are read correctly
- [ ] Letters are sorted alphabetically
- [ ] Case is handled properly
- [ ] Sorting algorithm actually implements bubble sort
- [ ] Large inversions are fixed (e.g., Z A M sorts correctly)

---

## 📊 Difficulty Breakdown

- **Challenge 5**: Medium-Hard (format complexity)
- **Challenge 6**: Hard (algorithmic thinking, in-place operations)
- **Challenge 7**: Hard (algorithm implementation, nested loops, comparisons)

**Recommended Order**: Challenge 5 → Challenge 6 → Challenge 7

Good luck! 🚀
