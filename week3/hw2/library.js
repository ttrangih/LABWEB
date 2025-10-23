class Book {
  constructor(title, author, isbn, availableCopies) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.availableCopies = availableCopies;
  }

  borrowBook() {
    if (this.availableCopies <= 0) {
      // Ném lỗi khi sách hết hàng
      throw new Error(`The book "${this.title}" is currently unavailable.`);
    }
    this.availableCopies--;
  }

  returnBook() {
    this.availableCopies++;
  }
}

class User {
  constructor(name, userType, borrowLimit) {
    this.name = name;
    this.userType = userType;
    this.borrowedBooks = [];
    this.borrowLimit = borrowLimit;
  }
  borrow(book) {
    throw new Error(
      "Abstract method 'borrow()' must be implemented by subclasses."
    );
  }

  return(book) {
    const index = this.borrowedBooks.findIndex((b) => b.isbn === book.isbn);
    if (index > -1) {
      this.borrowedBooks.splice(index, 1);
      return true;
    }
    return false;
  }
}

class Student extends User {
  constructor(name) {
    super(name, "Student", 3);
  }

  borrow(book) {
    //borrow function logic
    if (this.borrowedBooks.length >= this.borrowLimit) {
      throw new Error(
        `${this.name} (${this.userType}) has reached the borrow limit of ${this.borrowLimit} books.`
      );
    }
    this.borrowedBooks.push(book);
    return true;
  }
}

class Teacher extends User {
  constructor(name) {
    super(name, "Teacher", 5);
  }

  borrow(book) {
    if (this.borrowedBooks.length >= this.borrowLimit) {
      throw new Error(
        `${this.name} (${this.userType}) has reached the borrow limit of ${this.borrowLimit} books.`
      );
    }
    this.borrowedBooks.push(book);
    return true;
  }
}

class Library {
  constructor() {
    this.books = [];
    this.users = [];
  }

  addBook(book) {
    this.books.push(book);
  }

  addUser(user) {
    this.users.push(user);
  }

  //... (borrowBook, returnBook methods)

  listAvailableBooks() {
    console.log("\n--- AVAILABLE BOOKS ---");
    const available = this.books.filter((book) => book.availableCopies > 0);

    if (available.length === 0) {
      console.log("No books currently available.");
      return;
    }

    available.forEach((book) => {
      console.log(
        `Title: ${book.title}, Author: ${book.author}, Copies: ${book.availableCopies}`
      );
    });
  }
  borrowBook(user, book) {
    try {
      // Kiểm tra sách còn không
      if (book.availableCopies <= 0) {
        throw new Error(`"${book.title}" is currently unavailable.`);
      }

      // Kiểm tra giới hạn mượn
      if (user.borrowedBooks.length >= user.borrowLimit) {
        throw new Error(`${user.name} has reached their borrow limit.`);
      }

      //borrow process
      book.borrowBook();
      user.borrow(book);
      console.log(`${user.name} borrowed "${book.title}" successfully.`);
    } catch (err) {
      throw err;
    }
  }

  returnBook(user, book) {
    const success = user.return(book);
    if (success) {
      book.returnBook();
      console.log(`${user.name} returned "${book.title}".`);
    } else {
      console.log(`${user.name} did not borrow "${book.title}".`);
    }
  }
}

// --- KHỞI TẠO HỆ THỐNG ---
const myLibrary = new Library();

// 1. Thêm Sách
const bookA = new Book("The Great Gatsby", "F. Scott Fitzgerald", "GAT001", 1);
const bookB = new Book("1984", "George Orwell", "ORG002", 3);
myLibrary.addBook(bookA);
myLibrary.addBook(bookB);

// 2. Thêm Người Dùng
const studentAlice = new Student("Alice");
const teacherBob = new Teacher("Bob");
myLibrary.addUser(studentAlice);
myLibrary.addUser(teacherBob);

myLibrary.listAvailableBooks();

// --- KỊCH BẢN MƯỢN/TRẢ ---

try {
  // 3. Mượn thành công
  myLibrary.borrowBook(studentAlice, bookB); // Alice mượn 1 (còn 2/3)
  myLibrary.borrowBook(teacherBob, bookA); // Bob mượn 1 (bookA hết)

  // 4. Mượn sách đã hết (Lỗi 1: Không còn bản sao)
  myLibrary.borrowBook(studentAlice, bookA); // Bị chặn vì bookA hết
} catch (e) {
  console.error(`\n❌ ERROR CAUGHT: ${e.message}`);
}

try {
  // 5. Vượt quá giới hạn mượn của Sinh viên (Lỗi 2: Vượt giới hạn [cite: 1035])
  myLibrary.borrowBook(studentAlice, bookB); // Alice mượn 2 (còn 1/3)
  myLibrary.borrowBook(studentAlice, bookB); // Alice mượn 3 (còn 0/3)
  myLibrary.borrowBook(studentAlice, bookB); // Bị chặn vì Alice đã mượn 3 sách
} catch (e) {
  console.error(`\n❌ ERROR CAUGHT: ${e.message}`);
}

// 6. Trả sách thành công
myLibrary.returnBook(studentAlice, bookB); // Alice trả 1 (còn 2/3)

myLibrary.listAvailableBooks();
