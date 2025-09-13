
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#define MAX_TITLE_LENGTH 100
#define MAX_AUTHOR_LENGTH 50
#define MAX_NAME_LENGTH 50
#define MAX_ID_LENGTH 20

typedef struct {
    char title[MAX_TITLE_LENGTH];
    char author[MAX_AUTHOR_LENGTH];
    int publicationYear;
    int isAvailable; 
    char checkedOutByPatronID[MAX_ID_LENGTH];
} Book;

typedef struct {
    char** titles; 
    int count;
    int capacity;
} StringList;

typedef struct {
    char name[MAX_NAME_LENGTH];
    char patronID[MAX_ID_LENGTH];
    StringList checkedOutBooks;
} Patron;

typedef struct {
    Book* books; 
    int count;
    int capacity;
} BookList;

typedef struct {
    Patron* patrons; 
    int count;
    int capacity;
} PatronList;

typedef struct {
    BookList bookList;
    PatronList patronList;
} Library;

void clearInputBuffer();
int getIntegerInput();
void getStringInput(const char* prompt, char* buffer, int bufferSize);
int customStrICmp(const char* s1, const char* s2);

void initializeBookList(BookList* list);
void addBookToList(BookList* list, const Book* book);
void initializePatronList(PatronList* list);
void addPatronToList(PatronList* list, const Patron* patron);
void initializeStringList(StringList* list);
void addToStringList(StringList* list, const char* str);
void removeFromStringList(StringList* list, const char* str);

// Library system functions
void initializeLibrary(Library* lib);
void displayBookInfo(const Book* book);
void displayPatronInfo(const Patron* patron);
Book* findBookByTitle(Library* lib, const char* title);
Patron* findPatronByID(Library* lib, const char* patronID);
void listAllBooks(const Library* lib);
void listAllPatrons(const Library* lib);
void findBookByAuthor(const Library* lib, const char* author);
void checkOutBookForPatron(Library* lib);
void returnBookFromPatron(Library* lib);
void listPatronBooks(const Library* lib);
void addBook(Library* lib);
void addPatron(Library* lib);


// --- Main Function ---
int main() {
    Library myLibrary;
    initializeLibrary(&myLibrary);

    // Initial data setup
    Book book1 = {"The Lord of the Rings", "J.R.R. Tolkien", 1954, 1, ""};
    Book book2 = {"1984", "George Orwell", 1949, 1, ""};
    Book book3 = {"Dune", "Frank Herbert", 1965, 1, ""};
    addBookToList(&myLibrary.bookList, &book1);
    addBookToList(&myLibrary.bookList, &book2);
    addBookToList(&myLibrary.bookList, &book3);

    Patron patron1 = {"Alice", "P101", {NULL, 0, 0}};
    Patron patron2 = {"Bob", "P102", {NULL, 0, 0}};
    addPatronToList(&myLibrary.patronList, &patron1);
    addPatronToList(&myLibrary.patronList, &patron2);

    int choice;
    do {
        // Display menu
        printf("\n--- Library Management System Menu ---\n");
        printf("1. List all books\n");
        printf("2. Search for books by author\n");
        printf("3. List all patrons\n");
        printf("4. Check out a book\n");
        printf("5. Return a book\n");
        printf("6. View books checked out by a patron\n");
        printf("7. Add a new book\n");
        printf("8. Add a new patron\n");
        printf("9. Exit\n");
        
        printf("Enter your choice: ");
        choice = getIntegerInput();
        clearInputBuffer();

        switch (choice) {
            case 1:
                listAllBooks(&myLibrary);
                break;
            case 2:
                findBookByAuthor(&myLibrary, NULL); // NULL indicates we'll get input
                break;
            case 3:
                listAllPatrons(&myLibrary);
                break;
            case 4:
                checkOutBookForPatron(&myLibrary);
                break;
            case 5:
                returnBookFromPatron(&myLibrary);
                break;
            case 6:
                listPatronBooks(&myLibrary);
                break;
            case 7:
                addBook(&myLibrary);
                break;
            case 8:
                addPatron(&myLibrary);
                break;
            case 9:
                printf("Exiting program. Goodbye!\n");
                break;
            default:
                printf("Invalid choice. Please try again.\n");
                break;
        }
    } while (choice != 9);

    // Free all dynamically allocated memory to prevent memory leaks
    for (int i = 0; i < myLibrary.bookList.count; ++i) {
        // No need to free Book structs, as they are a single contiguous block
    }
    for (int i = 0; i < myLibrary.patronList.count; ++i) {
        // Free the dynamically allocated strings for each patron
        for (int j = 0; j < myLibrary.patronList.patrons[i].checkedOutBooks.count; ++j) {
            free(myLibrary.patronList.patrons[i].checkedOutBooks.titles[j]);
        }
        free(myLibrary.patronList.patrons[i].checkedOutBooks.titles);
    }
    free(myLibrary.bookList.books);
    free(myLibrary.patronList.patrons);

    return 0;
}


// --- Function Definitions ---

// --- Utility Functions ---

// Clears the standard input buffer.
void clearInputBuffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

// Safely gets integer input from the user.
int getIntegerInput() {
    int input;
    while (scanf("%d", &input) != 1) {
        printf("Invalid input. Please enter a number.\n");
        clearInputBuffer();
        printf("Enter your choice: ");
    }
    return input;
}

// Safely gets string input from the user.
void getStringInput(const char* prompt, char* buffer, int bufferSize) {
    printf("%s", prompt);
    fgets(buffer, bufferSize, stdin);
    // Remove trailing newline character if it exists
    buffer[strcspn(buffer, "\n")] = 0;
}

// Custom case-insensitive string comparison function.
int customStrICmp(const char* s1, const char* s2) {
    for (; *s1 && *s2; ++s1, ++s2) {
        if (tolower((unsigned char)*s1) != tolower((unsigned char)*s2)) {
            return tolower((unsigned char)*s1) - tolower((unsigned char)*s2);
        }
    }
    return tolower((unsigned char)*s1) - tolower((unsigned char)*s2);
}


// --- Dynamic List Management ---

void initializeBookList(BookList* list) {
    list->count = 0;
    list->capacity = 10;
    list->books = (Book*)malloc(list->capacity * sizeof(Book));
    if (list->books == NULL) {
        printf("Error: Memory allocation failed for book list.\n");
        exit(1);
    }
}

void addBookToList(BookList* list, const Book* book) {
    if (list->count >= list->capacity) {
        list->capacity *= 2;
        list->books = (Book*)realloc(list->books, list->capacity * sizeof(Book));
        if (list->books == NULL) {
            printf("Error: Memory reallocation failed for book list.\n");
            exit(1);
        }
    }
    list->books[list->count] = *book;
    list->count++;
    printf("Book added successfully: %s\n", book->title);
}

void initializePatronList(PatronList* list) {
    list->count = 0;
    list->capacity = 10;
    list->patrons = (Patron*)malloc(list->capacity * sizeof(Patron));
    if (list->patrons == NULL) {
        printf("Error: Memory allocation failed for patron list.\n");
        exit(1);
    }
}

void addPatronToList(PatronList* list, const Patron* patron) {
    if (list->count >= list->capacity) {
        list->capacity *= 2;
        list->patrons = (Patron*)realloc(list->patrons, list->capacity * sizeof(Patron));
        if (list->patrons == NULL) {
            printf("Error: Memory reallocation failed for patron list.\n");
            exit(1);
        }
    }
    list->patrons[list->count] = *patron;
    initializeStringList(&list->patrons[list->count].checkedOutBooks);
    list->count++;
    printf("Patron added successfully: %s\n", patron->name);
}

void initializeStringList(StringList* list) {
    list->count = 0;
    list->capacity = 5; // A reasonable starting capacity
    list->titles = (char**)malloc(list->capacity * sizeof(char*));
    if (list->titles == NULL) {
        printf("Error: Memory allocation failed for string list.\n");
        exit(1);
    }
}

void addToStringList(StringList* list, const char* str) {
    if (list->count >= list->capacity) {
        list->capacity *= 2;
        list->titles = (char**)realloc(list->titles, list->capacity * sizeof(char*));
        if (list->titles == NULL) {
            printf("Error: Memory reallocation failed for string list.\n");
            exit(1);
        }
    }
    list->titles[list->count] = (char*)malloc(strlen(str) + 1);
    if (list->titles[list->count] == NULL) {
        printf("Error: Memory allocation failed for string in list.\n");
        exit(1);
    }
    strcpy(list->titles[list->count], str);
    list->count++;
}

void removeFromStringList(StringList* list, const char* str) {
    for (int i = 0; i < list->count; ++i) {
        if (strcmp(list->titles[i], str) == 0) {
            free(list->titles[i]);
            for (int j = i; j < list->count - 1; ++j) {
                list->titles[j] = list->titles[j + 1];
            }
            list->count--;
            break;
        }
    }
}


// --- Library System Logic ---

void initializeLibrary(Library* lib) {
    initializeBookList(&lib->bookList);
    initializePatronList(&lib->patronList);
}

void displayBookInfo(const Book* book) {
    printf("  Title: %s\n", book->title);
    printf("  Author: %s\n", book->author);
    printf("  Year: %d\n", book->publicationYear);
    printf("  Status: %s\n", book->isAvailable ? "Available" : "Checked Out");
    if (!book->isAvailable) {
        printf("  Checked out by Patron ID: %s\n", book->checkedOutByPatronID);
    }
}

void displayPatronInfo(const Patron* patron) {
    printf("Patron Name: %s | ID: %s\n", patron->name, patron->patronID);
}

Book* findBookByTitle(Library* lib, const char* title) {
    for (int i = 0; i < lib->bookList.count; ++i) {
        if (customStrICmp(lib->bookList.books[i].title, title) == 0) {
            return &lib->bookList.books[i];
        }
    }
    return NULL;
}

Patron* findPatronByID(Library* lib, const char* patronID) {
    for (int i = 0; i < lib->patronList.count; ++i) {
        if (customStrICmp(lib->patronList.patrons[i].patronID, patronID) == 0) {
            return &lib->patronList.patrons[i];
        }
    }
    return NULL;
}

void listAllBooks(const Library* lib) {
    if (lib->bookList.count == 0) {
        printf("The library has no books.\n");
        return;
    }
    printf("\n--- Current Library Collection ---\n");
    for (int i = 0; i < lib->bookList.count; ++i) {
        displayBookInfo(&lib->bookList.books[i]);
        printf("------------------------------------\n");
    }
}

void listAllPatrons(const Library* lib) {
    if (lib->patronList.count == 0) {
        printf("No patrons registered yet.\n");
        return;
    }
    printf("\n--- Registered Patrons ---\n");
    for (int i = 0; i < lib->patronList.count; ++i) {
        displayPatronInfo(&lib->patronList.patrons[i]);
    }
}

void findBookByAuthor(const Library* lib, const char* author) {
    char authorName[MAX_AUTHOR_LENGTH];
    if (author == NULL) {
        getStringInput("Enter the author's name: ", authorName, MAX_AUTHOR_LENGTH);
        author = authorName;
    }

    printf("Searching for books by: %s\n", author);
    int found = 0;
    for (int i = 0; i < lib->bookList.count; ++i) {
        if (customStrICmp(lib->bookList.books[i].author, author) == 0) {
            displayBookInfo(&lib->bookList.books[i]);
            printf("------------------------------------\n");
            found = 1;
        }
    }
    if (!found) {
        printf("No books found by that author.\n");
    }
}

void checkOutBookForPatron(Library* lib) {
    char patronID[MAX_ID_LENGTH];
    getStringInput("Enter patron ID: ", patronID, MAX_ID_LENGTH);
    Patron* patron = findPatronByID(lib, patronID);

    if (patron == NULL) {
        printf("Patron not found. Please add the patron first.\n");
        return;
    }

    char bookTitle[MAX_TITLE_LENGTH];
    getStringInput("Enter the title of the book to check out: ", bookTitle, MAX_TITLE_LENGTH);
    Book* book = findBookByTitle(lib, bookTitle);

    if (book == NULL) {
        printf("Book not found.\n");
        return;
    }

    if (book->isAvailable) {
        book->isAvailable = 0;
        strcpy(book->checkedOutByPatronID, patronID);
        addToStringList(&patron->checkedOutBooks, bookTitle);
        printf("Successfully checked out '%s' to %s.\n", bookTitle, patron->name);
    } else {
        printf("Sorry, '%s' is already checked out.\n", bookTitle);
    }
}

void returnBookFromPatron(Library* lib) {
    char patronID[MAX_ID_LENGTH];
    getStringInput("Enter patron ID: ", patronID, MAX_ID_LENGTH);
    Patron* patron = findPatronByID(lib, patronID);

    if (patron == NULL) {
        printf("Patron not found.\n");
        return;
    }

    char bookTitle[MAX_TITLE_LENGTH];
    getStringInput("Enter the title of the book to return: ", bookTitle, MAX_TITLE_LENGTH);
    Book* book = findBookByTitle(lib, bookTitle);

    if (book == NULL) {
        printf("Book not found.\n");
        return;
    }

    if (!book->isAvailable && customStrICmp(book->checkedOutByPatronID, patronID) == 0) {
        book->isAvailable = 1;
        book->checkedOutByPatronID[0] = '\0'; // Clear the string
        removeFromStringList(&patron->checkedOutBooks, bookTitle);
        printf("Successfully returned '%s' from %s.\n", bookTitle, patron->name);
    } else {
        printf("This book was not checked out to this patron.\n");
    }
}

void listPatronBooks(const Library* lib) {
    char patronID[MAX_ID_LENGTH];
    getStringInput("Enter patron ID: ", patronID, MAX_ID_LENGTH);
    Patron* patron = findPatronByID(lib, patronID);

    if (patron == NULL) {
        printf("Error: Patron not found.\n");
        return;
    }

    printf("\n--- Books checked out by %s ---\n", patron->name);
    if (patron->checkedOutBooks.count == 0) {
        printf("This patron has no books checked out.\n");
    } else {
        for (int i = 0; i < patron->checkedOutBooks.count; ++i) {
            printf("- %s\n", patron->checkedOutBooks.titles[i]);
        }
    }
}

void addBook(Library* lib) {
    Book newBook;
    getStringInput("Enter book title: ", newBook.title, MAX_TITLE_LENGTH);
    getStringInput("Enter author's name: ", newBook.author, MAX_AUTHOR_LENGTH);
    printf("Enter publication year: ");
    newBook.publicationYear = getIntegerInput();
    newBook.isAvailable = 1;
    newBook.checkedOutByPatronID[0] = '\0';
    addBookToList(&lib->bookList, &newBook);
}

void addPatron(Library* lib) {
    Patron newPatron;
    getStringInput("Enter patron name: ", newPatron.name, MAX_NAME_LENGTH);
    getStringInput("Enter patron ID: ", newPatron.patronID, MAX_ID_LENGTH);
    addPatronToList(&lib->patronList, &newPatron);
}
