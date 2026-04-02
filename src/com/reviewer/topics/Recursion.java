package com.reviewer.topics;

import com.reviewer.StudyTopic;

public class Recursion implements StudyTopic {

    @Override
    public String getConcepts() {
        return """
                ========== RECURSION CONCEPTS ==========

                1. WHAT IS RECURSION?
                   - A method calling itself
                   - Must have a BASE CASE (stop condition)
                   - Must have a RECURSIVE CASE (progress toward base case)

                2. THREE RULES OF RECURSION
                   Rule 1: Base Case - Stop condition (when to stop recursing)
                   Rule 2: Recursive Case - Method calls itself with modified input
                   Rule 3: Progress - Each call must progress toward base case

                3. HOW IT WORKS (Stack)
                   - Each call adds a layer to the "call stack"
                   - Base case is reached, then unwinding occurs
                   - Results propagate back up the stack

                4. COMMON EXAMPLES
                   - Factorial: n! = n * (n-1)!
                   - Fibonacci: fib(n) = fib(n-1) + fib(n-2)
                   - Sum of digits: sum = digit + sum(remaining)

                5. RECURSION VS LOOPS
                   Recursion: Elegant, natural, but uses more memory
                   Loops: More efficient, less memory, harder to read sometimes
                """;
    }

    @Override
    public String getSampleCode() {
        return """
                ========== SAMPLE CODE ==========

                // 1. FACTORIAL Example
                // Base case: factorial(0) = 1
                // Recursive case: factorial(n) = n * factorial(n-1)
                public static int factorial(int n) {
                    if (n == 0) return 1;  // Base case
                    return n * factorial(n - 1);  // Recursive case
                }
                // factorial(5) = 5 * 4 * 3 * 2 * 1 = 120

                // 2. SUM OF DIGITS
                // Base case: if n < 10, return n
                // Recursive: sum = last digit + sum of rest
                public static int sumOfDigits(int n) {
                    if (n < 10) return n;  // Base case
                    return (n % 10) + sumOfDigits(n / 10);  // Recursive
                }
                // sumOfDigits(123) = 3 + 2 + 1 = 6

                // 3. FIBONACCI Numbers
                // Base cases: fib(0) = 0, fib(1) = 1
                // Recursive: fib(n) = fib(n-1) + fib(n-2)
                public static int fibonacci(int n) {
                    if (n <= 1) return n;  // Base case
                    return fibonacci(n - 1) + fibonacci(n - 2);  // Recursive
                }
                // fibonacci(6) = 8 (sequence: 0,1,1,2,3,5,8)

                // 4. POWER (a^b)
                // Base case: a^0 = 1
                // Recursive: a^b = a * a^(b-1)
                public static int power(int a, int b) {
                    if (b == 0) return 1;  // Base case
                    return a * power(a, b - 1);  // Recursive
                }
                // power(2, 3) = 2 * 2 * 2 = 8

                // 5. REVERSE A STRING
                // Base case: if empty, return empty
                // Recursive: last char + reverse(rest)
                public static String reverse(String s) {
                    if (s.isEmpty()) return "";  // Base case
                    return reverse(s.substring(1)) + s.charAt(0);  // Recursive
                }
                // reverse("Hello") = "olleH"
                """;
    }

    @Override
    public String getChallenge() {
        return """
                ========== CHALLENGE ==========

                Challenge 1: Calculate Factorial
                Write a recursive method to calculate n!
                Test: 5! = 120

                Challenge 2: Sum of Digits
                Write a recursive method that returns sum of all digits
                Example: 345 → 3+4+5 = 12

                Challenge 3: Power Function
                Write a recursive method for a^b (a to the power b)
                Example: power(2, 4) = 16

                Challenge 4: Count Digits
                Write a recursive method to count digits in a number
                Example: 12345 → 5 digits

                Challenge 5: Fibonacci Sequence
                Write a recursive method to find nth Fibonacci number
                Example: fib(6) = 8
                Sequence: 0, 1, 1, 2, 3, 5, 8, 13...

                Challenge 6: Array Sum (ADVANCED)
                Write a recursive method to sum all elements in an array
                Hint: Use array length and recursion

                Challenge 7: Binary Search (HARDER)
                Implement binary search recursively

                DIFFICULTY: Easy to Hard
                ESTIMATED TIME: 90 minutes
                """;
    }

    @Override
    public void runSampleCode() {
        System.out.println("\nRunning sample code for Recursion...\n");

        // Factorial
        System.out.println("FACTORIAL:");
        System.out.println("5! = " + factorial(5));
        System.out.println("0! = " + factorial(0));

        // Sum of Digits
        System.out.println("\nSUM OF DIGITS:");
        System.out.println("sumOfDigits(123) = " + sumOfDigits(123));
        System.out.println("sumOfDigits(9) = " + sumOfDigits(9));

        // Fibonacci
        System.out.println("\nFIBONACCI:");
        System.out.println("fibonacci(0) = " + fibonacci(0));
        System.out.println("fibonacci(6) = " + fibonacci(6));

        // Power
        System.out.println("\nPOWER:");
        System.out.println("power(2, 3) = " + power(2, 3));
        System.out.println("power(3, 2) = " + power(3, 2));

        // Reverse String
        System.out.println("\nREVERSE STRING:");
        System.out.println("reverse('Hello') = " + reverse("Hello"));
        System.out.println("reverse('Java') = " + reverse("Java"));
    }

    // Helper methods for demonstration
    private static int factorial(int n) {
        if (n == 0)
            return 1;
        return n * factorial(n - 1);
    }

    private static int sumOfDigits(int n) {
        if (n < 10)
            return n;
        return (n % 10) + sumOfDigits(n / 10);
    }

    private static int fibonacci(int n) {
        if (n <= 1)
            return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    private static int power(int a, int b) {
        if (b == 0)
            return 1;
        return a * power(a, b - 1);
    }

    private static String reverse(String s) {
        if (s.isEmpty())
            return "";
        return reverse(s.substring(1)) + s.charAt(0);
    }
}
