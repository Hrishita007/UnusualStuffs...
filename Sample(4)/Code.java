import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.InputMismatchException;

// --- Book Class ---
// Represents a single book with its properties and state.
class Book {
    private String title;
    private String author;
    private int publicationYear;
    private boolean isAvailable;
    private String checkedOutByPatronId;

    public Book(String title, String author, int year) {
        this.title = title;
        this.author = author;
        this.publicationYear = year;
        this.isAvailable = true;
        this.checkedOutByPatronId = null;
    }

    // Getter methods
    public String getTitle() {
        return this.title;
    }

    public String getAuthor() {
        return this.author;
    }

    public int getPublicationYear() {
        return this.publicationYear;
    }

    public boolean isAvailable() {
        return this.isAvailable;
    }

    public String getCheckedOutByPatronId() {
        return this.checkedOutByPatronId;
    }

    // Setter methods
    public void setAvailability(boolean status) {
        this.isAvailable = status;
    }

    public void setCheckedOutByPatronId(String patronId) {
        this.checkedOutByPatronId = patronId;
    }

    // Method to display a book's information
    public void displayBookInfo() {
        System.out.println("  Title: " + this.title);
        System.out.println("  Author: " + this.author);
        System.out.println("  Year: " + this.publicationYear);
        System.out.println("  Status: " + (this.isAvailable ? "Available" : "Checked Out"));
        if (!this.isAvailable) {
            System.out.println("  Checked out by Patron ID: " + this.checkedOutByPatronId);
        }
    }
}

// --- Patron Class ---
// Represents a library member with their details and checked-out books.
class Patron {
    private String name;
    private String patronId;
    private List<String> checkedOutBooks;

    public Patron(String name, String id) {
        this.name = name;
        this.patronId = id;
        this.checkedOutBooks = new ArrayList<>();
    }

    // Getter methods
    public String getName() {
        return this.name;
    }

    public String getPatronId() {
        return this.patronId;
    }

    public List<String> getCheckedOutBooks() {
        return this.checkedOutBooks;
    }

    // Method to add a book to the patron's checked-out list
    public void checkOutBook(String bookTitle) {
        this.checkedOutBooks.add(bookTitle);
    }

    // Method to remove a book from the patron's checked-out list
    public void returnBook(String bookTitle) {
        this.checkedOutBooks.remove(bookTitle);
    }
}

// --- Library Class ---
// The core class that manages all books and patrons.
class Library {
    private List<Book> books;
    private List<Patron> patrons;

    public Library() {
        this.books = new ArrayList<>();
        this.patrons = new ArrayList<>();
    }

    // Method to add a book to the library
    public void addBook(Book newBook) {
        this.books.add(newBook);
        System.out.println("Book added successfully: " + newBook.getTitle());
    }

    // Method to add a patron to the system
    public void addPatron(Patron newPatron) {
        this.patrons.add(newPatron);
        System.out.println("Patron added successfully: " + newPatron.getName());
    }

    // Find a book by its title
    public Book findBookByTitle(String title) {
        for (Book book : this.books) {
            if (book.getTitle().equalsIgnoreCase(title)) {
                return book;
            }
        }
        return null;
    }

    // Find a patron by their ID
    public Patron findPatronById(String patronId) {
        for (Patron patron : this.patrons) {
            if (patron.getPatronId().equalsIgnoreCase(patronId)) {
                return patron;
            }
        }
        return null;
    }

    // List all books in the library
    public void listAllBooks() {
        if (this.books.isEmpty()) {
            System.out.println("The library has no books.");
            return;
        }
        System.out.println("\n--- Current Library Collection ---");
        for (Book book : this.books) {
            book.displayBookInfo();
            System.out.println("------------------------------------");
        }
    }

    // List all patrons in the system
    public void listAllPatrons() {
        if (this.patrons.isEmpty()) {
            System.out.println("No patrons registered yet.");
            return;
        }
        System.out.println("\n--- Registered Patrons ---");
        for (Patron patron : this.patrons) {
            System.out.println("Patron Name: " + patron.getName() + " | ID: " + patron.getPatronId());
        }
    }

    // Search for a book by author
    public void findBookByAuthor(String author) {
        System.out.println("Searching for books by: " + author);
        boolean found = false;
        for (Book book : this.books) {
            if (book.getAuthor().equalsIgnoreCase(author)) {
                book.displayBookInfo();
                System.out.println("------------------------------------");
                found = true;
            }
        }
        if (!found) {
            System.out.println("No books found by that author.");
        }
    }

    // Check out a book to a patron
    public void checkOutBookForPatron(Scanner scanner) {
        System.out.print("Enter patron ID: ");
        String patronId = scanner.nextLine();
        Patron patron = findPatronById(patronId);

        if (patron == null) {
            System.out.println("Patron not found. Please add the patron first.");
            return;
        }

        System.out.print("Enter the title of the book to check out: ");
        String bookTitle = scanner.nextLine();
        Book book = findBookByTitle(bookTitle);

        if (book == null) {
            System.out.println("Book not found.");
            return;
        }

        if (book.isAvailable()) {
            book.setAvailability(false);
            book.setCheckedOutByPatronId(patronId);
            patron.checkOutBook(bookTitle);
            System.out.println("Successfully checked out '" + bookTitle + "' to " + patron.getName() + ".");
        } else {
            System.out.println("Sorry, '" + bookTitle + "' is already checked out.");
        }
    }

    // Return a book from a patron
    public void returnBookFromPatron(Scanner scanner) {
        System.out.print("Enter patron ID: ");
        String patronId = scanner.nextLine();
        Patron patron = findPatronById(patronId);

        if (patron == null) {
            System.out.println("Patron not found.");
            return;
        }

        System.out.print("Enter the title of the book to return: ");
        String bookTitle = scanner.nextLine();
        Book book = findBookByTitle(bookTitle);

        if (book == null) {
            System.out.println("Book not found.");
            return;
        }

        if (!book.isAvailable() && book.getCheckedOutByPatronId().equals(patronId)) {
            book.setAvailability(true);
            book.setCheckedOutByPatronId(null);
            patron.returnBook(bookTitle);
            System.out.println("Successfully returned '" + bookTitle + "' from " + patron.getName() + ".");
        } else {
            System.out.println("This book was not checked out to this patron.");
        }
    }

    // View books checked out by a specific patron
    public void listPatronBooks(Scanner scanner) {
        System.out.print("Enter patron ID: ");
        String patronId = scanner.nextLine();
        Patron patron = findPatronById(patronId);

        if (patron == null) {
            System.out.println("Error: Patron not found.");
            return;
        }

        System.out.println("\n--- Books checked out by " + patron.getName() + " ---");
        List<String> checkedOutBooks = patron.getCheckedOutBooks();
        if (checkedOutBooks.isEmpty()) {
            System.out.println("This patron has no books checked out.");
        } else {
            for (String title : checkedOutBooks) {
                System.out.println("- " + title);
            }
        }
    }
}

// --- Main Class and Program Entry Point ---
public class LibrarySystem {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Library myLibrary = new Library();

        // Add some initial books and patrons
        myLibrary.addBook(new Book("The Lord of the Rings", "J.R.R. Tolkien", 1954));
        myLibrary.addBook(new Book("1984", "George Orwell", 1949));
        myLibrary.addBook(new Book("Dune", "Frank Herbert", 1965));

        myLibrary.addPatron(new Patron("Alice", "P101"));
        myLibrary.addPatron(new Patron("Bob", "P102"));

        int choice;
        do {
            // Display menu
            System.out.println("\n--- Library Management System Menu ---");
            System.out.println("1. List all books");
            System.out.println("2. Search for books by author");
            System.out.println("3. List all patrons");
            System.out.println("4. Check out a book");
            System.out.println("5. Return a book");
            System.out.println("6. View books checked out by a patron");
            System.out.println("7. Add a new book");
            System.out.println("8. Add a new patron");
            System.out.println("9. Exit");

            try {
                System.out.print("Enter your choice: ");
                choice = scanner.nextInt();
                scanner.nextLine(); // Consume the newline left-over

                switch (choice) {
                    case 1:
                        myLibrary.listAllBooks();
                        break;
                    case 2:
                        System.out.print("Enter the author's name: ");
                        String author = scanner.nextLine();
                        myLibrary.findBookByAuthor(author);
                        break;
                    case 3:
                        myLibrary.listAllPatrons();
                        break;
                    case 4:
                        myLibrary.checkOutBookForPatron(scanner);
                        break;
                    case 5:
                        myLibrary.returnBookFromPatron(scanner);
                        break;
                    case 6:
                        myLibrary.listPatronBooks(scanner);
                        break;
                    case 7:
                        System.out.print("Enter book title: ");
                        String title = scanner.nextLine();
                        System.out.print("Enter author's name: ");
                        String bookAuthor = scanner.nextLine();
                        System.out.print("Enter publication year: ");
                        int year = scanner.nextInt();
                        scanner.nextLine();
                        myLibrary.addBook(new Book(title, bookAuthor, year));
                        break;
                    case 8:
                        System.out.print("Enter patron name: ");
                        String patronName = scanner.nextLine();
                        System.out.print("Enter patron ID: ");
                        String patronId = scanner.nextLine();
                        myLibrary.addPatron(new Patron(patronName, patronId));
                        break;
                    case 9:
                        System.out.println("Exiting program. Goodbye!");
                        break;
                    default:
                        System.out.println("Invalid choice. Please try again.");
                        break;
                }
            } catch (InputMismatchException e) {
                System.out.println("Invalid input. Please enter a number from the menu.");
                scanner.nextLine(); // Clear the invalid input from the scanner
                choice = 0; // Set choice to 0 to continue the loop
            }
        } while (choice != 9);
        
        scanner.close(); // Close the scanner to prevent resource leak
    }
}
