#include <iostream>
#include <vector>
#include <string>
#include <limits>
#include <algorithm>

// --- Book Class Definition ---
// This class represents a single book in the library.
class Book {
private:
    std::string title;
    std::string author;
    int publicationYear;
    bool isAvailable;
    std::string checkedOutByPatronID; // To store the ID of the patron who checked out the book

public:
    // Constructor to initialize a Book object
    Book(const std::string& title, const std::string& author, int year)
        : title(title), author(author), publicationYear(year), isAvailable(true), checkedOutByPatronID("") {}

    // Getter methods
    std::string getTitle() const { return title; }
    std::string getAuthor() const { return author; }
    int getPublicationYear() const { return publicationYear; }
    bool getIsAvailable() const { return isAvailable; }
    std::string getCheckedOutByPatronID() const { return checkedOutByPatronID; }

    // Setter methods for availability and patron ID
    void setAvailability(bool status) { isAvailable = status; }
    void setCheckedOutByPatronID(const std::string& patronID) { checkedOutByPatronID = patronID; }

    // Method to display book information
    void display() const {
        std::cout << "  Title: " << title << "\n"
                  << "  Author: " << author << "\n"
                  << "  Year: " << publicationYear << "\n"
                  << "  Status: " << (isAvailable ? "Available" : "Checked Out") << "\n";
        if (!isAvailable) {
            std::cout << "  Checked out by Patron ID: " << checkedOutByPatronID << "\n";
        }
    }
};

// --- Patron Class Definition ---
// This class represents a library member.
class Patron {
private:
    std::string name;
    std::string patronID;
    std::vector<std::string> checkedOutBooks; // A list of book titles checked out by this patron

public:
    // Constructor
    Patron(const std::string& name, const std::string& id)
        : name(name), patronID(id) {}

    // Getter methods
    std::string getName() const { return name; }
    std::string getPatronID() const { return patronID; }
    std::vector<std::string> getCheckedOutBooks() const { return checkedOutBooks; }

    // Method to check out a book
    void checkOutBook(const std::string& bookTitle) {
        checkedOutBooks.push_back(bookTitle);
    }

    // Method to return a book
    void returnBook(const std::string& bookTitle) {
        // Find and remove the book from the patron's list
        auto it = std::find(checkedOutBooks.begin(), checkedOutBooks.end(), bookTitle);
        if (it != checkedOutBooks.end()) {
            checkedOutBooks.erase(it);
        }
    }
};

// --- Utility Functions ---
// Function to clear the input buffer
void clearInputBuffer() {
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

// Function to get a valid integer input with error handling
int getIntegerInput(const std::string& prompt) {
    int input;
    while (true) {
        std::cout << prompt;
        std::cin >> input;

        if (std::cin.fail()) {
            std::cout << "Invalid input. Please enter a number." << std::endl;
            std::cin.clear();
            clearInputBuffer();
        } else {
            clearInputBuffer();
            return input;
        }
    }
}

// Function to get a valid string input (including spaces)
std::string getStringInput(const std::string& prompt) {
    std::string input;
    std::cout << prompt;
    std::getline(std::cin, input);
    return input;
}

// --- Library Class Definition ---
// This class manages the collection of books and patrons.
class Library {
private:
    std::vector<Book> books;
    std::vector<Patron> patrons;

public:
    // Add a new book to the library
    void addBook(const Book& newBook) {
        books.push_back(newBook);
        std::cout << "Book added successfully: " << newBook.getTitle() << std::endl;
    }

    // Add a new patron to the library
    void addPatron(const Patron& newPatron) {
        patrons.push_back(newPatron);
        std::cout << "Patron added successfully: " << newPatron.getName() << std::endl;
    }

    // Find a book by its title
    Book* findBookByTitle(const std::string& title) {
        for (auto& book : books) {
            if (book.getTitle() == title) {
                return &book;
            }
        }
        return nullptr;
    }

    // Find a book by its author
    void findBookByAuthor(const std::string& author) const {
        std::cout << "Searching for books by: " << author << "\n";
        bool found = false;
        for (const auto& book : books) {
            if (book.getAuthor() == author) {
                book.display();
                std::cout << "------------------------\n";
                found = true;
            }
        }
        if (!found) {
            std::cout << "No books found by that author." << std::endl;
        }
    }

    // Find a patron by their ID
    Patron* findPatronByID(const std::string& patronID) {
        for (auto& patron : patrons) {
            if (patron.getPatronID() == patronID) {
                return &patron;
            }
        }
        return nullptr;
    }

    // List all books
    void listAllBooks() const {
        if (books.empty()) {
            std::cout << "The library is empty." << std::endl;
            return;
        }
        std::cout << "\n--- Current Library Collection ---\n";
        for (const auto& book : books) {
            book.display();
            std::cout << "------------------------\n";
        }
    }

    // List all patrons
    void listAllPatrons() const {
        if (patrons.empty()) {
            std::cout << "No patrons registered yet." << std::endl;
            return;
        }
        std::cout << "\n--- Registered Patrons ---\n";
        for (const auto& patron : patrons) {
            std::cout << "Patron Name: " << patron.getName() << " | ID: " << patron.getPatronID() << std::endl;
        }
    }

    // List books checked out by a specific patron
    void listPatronBooks(const std::string& patronID) {
        Patron* patron = findPatronByID(patronID);
        if (!patron) {
            std::cout << "Error: Patron not found." << std::endl;
            return;
        }
        std::cout << "\n--- Books checked out by " << patron->getName() << " ---\n";
        std::vector<std::string> checkedOutBooks = patron->getCheckedOutBooks();
        if (checkedOutBooks.empty()) {
            std::cout << "This patron has no books checked out." << std::endl;
        } else {
            for (const auto& title : checkedOutBooks) {
                std::cout << "- " << title << std::endl;
            }
        }
    }

    // Main checkout logic
    void checkOutBookForPatron() {
        std::string patronID = getStringInput("Enter patron ID: ");
        Patron* patron = findPatronByID(patronID);
        if (!patron) {
            std::cout << "Patron not found. Please add the patron first." << std::endl;
            return;
        }

        std::string bookTitle = getStringInput("Enter the title of the book to check out: ");
        Book* book = findBookByTitle(bookTitle);
        if (!book) {
            std::cout << "Book not found." << std::endl;
            return;
        }

        if (book->getIsAvailable()) {
            book->setAvailability(false);
            book->setCheckedOutByPatronID(patronID);
            patron->checkOutBook(bookTitle);
            std::cout << "Successfully checked out '" << bookTitle << "' to " << patron->getName() << "." << std::endl;
        } else {
            std::cout << "Sorry, '" << bookTitle << "' is already checked out." << std::endl;
        }
    }

    // Main return logic
    void returnBookFromPatron() {
        std::string patronID = getStringInput("Enter patron ID: ");
        Patron* patron = findPatronByID(patronID);
        if (!patron) {
            std::cout << "Patron not found." << std::endl;
            return;
        }

        std::string bookTitle = getStringInput("Enter the title of the book to return: ");
        Book* book = findBookByTitle(bookTitle);
        if (!book) {
            std::cout << "Book not found." << std::endl;
            return;
        }

        if (!book->getIsAvailable() && book->getCheckedOutByPatronID() == patronID) {
            book->setAvailability(true);
            book->setCheckedOutByPatronID("");
            patron->returnBook(bookTitle);
            std::cout << "Successfully returned '" << bookTitle << "' from " << patron->getName() << "." << std::endl;
        } else {
            std::cout << "This book was not checked out to this patron." << std::endl;
        }
    }
};

// --- Main Program Loop ---
int main() {
    Library myLibrary;

    // Add some initial books and patrons to the system
    myLibrary.addBook(Book("The Hobbit", "J.R.R. Tolkien", 1937));
    myLibrary.addBook(Book("Dune", "Frank Herbert", 1965));
    myLibrary.addBook(Book("1984", "George Orwell", 1949));
    myLibrary.addBook(Book("The Lord of the Rings", "J.R.R. Tolkien", 1954));

    myLibrary.addPatron(Patron("Alice", "P101"));
    myLibrary.addPatron(Patron("Bob", "P102"));
    myLibrary.addPatron(Patron("Charlie", "P103"));

    int choice;
    do {
        // Display the main menu
        std::cout << "\n--- Library Management System Menu ---" << std::endl;
        std::cout << "1. List all books" << std::endl;
        std::cout << "2. Search for books by author" << std::endl;
        std::cout << "3. List all patrons" << std::endl;
        std::cout << "4. Check out a book" << std::endl;
        std::cout << "5. Return a book" << std::endl;
        std::cout << "6. View books checked out by a patron" << std::endl;
        std::cout << "7. Add a new book" << std::endl;
        std::cout << "8. Add a new patron" << std::endl;
        std::cout << "9. Exit" << std::endl;
        choice = getIntegerInput("Enter your choice: ");

        switch (choice) {
            case 1:
                myLibrary.listAllBooks();
                break;
            case 2: {
                std::string author = getStringInput("Enter the author's name: ");
                myLibrary.findBookByAuthor(author);
                break;
            }
            case 3:
                myLibrary.listAllPatrons();
                break;
            case 4:
                myLibrary.checkOutBookForPatron();
                break;
            case 5:
                myLibrary.returnBookFromPatron();
                break;
            case 6: {
                std::string patronID = getStringInput("Enter patron ID: ");
                myLibrary.listPatronBooks(patronID);
                break;
            }
            case 7: {
                std::string title = getStringInput("Enter book title: ");
                std::string author = getStringInput("Enter author's name: ");
                int year = getIntegerInput("Enter publication year: ");
                myLibrary.addBook(Book(title, author, year));
                break;
            }
            case 8: {
                std::string name = getStringInput("Enter patron name: ");
                std::string id = getStringInput("Enter patron ID: ");
                myLibrary.addPatron(Patron(name, id));
                break;
            }
            case 9:
                std::cout << "Exiting program. Goodbye!" << std::endl;
                break;
            default:
                std::cout << "Invalid choice. Please try again." << std::endl;
                break;
        }
    } while (choice != 9);

    return 0;
}
