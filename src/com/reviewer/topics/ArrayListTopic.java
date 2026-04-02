package com.reviewer.topics;

import java.util.ArrayList;

import com.reviewer.StudyTopic;

public class ArrayListTopic implements StudyTopic {

    @Override
    public String getConcepts() {
        return """
                ========== ARRAYLIST CONCEPTS ==========

                1. WHAT IS ARRAYLIST?
                   - Dynamic array that grows/shrinks at runtime
                   - Part of Java Collections Framework
                   - Syntax: ArrayList<Type> name = new ArrayList<>();
                   - Unlike arrays, size can change

                2. KEY DIFFERENCES FROM ARRAYS
                   Array: Fixed size, stores primitives or objects
                   ArrayList: Dynamic size, stores only objects (wrapped primitives)
                   Array access O(1), ArrayList access O(1)
                   Array memory contiguous, ArrayList more flexible

                3. COMMON METHODS
                   add(element) - Add element to end
                   add(index, element) - Add at specific index
                   remove(index) - Remove element at index
                   get(index) - Get element at index
                   size() - Get number of elements
                   contains(element) - Check if element exists
                   isEmpty() - Check if empty

                4. AUTOBOXING & UNBOXING
                   ArrayList<Integer> - needs Integer (wrapper class)
                   When you add int, it auto-wraps to Integer
                   When you retrieve, it auto-unwraps to int

                5. ITERATION METHODS
                   Traditional loop: for(int i = 0; i < list.size(); i++)
                   For-each: for(Integer num : list)
                   Iterator: list.iterator()
                """;
    }

    @Override
    public String getSampleCode() {
        return """
                ========== SAMPLE CODE ==========

                // 1. CREATE ARRAYLIST
                ArrayList<Integer> numbers = new ArrayList<>();
                ArrayList<String> names = new ArrayList<>();
                ArrayList<Double> prices = new ArrayList<>();

                // 2. ADD ELEMENTS
                numbers.add(10);  // Add at end
                numbers.add(20);
                numbers.add(30);
                numbers.add(1, 15);  // Add 15 at index 1
                // Result: [10, 15, 20, 30]

                // 3. ACCESS ELEMENTS
                int first = numbers.get(0);  // Get index 0
                System.out.println(first);  // Output: 10

                // 4. CHECK SIZE
                System.out.println(numbers.size());  // Output: 4

                // 5. REMOVE ELEMENTS
                numbers.remove(1);  // Remove element at index 1
                // Result: [10, 20, 30]

                // 6. CHECK IF CONTAINS
                boolean contains15 = numbers.contains(15);
                System.out.println(contains15);  // Output: false

                // 7. ITERATION - Traditional Loop
                for (int i = 0; i < numbers.size(); i++) {
                    System.out.print(numbers.get(i) + " ");
                }

                // 8. ITERATION - For-Each
                for (int num : numbers) {
                    System.out.print(num + " ");  // Output: 10 20 30
                }

                // 9. FIND MAXIMUM
                int max = numbers.get(0);
                for (int num : numbers) {
                    if (num > max) max = num;
                }
                System.out.println("Max: " + max);  // Output: 30

                // 10. CLEAR ALL ELEMENTS
                numbers.clear();
                System.out.println(numbers.isEmpty());  // Output: true

                // 11. STRING ARRAYLIST
                ArrayList<String> fruits = new ArrayList<>();
                fruits.add("Apple");
                fruits.add("Banana");
                fruits.add("Mango");
                for (String fruit : fruits) {
                    System.out.println(fruit);
                }

                // 12. REMOVE BY VALUE
                fruits.remove("Banana");
                // Result: [Apple, Mango]
                """;
    }

    @Override
    public String getChallenge() {
        return """
                ========== CHALLENGE ==========

                Challenge 1: ArrayList Operations
                1. Create ArrayList of integers
                2. Add: 5, 10, 15, 20, 25
                3. Print all elements
                4. Remove element at index 2
                5. Add 12 at index 1
                Print final list

                Challenge 2: Find Average
                Create ArrayList of test scores
                Add: 95, 87, 92, 78, 88
                Calculate and print average

                Challenge 3: Remove Even Numbers
                Create ArrayList: 1,2,3,4,5,6,7,8,9,10
                Remove all even numbers
                Print remaining odd numbers
                Note: Be careful when removing while iterating!

                Challenge 4: Search and Replace
                Create String ArrayList of names
                Find and replace a specific name with another
                Print updated list

                Challenge 5: Merge Two Lists
                Create two ArrayLists of integers
                Combine them into one
                Print merged list

                Challenge 6: Sort and Find
                Create ArrayList of random numbers
                Find the largest and smallest elements
                Find index of a specific element

                Challenge 7: Word Counter (ADVANCED)
                Create ArrayList of words
                Count how many times each word appears
                Print word frequency

                Challenge 8: Remove Duplicates
                Create ArrayList with duplicate values
                Remove all duplicates
                Print final unique list

                DIFFICULTY: Easy to Medium
                ESTIMATED TIME: 75 minutes
                """;
    }

    @Override
    public void runSampleCode() {
        System.out.println("\nRunning sample code for ArrayList...\n");

        // 1. Create and add elements
        ArrayList<Integer> numbers = new ArrayList<>();
        System.out.println("Creating ArrayList and adding elements...");
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        numbers.add(1, 15); // Insert at index 1
        System.out.println("ArrayList: " + numbers);

        // 2. Size and access
        System.out.println("\nSize: " + numbers.size());
        System.out.println("Element at index 0: " + numbers.get(0));
        System.out.println("Element at index 2: " + numbers.get(2));

        // 3. Remove element
        System.out.println("\nRemoving element at index 1 (value: " + numbers.get(1) + ")");
        numbers.remove(1);
        System.out.println("ArrayList after removal: " + numbers);

        // 4. Check contains
        System.out.println("\nContains 30? " + numbers.contains(30));
        System.out.println("Contains 15? " + numbers.contains(15));

        // 5. Find max
        int max = numbers.get(0);
        for (int num : numbers) {
            if (num > max)
                max = num;
        }
        System.out.println("Maximum value: " + max);

        // 6. String ArrayList
        ArrayList<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Mango");
        fruits.add("Orange");
        System.out.println("\nString ArrayList: " + fruits);
        System.out.println("Size: " + fruits.size());
        System.out.println("Contains 'Banana'? " + fruits.contains("Banana"));

        // 7. Remove and iterate
        System.out.println("\nRemoving 'Banana'...");
        fruits.remove("Banana");
        System.out.println("Remaining fruits:");
        for (String fruit : fruits) {
            System.out.println("- " + fruit);
        }

        // 8. Clear
        System.out.println("\nClearing ArrayList...");
        numbers.clear();
        System.out.println("Is empty? " + numbers.isEmpty());
    }
}
