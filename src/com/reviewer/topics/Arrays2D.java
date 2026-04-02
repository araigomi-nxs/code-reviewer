package com.reviewer.topics;

import com.reviewer.StudyTopic;

public class Arrays2D implements StudyTopic {

    @Override
    public String getConcepts() {
        return """
                ========== 2D ARRAYS CONCEPTS ==========

                1. WHAT IS A 2D ARRAY?
                   - Array of arrays (grid structure)
                   - Represents rows and columns
                   - Syntax: DataType[][] arrayName = new DataType[rows][cols];
                   - Example: int[][] matrix = new int[3][4];

                2. DECLARATION & INITIALIZATION
                   int[][] arr1 = new int[2][3];  // Empty 2x3
                   int[][] arr2 = {{1,2,3}, {4,5,6}};  // Literal
                   int[][] arr3 = new int[2][];  // Jagged array

                3. ACCESSING ELEMENTS
                   arr[row][col] - Access element at row, col
                   arr.length - Get number of rows
                   arr[i].length - Get number of columns in row i

                4. TRAVERSAL PATTERNS
                   Row-Major: Loop through rows first, then columns
                   Column-Major: Loop through columns first, then rows
                   Diagonal: Access diagonal elements

                5. COMMON OPERATIONS
                   Sum all elements
                   Find max/min
                   Sum of diagonals
                   Transpose (swap rows and columns)
                """;
    }

    @Override
    public String getSampleCode() {
        return """
                ========== SAMPLE CODE ==========

                // 1. DECLARATION & INITIALIZATION
                int[][] matrix = new int[2][3];  // 2 rows, 3 columns
                int[][] matrix2 = {{1, 2, 3}, {4, 5, 6}};  // With values

                // 2. ASSIGNMENT & ACCESS
                matrix[0][0] = 5;  // Assign value
                int value = matrix[0][0];  // Access value
                System.out.println(value);  // Output: 5

                // 3. GET DIMENSIONS
                System.out.println("Rows: " + matrix.length);  // Output: 2
                System.out.println("Cols: " + matrix[0].length);  // Output: 3

                // 4. ROW-MAJOR TRAVERSAL (row first)
                for (int i = 0; i < matrix.length; i++) {
                    for (int j = 0; j < matrix[i].length; j++) {
                        System.out.print(matrix[i][j] + " ");
                    }
                    System.out.println();
                }

                // 5. COLUMN-MAJOR TRAVERSAL (column first)
                for (int j = 0; j < matrix[0].length; j++) {
                    for (int i = 0; i < matrix.length; i++) {
                        System.out.print(matrix[i][j] + " ");
                    }
                }

                // 6. FOR-EACH LOOP WITH 2D ARRAY
                for (int[] row : matrix) {
                    for (int val : row) {
                        System.out.print(val + " ");
                    }
                    System.out.println();
                }

                // 7. SUM ALL ELEMENTS
                int sum = 0;
                for (int[] row : matrix) {
                    for (int val : row) {
                        sum += val;
                    }
                }
                System.out.println("Sum: " + sum);

                // 8. FIND MAXIMUM
                int max = matrix[0][0];
                for (int[] row : matrix) {
                    for (int val : row) {
                        if (val > max) max = val;
                    }
                }
                System.out.println("Max: " + max);

                // 9. IDENTITY MATRIX (1s on diagonal)
                int[][] identity = new int[3][3];
                for (int i = 0; i < 3; i++) {
                    identity[i][i] = 1;
                }

                // 10. JAGGED ARRAY (rows have different lengths)
                int[][] jagged = new int[3][];
                jagged[0] = new int[1];  // 1 column
                jagged[1] = new int[2];  // 2 columns
                jagged[2] = new int[3];  // 3 columns
                """;
    }

    @Override
    public String getChallenge() {
        return """
                ========== CHALLENGE ==========

                Challenge 1: Sum All Elements
                Create a 3x3 matrix with values:
                {{1,2,3}, {4,5,6}, {7,8,9}}
                Calculate and print total sum (should be 45)

                Challenge 2: Find Maximum
                Find the maximum value in a 2x4 matrix
                Print its position (row, column)

                Challenge 3: Matrix Transpose
                Create a 2x3 matrix and transpose it to 3x2
                Original:     Transposed:
                1 2 3    →    1 4
                4 5 6         2 5
                              3 6

                Challenge 4: Diagonal Sum
                Create a 4x4 matrix and sum only diagonal elements
                (elements where row == column)

                Challenge 5: Print Pattern
                Create an NxN matrix and print:
                1. Upper triangle (where col >= row)
                2. Lower triangle (where col <= row)
                3. Diagonal elements

                Challenge 6: Matrix Rotation
                Rotate a 3x3 matrix 90 degrees clockwise

                Challenge 7: Search in 2D Array
                Create a 3x3 matrix and search for a value
                Print true/false and position if found

                DIFFICULTY: Easy to Medium
                ESTIMATED TIME: 60 minutes
                """;
    }

    @Override
    public void runSampleCode() {
        System.out.println("\nRunning sample code for 2D Arrays...\n");

        // 1. Basic 2D Array
        int[][] matrix = { { 1, 2, 3 }, { 4, 5, 6 }, { 7, 8, 9 } };

        System.out.println("ORIGINAL MATRIX:");
        printMatrix(matrix);

        // 2. Dimensions
        System.out.println("\nDimensions: " + matrix.length + " rows, " + matrix[0].length + " columns");

        // 3. Sum all elements
        int sum = 0;
        for (int[] row : matrix) {
            for (int val : row) {
                sum += val;
            }
        }
        System.out.println("Sum of all elements: " + sum);

        // 4. Find maximum
        int max = matrix[0][0];
        for (int[] row : matrix) {
            for (int val : row) {
                if (val > max)
                    max = val;
            }
        }
        System.out.println("Maximum value: " + max);

        // 5. Diagonal sum
        int diagonalSum = 0;
        for (int i = 0; i < matrix.length && i < matrix[0].length; i++) {
            diagonalSum += matrix[i][i];
        }
        System.out.println("Diagonal sum (top-left to bottom-right): " + diagonalSum);

        // 6. Print specific row and column
        System.out.println("\nFirst row: ");
        for (int val : matrix[0]) {
            System.out.print(val + " ");
        }

        System.out.println("\nFirst column: ");
        for (int[] row : matrix) {
            System.out.println(row[0]);
        }
    }

    private static void printMatrix(int[][] matrix) {
        for (int[] row : matrix) {
            for (int val : row) {
                System.out.print(val + " ");
            }
            System.out.println();
        }
    }
}
