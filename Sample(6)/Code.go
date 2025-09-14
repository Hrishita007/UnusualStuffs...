package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Book struct {
	Title             string
	Author            string
	PublicationYear   int
	IsAvailable       bool
	CheckedOutByPatronID string
}

type Patron struct {
	Name            string
	PatronID        string
	CheckedOutBooks []string
}

type Library struct {
	Books   []*Book
	Patrons []*Patron
}

func NewLibrary() *Library {
	return &Library{}
}

func (l *Library) AddBook(title, author string, year int) {
	newBook := &Book{
		Title:           title,
		Author:          author,
		PublicationYear: year,
		IsAvailable:     true,
	}
	l.Books = append(l.Books, newBook)
	fmt.Printf("Book added successfully: %s\n", title)
}

func (l *Library) AddPatron(name, id string) {
	newPatron := &Patron{
		Name:            name,
		PatronID:        id,
		CheckedOutBooks: []string{},
	}
	l.Patrons = append(l.Patrons, newPatron)
	fmt.Printf("Patron added successfully: %s\n", name)
}

// findBookByTitle finds a book by its title (case-insensitive).
func (l *Library) findBookByTitle(title string) *Book {
	for _, book := range l.Books {
		if strings.EqualFold(book.Title, title) {
			return book
		}
	}
	return nil
}

func (l *Library) findPatronByID(id string) *Patron {
	for _, patron := range l.Patrons {
		if strings.EqualFold(patron.PatronID, id) {
			return patron
		}
	}
	return nil
}

func (l *Library) listAllBooks() {
	if len(l.Books) == 0 {
		fmt.Println("The library has no books.")
		return
	}
	fmt.Println("\n--- Current Library Collection ---")
	for _, book := range l.Books {
		fmt.Printf("  Title: %s\n", book.Title)
		fmt.Printf("  Author: %s\n", book.Author)
		fmt.Printf("  Year: %d\n", book.PublicationYear)
		fmt.Printf("  Status: %s\n", getAvailabilityStatus(book.IsAvailable))
		if !book.IsAvailable {
			fmt.Printf("  Checked out by Patron ID: %s\n", book.CheckedOutByPatronID)
		}
		fmt.Println("------------------------------------")
	}
}

func (l *Library) listAllPatrons() {
	if len(l.Patrons) == 0 {
		fmt.Println("No patrons registered yet.")
		return
	}
	fmt.Println("\n--- Registered Patrons ---")
	for _, patron := range l.Patrons {
		fmt.Printf("Patron Name: %s | ID: %s\n", patron.Name, patron.PatronID)
	}
}

// findBookByAuthor searches for books by a given author (case-insensitive).
func (l *Library) findBookByAuthor(author string) {
	fmt.Printf("Searching for books by: %s\n", author)
	found := false
	for _, book := range l.Books {
		if strings.EqualFold(book.Author, author) {
			fmt.Printf("  Title: %s\n", book.Title)
			fmt.Printf("  Author: %s\n", book.Author)
			fmt.Printf("  Year: %d\n", book.PublicationYear)
			fmt.Println("------------------------------------")
			found = true
		}
	}
	if !found {
		fmt.Println("No books found by that author.")
	}
}

// checkOutBookForPatron handles the logic for checking out a book.
func (l *Library) checkOutBookForPatron(scanner *bufio.Scanner) {
	fmt.Print("Enter patron ID: ")
	scanner.Scan()
	patronID := strings.TrimSpace(scanner.Text())
	patron := l.findPatronByID(patronID)

	if patron == nil {
		fmt.Println("Patron not found. Please add the patron first.")
		return
	}

	fmt.Print("Enter the title of the book to check out: ")
	scanner.Scan()
	bookTitle := strings.TrimSpace(scanner.Text())
	book := l.findBookByTitle(bookTitle)

	if book == nil {
		fmt.Println("Book not found.")
		return
	}

	if book.IsAvailable {
		book.IsAvailable = false
		book.CheckedOutByPatronID = patronID
		patron.CheckedOutBooks = append(patron.CheckedOutBooks, bookTitle)
		fmt.Printf("Successfully checked out '%s' to %s.\n", bookTitle, patron.Name)
	} else {
		fmt.Printf("Sorry, '%s' is already checked out.\n", bookTitle)
	}
}

// returnBookFromPatron handles the logic for returning a book.
func (l *Library) returnBookFromPatron(scanner *bufio.Scanner) {
	fmt.Print("Enter patron ID: ")
	scanner.Scan()
	patronID := strings.TrimSpace(scanner.Text())
	patron := l.findPatronByID(patronID)

	if patron == nil {
		fmt.Println("Patron not found.")
		return
	}

	fmt.Print("Enter the title of the book to return: ")
	scanner.Scan()
	bookTitle := strings.TrimSpace(scanner.Text())
	book := l.findBookByTitle(bookTitle)

	if book == nil {
		fmt.Println("Book not found.")
		return
	}

	if !book.IsAvailable && strings.EqualFold(book.CheckedOutByPatronID, patronID) {
		book.IsAvailable = true
		book.CheckedOutByPatronID = ""
		// Remove book from patron's list
		for i, title := range patron.CheckedOutBooks {
			if strings.EqualFold(title, bookTitle) {
				patron.CheckedOutBooks = append(patron.CheckedOutBooks[:i], patron.CheckedOutBooks[i+1:]...)
				break
			}
		}
		fmt.Printf("Successfully returned '%s' from %s.\n", bookTitle, patron.Name)
	} else {
		fmt.Println("This book was not checked out to this patron.")
	}
}

// listPatronBooks displays books checked out by a specific patron.
func (l *Library) listPatronBooks(scanner *bufio.Scanner) {
	fmt.Print("Enter patron ID: ")
	scanner.Scan()
	patronID := strings.TrimSpace(scanner.Text())
	patron := l.findPatronByID(patronID)

	if patron == nil {
		fmt.Println("Error: Patron not found.")
		return
	}

	fmt.Printf("\n--- Books checked out by %s ---\n", patron.Name)
	if len(patron.CheckedOutBooks) == 0 {
		fmt.Println("This patron has no books checked out.")
	} else {
		for _, title := range patron.CheckedOutBooks {
			fmt.Printf("- %s\n", title)
		}
	}
}

// --- Utility Functions ---

func getIntegerInput(prompt string, scanner *bufio.Scanner) int {
	for {
		fmt.Print(prompt)
		scanner.Scan()
		input := strings.TrimSpace(scanner.Text())
		num, err := strconv.Atoi(input)
		if err != nil {
			fmt.Println("Invalid input. Please enter a number.")
			continue
		}
		return num
	}
}

func getAvailabilityStatus(isAvailable bool) string {
	if isAvailable {
		return "Available"
	}
	return "Checked Out"
}

// --- Main Program Loop ---
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	myLibrary := NewLibrary()

	// Initial data setup
	myLibrary.AddBook("The Lord of the Rings", "J.R.R. Tolkien", 1954)
	myLibrary.AddBook("1984", "George Orwell", 1949)
	myLibrary.AddBook("Dune", "Frank Herbert", 1965)
	myLibrary.AddPatron("Alice", "P101")
	myLibrary.AddPatron("Bob", "P102")

	for {
		fmt.Println("\n--- Library Management System Menu ---")
		fmt.Println("1. List all books")
		fmt.Println("2. Search for books by author")
		fmt.Println("3. List all patrons")
		fmt.Println("4. Check out a book")
		fmt.Println("5. Return a book")
		fmt.Println("6. View books checked out by a patron")
		fmt.Println("7. Add a new book")
		fmt.Println("8. Add a new patron")
		fmt.Println("9. Exit")

		choice := getIntegerInput("Enter your choice: ", scanner)

		switch choice {
		case 1:
			myLibrary.listAllBooks()
		case 2:
			fmt.Print("Enter the author's name: ")
			scanner.Scan()
			author := strings.TrimSpace(scanner.Text())
			myLibrary.findBookByAuthor(author)
		case 3:
			myLibrary.listAllPatrons()
		case 4:
			myLibrary.checkOutBookForPatron(scanner)
		case 5:
			myLibrary.returnBookFromPatron(scanner)
		case 6:
			myLibrary.listPatronBooks(scanner)
		case 7:
			fmt.Print("Enter book title: ")
			scanner.Scan()
			title := strings.TrimSpace(scanner.Text())
			fmt.Print("Enter author's name: ")
			scanner.Scan()
			author := strings.TrimSpace(scanner.Text())
			year := getIntegerInput("Enter publication year: ", scanner)
			myLibrary.AddBook(title, author, year)
		case 8:
			fmt.Print("Enter patron name: ")
			scanner.Scan()
			name := strings.TrimSpace(scanner.Text())
			fmt.Print("Enter patron ID: ")
			scanner.Scan()
			id := strings.TrimSpace(scanner.Text())
			myLibrary.AddPatron(name, id)
		case 9:
			fmt.Println("Exiting program. Goodbye!")
			return
		default:
			fmt.Println("Invalid choice. Please try again.")
		}
	}
}
