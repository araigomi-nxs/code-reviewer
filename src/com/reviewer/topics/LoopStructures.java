package com.reviewer.topics;

import com.reviewer.StudyTopic;

public class LoopStructures implements StudyTopic {

    @Override
    public String getConcepts() {
        return """
                ========== LOOP STRUCTURES CONCEPTS ==========

                1. FOR LOOP
                   - Used when you know the exact number of iterations
                   - Syntax: for(init; condition; increment) { }
                   - Best for: Iterating with index, known repetitions

                2. WHILE LOOP
                   - Used when the number of iterations is unknown
                   - Syntax: while(condition) { }
                   - Best for: Conditional iteration, user input loops

                3. DO-WHILE LOOP
                   - Executes at least once before checking condition
                   - Syntax: do { } while(condition);
                   - Best for: Menu-driven programs, at least one execution needed

                4. NESTED LOOPS
                   - Loops within loops
                   - Used for: 2D patterns, matrix operations, multiple iterations

                5. BREAK & CONTINUE
                   - break: Exits the loop immediately
                   - continue: Skips current iteration, continues with next
                """;
    }

    @Override
    public String getSampleCode() {
        return """
                ========== SAMPLE CODE ==========

                // FOR LOOP Example
                System.out.println("FOR LOOP:");
                for (int i = 1; i <= 5; i++) {
                    System.out.print(i + " ");  // Output: 1 2 3 4 5
                }

                // WHILE LOOP Example
                System.out.println("\\nWHILE LOOP:");
                int count = 0;
                while (count < 3) {
                    System.out.print(count + " ");  // Output: 0 1 2
                    count++;
                }

                // DO-WHILE LOOP Example
                System.out.println("\\nDO-WHILE LOOP:");
                int num = 0;
                do {
                    System.out.print(num + " ");  // Output: 0 1 2
                    num++;
                } while (num < 3);

                // NESTED LOOP Example (5x5 grid)
                System.out.println("\\nNESTED LOOP (5x5):");
                for (int i = 1; i <= 5; i++) {
                    for (int j = 1; j <= 5; j++) {
                        System.out.print("* ");
                    }
                    System.out.println();
                }

                // BREAK & CONTINUE Example
                System.out.println("\\nBREAK EXAMPLE (stop at 5):");
                for (int i = 1; i <= 10; i++) {
                    if (i == 5) break;
                    System.out.print(i + " ");  // Output: 1 2 3 4
                }

                System.out.println("\\nCONTINUE EXAMPLE (skip even):");
                for (int i = 1; i <= 5; i++) {
                    if (i % 2 == 0) continue;
                    System.out.print(i + " ");  // Output: 1 3 5
                }
                """;
    }

    @Override
    public String getChallenge() {
        return """
                ========== CHALLENGE ==========

                Challenge 1: Print a Triangle
                Write a program that prints:
                *
                **
                ***
                ****
                *****
                (Hint: Use nested loops)

                Challenge 2: Sum Until Zero
                Write a program using a while loop that:
                - Asks user for numbers
                - Adds them together
                - Stops when user enters 0
                - Prints the sum
                (Hint: Use Scanner for input)

                Challenge 3: Find First Multiple
                Write a program that finds the first number divisible by both 3 and 5
                starting from 1 to 100.
                (Hint: Use break when found)

                Challenge 4: Skip Multiples
                Print numbers 1 to 20, but skip all multiples of 3.
                (Hint: Use continue)

                DIFFICULTY: Easy
                ESTIMATED TIME: 30 minutes
                """;
    }

    @Override
    public void runSampleCode() {
        System.out.println("\nRunning sample code for Loop Structures...\n");

        // FOR LOOP
        System.out.println("FOR LOOP:");
        for (int i = 1; i <= 5; i++) {
            System.out.print(i + " ");
        }

        // WHILE LOOP
        System.out.println("\n\nWHILE LOOP:");
        int count = 0;
        while (count < 3) {
            System.out.print(count + " ");
            count++;
        }

        // DO-WHILE LOOP
        System.out.println("\n\nDO-WHILE LOOP:");
        int num = 0;
        do {
            System.out.print(num + " ");
            num++;
        } while (num < 3);

        // NESTED LOOP
        System.out.println("\n\nNESTED LOOP (3x3):");
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }

        // BREAK
        System.out.println("BREAK EXAMPLE:");
        for (int i = 1; i <= 10; i++) {
            if (i == 5)
                break;
            System.out.print(i + " ");
        }

        // CONTINUE
        System.out.println("\n\nCONTINUE EXAMPLE (skip even numbers):");
        for (int i = 1; i <= 6; i++) {
            if (i % 2 == 0)
                continue;
            System.out.print(i + " ");
        }
        System.out.println();
    }
}
