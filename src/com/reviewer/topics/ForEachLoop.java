package com.reviewer.topics;

import com.reviewer.StudyTopic;

public class ForEachLoop implements StudyTopic {

    @Override
    public String getConcepts() {
        return """
                ========== FOR-EACH LOOP CONCEPTS ==========

                1. WHAT IS FOR-EACH LOOP?
                   - Enhanced for loop introduced in Java 5
                   - Syntax: for(DataType item : collection) { }
                   - Simplified way to iterate through arrays and collections

                2. ADVANTAGES
                   - Cleaner code and easier to read
                   - No index management needed
                   - Works with arrays and any Iterable (ArrayList, etc.)

                3. LIMITATIONS
                   - Cannot access index (unless you need a workaround)
                   - Cannot modify collection while iterating (in some cases)
                   - Can only iterate forward

                4. WHEN TO USE
                   - When you need to process every element
                   - Reading/using elements (not modifying based on index)
                   - Most common use case for collection iteration

                5. VS TRADITIONAL FOR LOOP
                   Traditional: for(int i = 0; i < arr.length; i++) arr[i]
                   For-each: for(int num : arr) num
                   -> For-each is cleaner when you don't need the index!
                """;
    }

    @Override
    public String getSampleCode() {
        return """
                ========== SAMPLE CODE ==========

                // FOR-EACH with ARRAY
                int[] numbers = {10, 20, 30, 40, 50};
                System.out.println("Array elements:");
                for (int num : numbers) {
                    System.out.print(num + " ");  // Output: 10 20 30 40 50
                }

                // FOR-EACH with STRING ARRAY
                String[] fruits = {"Apple", "Banana", "Mango", "Orange"};
                System.out.println("\\nFruits:");
                for (String fruit : fruits) {
                    System.out.println("- " + fruit);
                }

                // FOR-EACH with ARRAYLIST
                ArrayList<Integer> scores = new ArrayList<>();
                scores.add(95);
                scores.add(87);
                scores.add(92);
                System.out.println("\\nScores:");
                for (Integer score : scores) {
                    System.out.println("Score: " + score);
                }

                // FOR-EACH - Finding values
                int[] ages = {18, 25, 30, 22};
                System.out.println("\\nAges above 20:");
                for (int age : ages) {
                    if (age > 20) {
                        System.out.print(age + " ");  // Output: 25 30 22
                    }
                }

                // FOR-EACH - Nested (2D array)
                int[][] matrix = {{1, 2}, {3, 4}};
                System.out.println("\\nMatrix:");
                for (int[] row : matrix) {
                    for (int val : row) {
                        System.out.print(val + " ");
                    }
                    System.out.println();
                }
                """;
    }

    @Override
    public String getChallenge() {
        return """
                ========== CHALLENGE ==========

                Challenge 1: Sum All Elements
                Given an array: int[] numbers = {5, 10, 15, 20, 25};
                Use for-each to calculate and print the sum.
                Expected: 75

                Challenge 2: Find Average
                Given scores: int[] scores = {88, 92, 76, 85};
                Calculate average using for-each loop.
                Expected: 85.25

                Challenge 3: Count matches
                Given: String[] names = {"Alice", "Bob", "Anna", "Amy"};
                Count how many names start with 'A' using for-each.
                Expected: 3

                Challenge 4: Print in reverse (HARDER)
                Traditional: Print array in reverse only using for-each
                Hint: Create a new array in reverse order first

                Challenge 5: ArrayList Operations
                Create an ArrayList with 5 numbers.
                Use for-each to:
                1. Print all numbers
                2. Find the largest
                3. Count numbers > 50

                DIFFICULTY: Easy to Medium
                ESTIMATED TIME: 45 minutes
                """;
    }

    @Override
    public void runSampleCode() {
        System.out.println("\nRunning sample code for For-Each Loop...\n");

        // FOR-EACH with ARRAY
        int[] numbers = { 10, 20, 30, 40, 50 };
        System.out.println("Array elements:");
        for (int num : numbers) {
            System.out.print(num + " ");
        }

        // FOR-EACH with STRING ARRAY
        String[] fruits = { "Apple", "Banana", "Mango", "Orange" };
        System.out.println("\n\nFruits:");
        for (String fruit : fruits) {
            System.out.println("- " + fruit);
        }

        // FOR-EACH - Finding values
        int[] ages = { 18, 25, 30, 22 };
        System.out.println("\nAges above 20:");
        for (int age : ages) {
            if (age > 20) {
                System.out.print(age + " ");
            }
        }

        // FOR-EACH - Calculate sum
        System.out.println("\n\nSum of numbers array:");
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum = " + sum);

        // FOR-EACH - Nested (2D array)
        int[][] matrix = { { 1, 2, 3 }, { 4, 5, 6 } };
        System.out.println("\nMatrix (2D array):");
        for (int[] row : matrix) {
            for (int val : row) {
                System.out.print(val + " ");
            }
            System.out.println();
        }
    }
}
