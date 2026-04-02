package com.reviewer.topics;

import com.reviewer.StudyTopic;

public class OOPBasics implements StudyTopic {

    @Override
    public String getConcepts() {
        return """
                ========== OOP BASICS CONCEPTS ==========

                1. ENCAPSULATION
                   - Hide internal details, expose only what's needed
                   - Private fields + public getter/setter methods
                   - Control access to object data
                   - Example: BankAccount with private balance, public withdraw()

                2. INHERITANCE
                   - "extends" keyword - child inherits from parent
                   - Reuse code from parent class
                   - Child class inherits methods and fields
                   - Example: Car extends Vehicle

                3. POLYMORPHISM
                   - "Many forms" - same method, different implementations
                   - Method Overriding: Child overrides parent method
                   - Method Overloading: Same method name, different parameters
                   - Example: draw() works for Circle, Rectangle, Triangle

                4. ABSTRACTION
                   - Hide complexity, show only essentials
                   - Use abstract classes and interfaces
                   - Abstract methods must be implemented by subclasses
                   - Example: Animal is abstract, Dog/Cat are concrete

                5. INTERFACES
                   - Contract defining what methods must exist
                   - Class implements interface (implements keyword)
                   - Supports multiple inheritance concept
                   - Example: Drawable interface with draw() method

                6. CONSTRUCTORS
                   - Method called when object is created
                   - Used to initialize object state
                   - Can be overloaded (multiple constructors)
                """;
    }

    @Override
    public String getSampleCode() {
        return """
                ========== SAMPLE CODE ==========

                // 1. BASIC CLASS WITH ENCAPSULATION
                public class Person {
                    private String name;  // Private - hidden
                    private int age;

                    // Constructor
                    public Person(String name, int age) {
                        this.name = name;
                        this.age = age;
                    }

                    // Getter
                    public String getName() {
                        return name;
                    }

                    // Setter
                    public void setAge(int age) {
                        if (age > 0) this.age = age;
                    }
                }

                // 2. INHERITANCE (EXTENDS)
                public class Employee extends Person {
                    private double salary;

                    public Employee(String name, int age, double salary) {
                        super(name, age);  // Call parent constructor
                        this.salary = salary;
                    }

                    public double getSalary() {
                        return salary;
                    }
                }

                // 3. METHOD OVERRIDING (POLYMORPHISM)
                public class Animal {
                    public void makeSound() {
                        System.out.println("Generic sound");
                    }
                }

                public class Dog extends Animal {
                    @Override
                    public void makeSound() {
                        System.out.println("Woof! Woof!");  // Overridden
                    }
                }

                public class Cat extends Animal {
                    @Override
                    public void makeSound() {
                        System.out.println("Meow!");  // Overridden
                    }
                }

                // 4. METHOD OVERLOADING (POLYMORPHISM)
                public class Calculator {
                    public int add(int a, int b) {
                        return a + b;
                    }

                    public double add(double a, double b) {  // Overloaded
                        return a + b;
                    }

                    public int add(int a, int b, int c) {  // Overloaded
                        return a + b + c;
                    }
                }

                // 5. ABSTRACT CLASS
                public abstract class Shape {
                    public abstract double calculateArea();  // Must override

                    public void describe() {
                        System.out.println("I am a shape");
                    }
                }

                public class Circle extends Shape {
                    private double radius;

                    public Circle(double radius) {
                        this.radius = radius;
                    }

                    @Override
                    public double calculateArea() {
                        return Math.PI * radius * radius;
                    }
                }

                // 6. INTERFACE
                public interface Drawable {
                    void draw();
                    void erase();
                }

                public class Rectangle implements Drawable {
                    @Override
                    public void draw() {
                        System.out.println("Drawing rectangle");
                    }

                    @Override
                    public void erase() {
                        System.out.println("Erasing rectangle");
                    }
                }

                // 7. USAGE EXAMPLE
                public static void main(String[] args) {
                    // Polymorphism example
                    Animal dog = new Dog();
                    Animal cat = new Cat();

                    dog.makeSound();  // Output: Woof! Woof!
                    cat.makeSound();  // Output: Meow!

                    // Encapsulation example
                    Person person = new Person("John", 30);
                    System.out.println(person.getName());  // Output: John

                    // Method overloading
                    Calculator calc = new Calculator();
                    System.out.println(calc.add(5, 10));      // Output: 15
                    System.out.println(calc.add(5.5, 10.5));  // Output: 16.0
                }
                """;
    }

    @Override
    public String getChallenge() {
        return """
                ========== CHALLENGE ==========

                Challenge 1: Bank Account (Encapsulation)
                Create a BankAccount class with:
                - Private balance
                - deposit(amount) method
                - withdraw(amount) method (check balance)
                - getBalance() method
                - Constructor

                Challenge 2: Vehicle Hierarchy (Inheritance)
                Create Vehicle parent class
                Create Car and Motorcycle child classes
                Override getDescription() in each

                Challenge 3: Shape Classes (Polymorphism)
                Create abstract Shape class with abstract calculateArea()
                Create Circle, Rectangle, Triangle that extend Shape
                Create array of shapes and calculate total area

                Challenge 4: Calculator Overloading
                Create Calculator class with overloaded add() methods:
                - add(int, int)
                - add(double, double)
                - add(int, int, int)
                - add(double, double, double)

                Challenge 5: Employee Management (All Concepts)
                Create Employee class extending Person
                Add private fields: employeeID, department, salary
                Add methods: getSalary(), promote(), getInfo()
                Create multiple employees and display info

                Challenge 6: Interface Implementation
                Create Drawable interface with draw() and erase()
                Create Circle and Rectangle that implement Drawable
                Test polymorphism with array of Drawable objects

                Challenge 7: Animal Sounds (Hard)
                Create Animal abstract class
                Create Dog, Cat, Bird, Cow classes
                Store them in array using polymorphism
                Call makeSound() on each without knowing exact type

                Challenge 8: Library System (Harder)
                Create Book class with: title, author, pages
                Create Member class
                Create libraryManagement system with interfaces

                DIFFICULTY: Easy to Advanced
                ESTIMATED TIME: 120 minutes
                """;
    }

    @Override
    public void runSampleCode() {
        System.out.println("\nRunning sample code for OOP Basics...\n");

        // 1. Encapsulation Example
        System.out.println("=== ENCAPSULATION ===");
        Person person = new Person("Alice", 25);
        System.out.println("Name: " + person.getName());
        System.out.println("Age: " + person.getAge());

        // 2. Inheritance Example
        System.out.println("\n=== INHERITANCE ===");
        Employee emp = new Employee("Bob", 30, 50000);
        System.out.println("Employee Name: " + emp.getName());
        System.out.println("Employee Salary: $" + emp.getSalary());

        // 3. Polymorphism - Method Overriding
        System.out.println("\n=== POLYMORPHISM (Method Overriding) ===");
        Animal[] animals = { new Dog(), new Cat() };
        for (Animal animal : animals) {
            animal.makeSound();
        }

        // 4. Method Overloading
        System.out.println("\n=== METHOD OVERLOADING ===");
        Calculator calc = new Calculator();
        System.out.println("add(5, 10) = " + calc.add(5, 10));
        System.out.println("add(5.5, 10.5) = " + calc.add(5.5, 10.5));
        System.out.println("add(5, 10, 15) = " + calc.add(5, 10, 15));

        // 5. Abstract Class & Polymorphism
        System.out.println("\n=== POLYMORPHISM WITH SHAPES ===");
        Shape[] shapes = {
                new Circle(5),
                new Rectangle(4, 6),
                new Triangle(3, 4)
        };
        double totalArea = 0;
        for (Shape shape : shapes) {
            double area = shape.calculateArea();
            totalArea += area;
            System.out.printf("Area: %.2f\n", area);
        }
        System.out.printf("Total Area: %.2f\n", totalArea);
    }

    // Helper Classes for demonstration

    static class Person {
        private String name;
        private int age;

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            if (age > 0)
                this.age = age;
        }
    }

    static class Employee extends Person {
        private double salary;

        public Employee(String name, int age, double salary) {
            super(name, age);
            this.salary = salary;
        }

        public double getSalary() {
            return salary;
        }
    }

    static abstract class Animal {
        public abstract void makeSound();
    }

    static class Dog extends Animal {
        @Override
        public void makeSound() {
            System.out.println("Woof! Woof!");
        }
    }

    static class Cat extends Animal {
        @Override
        public void makeSound() {
            System.out.println("Meow!");
        }
    }

    static class Calculator {
        public int add(int a, int b) {
            return a + b;
        }

        public double add(double a, double b) {
            return a + b;
        }

        public int add(int a, int b, int c) {
            return a + b + c;
        }
    }

    static abstract class Shape {
        public abstract double calculateArea();
    }

    static class Circle extends Shape {
        private double radius;

        public Circle(double radius) {
            this.radius = radius;
        }

        @Override
        public double calculateArea() {
            return Math.PI * radius * radius;
        }
    }

    static class Rectangle extends Shape {
        private double length;
        private double width;

        public Rectangle(double length, double width) {
            this.length = length;
            this.width = width;
        }

        @Override
        public double calculateArea() {
            return length * width;
        }
    }

    static class Triangle extends Shape {
        private double base;
        private double height;

        public Triangle(double base, double height) {
            this.base = base;
            this.height = height;
        }

        @Override
        public double calculateArea() {
            return (base * height) / 2;
        }
    }
}
