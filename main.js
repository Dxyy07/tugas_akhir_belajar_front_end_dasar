document.addEventListener('DOMContentLoaded', function () {

    const inputBook = document.getElementById('inputBook');
    const inputBookTitle = document.getElementById('inputBookTitle');
    const inputBookAuthor = document.getElementById('inputBookAuthor');
    const inputBookYear = document.getElementById('inputBookYear');
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    const searchBook = document.getElementById('searchBook');
    const searchBookTitle = document.getElementById('searchBookTitle');

    const STORAGE_KEY = 'BOOKSHELF_APPS';

    function refreshDataFromLocalStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        return serializedData ? JSON.parse(serializedData) : [];
    }

    function saveDataToLocalStorage(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function makeBook(title, author, year, isComplete) {
        return {
            id: Date.now(),
            title: title,
            author: author,
            year: parseInt(year),
            isComplete: isComplete
        };
    }

    function createBookItem(book) {
        const bookItem = document.createElement('article');
        bookItem.classList.add('book_item');

        const title = document.createElement('h3');
        title.innerText = book.title;

        const author = document.createElement('p');
        author.innerText = 'Penulis: ' + book.author;

        const year = document.createElement('p');
        year.innerText = 'Tahun: ' + book.year;

        const action = document.createElement('div');
        action.classList.add('action');

        const buttonAction = document.createElement('button');
        buttonAction.classList.add('red');
        buttonAction.innerText = 'Hapus buku';
        buttonAction.addEventListener('click', function () {
            removeBook(book, bookItem);
        });

        const buttonMove = document.createElement('button');
        buttonMove.classList.add('green');
        buttonMove.innerText = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
        buttonMove.addEventListener('click', function () {
            moveBook(book, bookItem);
        });

        action.appendChild(buttonMove);
        action.appendChild(buttonAction);

        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(action);

        return bookItem;
    }

    function addBook() {
        const title = inputBookTitle.value;
        const author = inputBookAuthor.value;
        const year = inputBookYear.value;
        const isComplete = inputBookIsComplete.checked;

        const book = makeBook(title, author, year, isComplete);
        const books = refreshDataFromLocalStorage();

        if (isComplete) {
            completeBookshelfList.appendChild(createBookItem(book));
        } else {
            incompleteBookshelfList.appendChild(createBookItem(book));
        }

        books.push(book);
        saveDataToLocalStorage(books);

        inputBookTitle.value = '';
        inputBookAuthor.value = '';
        inputBookYear.value = '';
        inputBookIsComplete.checked = false;
    }

    function removeBook(book, bookItem) {
        const parentElement = bookItem.parentElement;
        parentElement.removeChild(bookItem);

        const books = refreshDataFromLocalStorage();
        const bookIndex = books.findIndex(item => item.id === book.id);
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            saveDataToLocalStorage(books);
        }
    }

    function moveBook(book, bookItem) {
        const parentElement = bookItem.parentElement;
        parentElement.removeChild(bookItem);

        const newIsComplete = !book.isComplete;
        book.isComplete = newIsComplete;

        const targetList = newIsComplete ? completeBookshelfList : incompleteBookshelfList;
        targetList.appendChild(createBookItem(book));

        const books = refreshDataFromLocalStorage();
        const bookIndex = books.findIndex(item => item.id === book.id);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = newIsComplete;
            saveDataToLocalStorage(books);
        }
    }

    function renderBookshelf() {
        const books = refreshDataFromLocalStorage();

        books.forEach(function (book) {
            const bookItem = createBookItem(book);
            const targetList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
            targetList.appendChild(bookItem);
        });
    }

    function filterBooksByTitle(keyword) {
        const books = refreshDataFromLocalStorage();
        return books.filter(book => book.title.toLowerCase().includes(keyword.toLowerCase()));
    }

    function renderFilteredBooks(books) {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        books.forEach(function (book) {
            const bookItem = createBookItem(book);
            const targetList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
            targetList.appendChild(bookItem);
        });
    }

    function searchBooks(event) {
        event.preventDefault();
        const keyword = searchBookTitle.value.trim();

        if (keyword === '') {
            renderBookshelf();
            return;
        }

        const filteredBooks = filterBooksByTitle(keyword);
        renderFilteredBooks(filteredBooks);
    }

    inputBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    searchBook.addEventListener('submit', searchBooks);

    renderBookshelf();

});

