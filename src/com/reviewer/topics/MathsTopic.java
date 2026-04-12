package com.reviewer.topics;

import com.reviewer.StudyTopic;

public class MathChallenge implements StudyTopic {

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

                ✨ HARD CHALLENGE 1: Pythagorean Triple Validator
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


                ✨ HARD CHALLENGE 2: Distance Matrix Calculator
                ================================================================
                Given an array of points with coordinates (x, y), calculate the
                distance between ALL pairs of points using the distance formula:
                distance = √((x₂ - x₁)² + (y₂ - y₁)²)

                Your Task:
                1. Create a method to calculate distance between two 2D points
                   double calculateDistance(int x1, int y1, int x2, int y2)
                2. Create a method to build a distance matrix for n points
                   double[][] buildDistanceMatrix(int[][] points)
                3. Use Math.sqrt() and Math.pow()
                4. Return a 2D array showing distances between all point pairs

                Example:
                Points: (0,0), (3,4), (6,0)
                Distance Matrix Output:
                [
                    [0.0,   5.0,   6.0],    // distances from (0,0)
                    [5.0,   0.0,   5.0],    // distances from (3,4)
                    [6.0,   5.0,   0.0]     // distances from (6,0)
                ]

                DIFFICULTY: Hard
                CONCEPTS: Math.sqrt(), Math.pow(), nested loops, 2D arrays
                ESTIMATED TIME: 45 minutes


                💡 BONUS CHALLENGES (ADVANCED):
                1. Create a function to find the closest pair of points
                2. Calculate the perimeter of a polygon given its points
                3. Determine if three points form a right triangle
                4. Generate random coordinate points and find their centroid
                   (centroid formula: cx = (x1+x2+x3)/3, cy = (y1+y2+y3)/3)

                OVERALL DIFFICULTY: Hard
                RECOMMENDED PREREQUISITES: 2D Arrays, Nested Loops
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

        // DISTANCE MATRIX EXAMPLE
        System.out.println("\n=== Distance Matrix Example ===");
        int[][] points = { { 0, 0 }, { 3, 4 }, { 6, 0 } };
        double[][] distanceMatrix = buildDistanceMatrix(points);
        System.out.println("Points: (0,0), (3,4), (6,0)");
        System.out.println("Distance Matrix:");
        for (int i = 0; i < distanceMatrix.length; i++) {
            System.out.print("[ ");
            for (int j = 0; j < distanceMatrix[i].length; j++) {
                System.out.printf("%.1f ", distanceMatrix[i][j]);
            }
            System.out.println("]");
        }
    }

    // Helper method for Challenge 1
    private boolean isPythagoreanTriple(int a, int b, int c) {
        double aSq = Math.pow(a, 2);
        double bSq = Math.pow(b, 2);
        double cSq = Math.pow(c, 2);
        return aSq + bSq == cSq;
    }

    // Helper method for Challenge 2
    private double calculateDistance(int x1, int y1, int x2, int y2) {
        double dx = x2 - x1;
        double dy = y2 - y1;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    // Helper method for Challenge 2
    private double[][] buildDistanceMatrix(int[][] points) {
        int n = points.length;
        double[][] matrix = new double[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) {
                    matrix[i][j] = 0.0;
                } else {
                    int x1 = points[i][0];
                    int y1 = points[i][1];
                    int x2 = points[j][0];
                    int y2 = points[j][1];

                    matrix[i][j] = calculateDistance(x1, y1, x2, y2);
                }
            }
        }

        return matrix;
    }
}
