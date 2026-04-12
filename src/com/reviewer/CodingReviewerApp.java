package com.reviewer;

import java.util.Scanner;

public class CodingReviewerApp {
    private Scanner scanner;

    public CodingReviewerApp() {
        this.scanner = new Scanner(System.in);
    }

    public static void main(String[] args) {
        CodingReviewerApp app = new CodingReviewerApp();
        app.run();
    }

    public void run() {
        boolean running = true;

        while (running) {
            displayMainMenu();
            int choice = getUserChoice();

            switch (choice) {
                case 1:
                    runTopic("Loop Structures", "com.reviewer.topics.LoopStructures");
                    break;
                case 2:
                    runTopic("For-Each Loop", "com.reviewer.topics.ForEachLoop");
                    break;
                case 3:
                    runTopic("Recursion", "com.reviewer.topics.Recursion");
                    break;
                case 4:
                    runTopic("2D Arrays", "com.reviewer.topics.Arrays2D");
                    break;
                case 5:
                    runTopic("ArrayList", "com.reviewer.topics.ArrayListTopic");
                    break;
                case 6:
                    runTopic("OOP Basics", "com.reviewer.topics.OOPBasics");
                    break;
                case 7:
                    runTopic("Maths Topic", "com.reviewer.topics.MathsTopic");
                    break;
                case 8:
                    running = false;
                    System.out.println("\nThank you for using Coding Study Reviewer! Happy coding!");
                    break;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }

        scanner.close();
    }

    private void displayMainMenu() {
        System.out.println("\n========== CODING STUDY REVIEWER ==========");
        System.out.println("Easy Level (Foundations)");
        System.out.println("==========================================");
        System.out.println("1. Loop Structures");
        System.out.println("2. For-Each Loop");
        System.out.println("3. Recursion");
        System.out.println("4. 2D Arrays");
        System.out.println("5. ArrayList");
        System.out.println("6. OOP Basics");
        System.out.println("7. Maths Topic");
        System.out.println("8. Exit");
        System.out.print("Choose a topic: ");
    }

    private int getUserChoice() {
        try {
            return Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private void runTopic(String topicName, String className) {
        System.out.println("\n========== " + topicName.toUpperCase() + " ==========");

        try {
            Class<?> topicClass = Class.forName(className);
            Object topic = topicClass.getDeclaredConstructor().newInstance();

            if (topic instanceof StudyTopic) {
                StudyTopic studyTopic = (StudyTopic) topic;
                topicMenu(studyTopic, topicName);
            }
        } catch (Exception e) {
            System.out.println("Error loading topic: " + e.getMessage());
        }
    }

    private void topicMenu(StudyTopic topic, String topicName) {
        boolean inTopic = true;

        while (inTopic) {
            System.out.println("\n--- " + topicName + " ---");
            System.out.println("1. View Concepts & Examples");
            System.out.println("2. Run Sample Code");
            System.out.println("3. Test Your Knowledge (Challenge)");
            System.out.println("4. Back to Main Menu");
            System.out.print("Choose an option: ");

            int choice = getUserChoice();

            switch (choice) {
                case 1:
                    System.out.println("\n" + topic.getConcepts());
                    break;
                case 2:
                    System.out.println("\n" + topic.getSampleCode());
                    executeSample(topic);
                    break;
                case 3:
                    System.out.println("\n" + topic.getChallenge());
                    break;
                case 4:
                    inTopic = false;
                    break;
                default:
                    System.out.println("Invalid choice.");
            }
        }
    }

    private void executeSample(StudyTopic topic) {
        System.out.print("\nRun the sample code? (y/n): ");
        String answer = scanner.nextLine();
        if (answer.equalsIgnoreCase("y")) {
            topic.runSampleCode();
        }
    }
}
