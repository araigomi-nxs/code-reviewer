package com.reviewer.topics;

import com.reviewer.StudyTopic;

public class MathsTopic implements StudyTopic {

    @Override
    public String getConcepts() {
        return """
                ========== JAVA MATH CLASS CONCEPTS ==========

                1. WHAT IS THE MATH CLASS?
                   - Utility class in java.lang package
                   - Provides mathematical functions and constants
                   - All methods are static (no object creation needed)
                   - Syntax: Math.methodName()

                2. IMPORTANT CONSTANTS
                   - Math.PI: 3.141592653589793
                   - Math.E: 2.718281828459045

                3. COMMON METHODS
                   - Math.sqrt(x): Returns square root of x
                   - Math.pow(x, y): Returns x raised to power y
                   - Math.abs(x): Returns absolute value (magnitude)
                   - Math.max(x, y): Returns the larger value
                   - Math.min(x, y): Returns the smaller value
                   - Math.round(x): Rounds to nearest integer
                   - Math.ceil(x): Rounds up to nearest integer
                   - Math.floor(x): Rounds down to nearest integer
                   - Math.random(): Returns random decimal between 0.0 and 1.0

                4. TRIGONOMETRIC FUNCTIONS
                   - Math.sin(x): Sine (x in radians)
                   - Math.cos(x): Cosine (x in radians)
                   - Math.tan(x): Tangent (x in radians)

                5. LOGARITHMIC FUNCTIONS
                   - Math.log(x): Natural logarithm (base e)
                   - Math.log10(x): Logarithm base 10

                6. REAL-WORLD APPLICATIONS
                   - Distance calculations
                   - Physics simulations
                   - Financial calculations
                   - Game development
                   - Cryptography
                """;
    }

    @Override
    public String getSampleCode() {
        return """
                ========== SAMPLE CODE ==========

                // BASIC MATH OPERATIONS
                System.out.println("Square root of 16: " + Math.sqrt(16));  // Output: 4.0
                System.out.println("2 to the power of 3: " + Math.pow(2, 3));  // Output: 8.0
                System.out.println("Absolute value of -15: " + Math.abs(-15));  // Output: 15

                // MAX AND MIN
                System.out.println("Max of 10 and 25: " + Math.max(10, 25));  // Output: 25
                System.out.println("Min of 10 and 25: " + Math.min(10, 25));  // Output: 10

                // ROUNDING
                System.out.println("Round 4.5: " + Math.round(4.5));  // Output: 5
                System.out.println("Ceil 4.1: " + Math.ceil(4.1));  // Output: 5.0
                System.out.println("Floor 4.9: " + Math.floor(4.9));  // Output: 4.0

                // RANDOM NUMBER
                double randomNum = Math.random() * 100;  // Random between 0 and 100
                System.out.println("Random number (0-100): " + randomNum);

                // DISTANCE CALCULATION
                int x1 = 0, y1 = 0, x2 = 3, y2 = 4;
                double distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                System.out.println("Distance between (0,0) and (3,4): " + distance);  // Output: 5.0

                // CIRCLE AREA CALCULATION
                double radius = 5;
                double area = Math.PI * Math.pow(radius, 2);
                System.out.println("Area of circle (radius 5): " + area);  // Output: 78.53981633974483

                // TRIGONOMETRIC
                double angle = Math.PI / 4;  // 45 degrees
                System.out.println("Sin(45°): " + Math.sin(angle));  // Output: 0.7071067811865476
                System.out.println("Cos(45°): " + Math.cos(angle));  // Output: 0.7071067811865476
                """;
    }

    @Override
    public String getChallenge() {
        return """
                ========== CHALLENGES ==========

                Challenge 1: Circle Area Calculator
                ================================================================
                Write a method to calculate the area of a circle.
                Formula: area = π * r²

                Your Task:
                1. Create method: double calculateCircleArea(double radius)
                2. Use Math.PI for the constant
                3. Use Math.pow(radius, 2) for radius squared
                4. Test with radius = 5, 10, 3.5

                Expected Results:
                - radius 5 → area ≈ 78.54
                - radius 10 → area ≈ 314.16
                - radius 3.5 → area ≈ 38.48

                Challenge 2: Find Min and Max in Array
                ================================================================
                Write methods to find the minimum and maximum values in an array.

                Your Task:
                1. Create method: int findMin(int[] numbers)
                2. Create method: int findMax(int[] numbers)
                3. Use Math.min() and Math.max() methods
                4. Test with arrays: {5, 10, 3, 8, 1}, {100, 50, 75}

                Expected Results:
                - Array {5, 10, 3, 8, 1} → min = 1, max = 10
                - Array {100, 50, 75} → min = 50, max = 100

                Challenge 3: Distance Formula
                ================================================================
                Calculate the distance between two points using the distance formula.
                Formula: distance = √((x₂ - x₁)² + (y₂ - y₁)²)

                Your Task:
                1. Create method: double calculateDistance(int x1, int y1, int x2, int y2)
                2. Use Math.sqrt() and Math.pow()
                3. Test with points: (0,0) to (3,4), (1,1) to (4,5)

                Expected Results:
                - (0,0) to (3,4) → distance = 5.0
                - (1,1) to (4,5) → distance ≈ 5.0

                ✨ HARD CHALLENGE 4: Pythagorean Triple Validator
                ================================================================
                A Pythagorean triple is a set of three positive integers a, b, c
                such that a² + b² = c² (e.g., 3, 4, 5 or 5, 12, 13)

                Your Task:
                1. Create a method: boolean isPythagoreanTriple(int a, int b, int c)
                2. Use Math.pow() to calculate a², b², c²
                3. Return true if it's a valid triple, false otherwise
                4. Test with multiple values

                Test Cases:
                - isPythagoreanTriple(3, 4, 5) → true (3² + 4² = 9 + 16 = 25 = 5²)
                - isPythagoreanTriple(5, 12, 13) → true
                - isPythagoreanTriple(7, 8, 9) → false
                - isPythagoreanTriple(6, 8, 10) → true

                DIFFICULTY: Hard
                CONCEPTS: Math.pow(), conditional logic
                ESTIMATED TIME: 30 minutes


                ✨ MEDIUM CHALLENGE 5: Random Number Generator
                ================================================================
                Use Math.random() to generate random numbers in different ranges.
                Math.random() generates a random decimal between 0.0 (inclusive) and 1.0 (exclusive)

                Your Task:
                1. Generate a random number between 0.0 and 1.0 using Math.random()
                   Display the result with 4 decimal places
                2. Generate a random integer between 0 and 10 (inclusive)
                   Formula: (int) (Math.random() * 11)
                3. Generate a random integer between 1 and 100 (inclusive)
                   Formula: (int) (Math.random() * 100) + 1
                4. Generate a random integer between 0 and 100 (inclusive)
                   Formula: (int) (Math.random() * 101)
                5. Generate a random integer between 50 and 100 (inclusive)
                   Formula: (int) (Math.random() * 51) + 50
                6. Create a method: void generateRandomNumbers()
                   That displays all five types of random numbers

                Expected Results:
                - Random decimal (0.0-1.0): 0.7234 (or any value in range)
                - Random 0-10: 7 (or any value 0-10)
                - Random 1-100: 45 (or any value 1-100)
                - Random 0-100: 67 (or any value 0-100)
                - Random 50-100: 78 (or any value 50-100)

                DIFFICULTY: Medium
                CONCEPTS: Math.random(), type casting, mathematical formulas, range calculation
                ESTIMATED TIME: 20 minutes

                ✨ MEDIUM CHALLENGE 6: Precision Rounding
                ================================================================
                Round decimal numbers to various decimal places using Math.round().
                Formula: Math.round(value * 10^places) / 10^places

                Your Task:
                Use a test value: 3.14159265
                1. Round to nearest whole number (0 decimal places)
                   Formula: (int) Math.round(value)
                   Expected: 3
                2. Round to nearest 10th place (1 decimal place)
                   Formula: Math.round(value * 10) / 10.0
                   Expected: 3.1
                3. Round to nearest 100th place (2 decimal places)
                   Formula: Math.round(value * 100) / 100.0
                   Expected: 3.14
                4. Round to nearest 1000th place (3 decimal places)
                   Formula: Math.round(value * 1000) / 1000.0
                   Expected: 3.142
                5. Create a method: void demonstratePrecisionRounding()
                   That shows all four rounding levels

                Expected Results:
                - Whole number: 3
                - 10th place: 3.1
                - 100th place: 3.14
                - 1000th place: 3.142

                DIFFICULTY: Medium
                CONCEPTS: Math.round(), decimal precision, mathematical scaling
                ESTIMATED TIME: 20 minutes

                OVERALL DIFFICULTY: Easy to Medium
                ESTIMATED TIME: 140 minutes
                """;
    }

    @Override
    public void runSampleCode() {
        System.out.println("\nRunning sample code for Math Class...\n");

        // BASIC MATH OPERATIONS
        System.out.println("=== Basic Math Operations ===");
        System.out.println("Square root of 16: " + Math.sqrt(16));
        System.out.println("2 to the power of 3: " + Math.pow(2, 3));
        System.out.println("Absolute value of -15: " + Math.abs(-15));

        // MAX AND MIN
        System.out.println("\n=== Max and Min ===");
        System.out.println("Max of 10 and 25: " + Math.max(10, 25));
        System.out.println("Min of 10 and 25: " + Math.min(10, 25));

        // ROUNDING
        System.out.println("\n=== Rounding ===");
        System.out.println("Round 4.5: " + Math.round(4.5));
        System.out.println("Ceil 4.1: " + Math.ceil(4.1));
        System.out.println("Floor 4.9: " + Math.floor(4.9));

        // RANDOM NUMBER
        System.out.println("\n=== Random Number ===");
        double randomNum = Math.random() * 100;
        System.out.println("Random number (0-100): " + randomNum);

        // DISTANCE CALCULATION
        System.out.println("\n=== Distance Calculation ===");
        int x1 = 0, y1 = 0, x2 = 3, y2 = 4;
        double distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        System.out.println("Distance between (0,0) and (3,4): " + distance);

        // CIRCLE AREA CALCULATION
        System.out.println("\n=== Circle Area ===");
        double radius = 5;
        double area = Math.PI * Math.pow(radius, 2);
        System.out.println("Area of circle (radius 5): " + area);

        // TRIGONOMETRIC
        System.out.println("\n=== Trigonometric Functions ===");
        double angle = Math.PI / 4; // 45 degrees
        System.out.println("Sin(45°): " + Math.sin(angle));
        System.out.println("Cos(45°): " + Math.cos(angle));

        // PYTHAGOREAN TRIPLE EXAMPLE
        System.out.println("\n=== Pythagorean Triple Examples ===");
        System.out.println("Is (3,4,5) a Pythagorean triple?");
        boolean isTriple345 = isPythagoreanTriple(3, 4, 5);
        System.out.println("3² + 4² = " + (3 * 3) + " + " + (4 * 4) + " = " + (9 + 16));
        System.out.println("5² = " + (5 * 5));
        System.out.println("Result: " + isTriple345);

        System.out.println("\nIs (7,8,9) a Pythagorean triple?");
        boolean isTriple789 = isPythagoreanTriple(7, 8, 9);
        System.out.println("7² + 8² = " + (7 * 7) + " + " + (8 * 8) + " = " + (49 + 64));
        System.out.println("9² = " + (9 * 9));
        System.out.println("Result: " + isTriple789);

        // RANDOM NUMBER GENERATION
        System.out.println("\n=== Random Number Generation ===");
        generateRandomNumbers();

        // PRECISION ROUNDING
        System.out.println("\n=== Precision Rounding ===");
        demonstratePrecisionRounding();
    }

    // Helper method for Challenge 5
    private void generateRandomNumbers() {
        System.out.println("Random decimal (0.0-1.0): " + String.format("%.4f", Math.random()));
        System.out.println("Random 0-10: " + (int) (Math.random() * 11));
        System.out.println("Random 1-100: " + (int) (Math.random() * 100) + 1);
        System.out.println("Random 0-100: " + (int) (Math.random() * 101));
        System.out.println("Random 50-100: " + (int) (Math.random() * 51) + 50);
    }

    // Helper method for Challenge 6
    private void demonstratePrecisionRounding() {
        double value = 3.14159265;
        System.out.println("Original value: " + value);

        // Round to whole number
        double whole = Math.round(value);
        System.out.println("Rounded to whole number: " + whole);

        // Round to 10th place (1 decimal)
        double tenth = Math.round(value * 10) / 10.0;
        System.out.println("Rounded to 10th place: " + tenth);

        // Round to 100th place (2 decimals)
        double hundredth = Math.round(value * 100) / 100.0;
        System.out.println("Rounded to 100th place: " + hundredth);

        // Round to 1000th place (3 decimals)
        double thousandth = Math.round(value * 1000) / 1000.0;
        System.out.println("Rounded to 1000th place: " + thousandth);
    }

    // Helper method for Challenge 4
    private boolean isPythagoreanTriple(int a, int b, int c) {
        double aSq = Math.pow(a, 2);
        double bSq = Math.pow(b, 2);
        double cSq = Math.pow(c, 2);
        return aSq + bSq == cSq;
    }

    // Helper method for Challenge 3
    private double calculateDistance(int x1, int y1, int x2, int y2) {
        double dx = x2 - x1;
        double dy = y2 - y1;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
}
