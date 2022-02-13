// Book -for storing new book data
class Book {
  constructor(bookId, title, author, price) {
    this.title = title;
    this.author = author;
    this.price = price;
    this.bookId = bookId;
  }
}

// UI -for showing books on page
class UI {
  static displayBooks() {
    const storedBooks = Store.getBooks();
    storedBooks.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const tableBody = document.querySelector('#book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>$${book.price}</td>
      <td <button class='text-black btn btn-danger btn-sm p-1 delete'>X</button></td>
      `;
    tableBody.appendChild(row);
  }

  static clearFields(...inputs) {
    inputs.forEach(input => (input.value = ''));
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.getElementById('book-form');
    container.insertBefore(div, form);

    // timeout handler
    setTimeout(() => div.remove(), 3000);
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.closest('tr').remove();
    }
  }
}

// Storage - for reteiving data from storage
class Store {
  static getBooks() {
      let books;
      const storedBooks = JSON.parse(localStorage.getItem('books'));

      if(!storedBooks){
        books = [];
      }else {
          books = storedBooks;
      }

      return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(el) {
      const bookTitle = el.parentElement.firstElementChild.textContent;
      const filteredBooks = this.getBooks().filter(book => book.title !== bookTitle);
      
      localStorage.setItem('books', JSON.stringify(filteredBooks));
  }
}

// Event 1  - Display initial books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event 2 - Add new book
document.querySelector('#book-form').addEventListener('submit', event => {
  event.preventDefault();
  const title = document.querySelector('#title');
  const author = document.querySelector('#author');
  const price = document.querySelector('#price');

  //validating form data
  if (title.value === '' || author.value === '' || price.value === '') {
    UI.showAlert('Invalid Form data', 'danger');
    return;
  }

  const book = new Book(
    Math.random().toFixed(2),
    title.value,
    author.value,
    price.value
  );

  
  // UI functionality

  UI.addBookToList(book);
  UI.showAlert('Book added', 'success');
  UI.clearFields(title, author, price);

  //Storage functionality
  Store.addBook(book);
});

// Event 3 - Delete a book

document.querySelector('#book-list').addEventListener('click', event => {
  UI.deleteBook(event.target);
  UI.showAlert('The book is deleted', 'danger');
  Store.removeBook(event.target)
});

