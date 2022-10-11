const addSection = document.querySelector('.add-section-container');
const ADD_closeButton = addSection.querySelector('.close-button');
const ADD_form = addSection.querySelector('form');
const ADD_titleInput = addSection.querySelector('#title');
const ADD_authorInput = addSection.querySelector('#author');
const ADD_yearInput = addSection.querySelector('#year');
const ADD_isCompletedInput = addSection.querySelector('#is-completed');

const editSection = document.querySelector('.edit-section-container')
const EDIT_closeButton = editSection.querySelector('.close-button');
const EDIT_form = editSection.querySelector('form');
const EDIT_titleInput = editSection.querySelector('#title');
const EDIT_authorInput = editSection.querySelector('#author');
const EDIT_yearInput = editSection.querySelector('#year');
const EDIT_isCompletedInput = editSection.querySelector('#is-completed');

const deleteAlert = document.querySelector('.delete-alert-container');
const ALERT_closeButton = deleteAlert.querySelector('.close-button');
const ALERT_submitButton = deleteAlert.querySelector('input');
const ALERT_bookTitle = deleteAlert.querySelector('b');

const toReadShelf = document.querySelector('#to-read');
const toReadShelfBookList = toReadShelf.querySelector('.book-list');

const completedShelf = document.querySelector('#completed');
const completedShelfBookList = completedShelf.querySelector('.book-list');

const bookList = [];

const RENDER = 'render';
const STORAGE_KEY = 'MYBOOKSHELF';

const isStorageExist = () => {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

const loadData = () => {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data != null) {
    for (let book of data) {
      bookList.push(book);
    }
  }

  render();
}

const saveData = () => { if (isStorageExist()) localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList)) };

const render = () => document.dispatchEvent(new Event(RENDER));

const makeBookElement = (bookObject) => {
  const { id, title, author, year, isCompleted } = bookObject;

  const bookContainer = document.createElement('div');
  bookContainer.classList.add('book');
  bookContainer.id = id;

  const bookData = document.createElement('div');
  bookData.classList.add('data');

  const dataHeader = document.createElement('div');
  dataHeader.classList.add('data-header');

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;
  dataHeader.appendChild(bookTitle);

  const editButton = document.createElement('a');
  editButton.classList.add('edit-button');

  const editIcon = document.createElement('img');
  editIcon.src = 'img/edit.svg';
  editButton.appendChild(editIcon);

  dataHeader.appendChild(editButton);

  bookData.appendChild(dataHeader);

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Ditulis oleh ${author}`;
  bookData.appendChild(bookAuthor);

  const bookYear = document.createElement('p');
  bookYear.innerText = `Diterbitkan tahun ${year}`;
  bookData.appendChild(bookYear);

  bookContainer.appendChild(bookData);

  const bookButton = document.createElement('div');
  bookButton.classList.add('button');

  if (isCompleted) {
    const readButton = document.createElement('a');
    readButton.classList.add('read-button');
    readButton.innerText = 'Baca Lagi';
    bookButton.appendChild(readButton);
  } else {
    const completedButton = document.createElement('a');
    completedButton.classList.add('completed-button');
    completedButton.innerText = 'Tandai Selesai';
    bookButton.appendChild(completedButton);
  }

  const deleteButton = document.createElement('a');
  deleteButton.classList.add('delete-button');
  deleteButton.innerText = 'Hapus Buku';
  bookButton.appendChild(deleteButton);

  bookContainer.appendChild(bookButton);

  return bookContainer;
}

const addEmptyLabel = shelf => {
  const emptyLabel = document.createElement('p');
  const emptyMessage = document.createTextNode('(Tidak ada buku dalam daftar)');
  emptyLabel.appendChild(emptyMessage);

  shelf.querySelector('.book-list').appendChild(emptyLabel);
}

const moveBook = (selectedBook, destination) => {
  let index = bookList.findIndex(book => book.id == selectedBook.id);

  destination === toReadShelfBookList ? bookList[index].isCompleted = false : bookList[index].isCompleted = true;

  bookList.push(bookList.splice(index, 1)[0]);
}

document.addEventListener('DOMContentLoaded', () => { if (isStorageExist()) loadData() });

ADD_form.addEventListener('submit', event => {
  let newBook = {
    id: +new Date,
    title: ADD_titleInput.value,
    author: ADD_authorInput.value,
    year: ADD_yearInput.value,
    isCompleted: ADD_isCompletedInput.checked
  };

  bookList.push(newBook);
  event.preventDefault();
  ADD_closeButton.click();
  render();
});

document.addEventListener('click', event => {
  // Add book
  if (event.target.classList.contains('add-btn')) {
    addSection.classList.remove('hidden');
    ADD_titleInput.value = ADD_authorInput.value = ADD_yearInput.value = '';
    ADD_isCompletedInput.checked = false;
  }

  // Delete book
  else if (event.target.classList.contains('delete-button')) {
    let selectedBook = event.target.parentNode.parentNode;
    let index = bookList.findIndex(book => book.id == selectedBook.id);

    ALERT_bookTitle.innerText = bookList[index].title;
    deleteAlert.classList.remove('hidden');

    ALERT_submitButton.addEventListener('click', () => {
      bookList.splice(index, 1);
      ALERT_closeButton.click();
    });
  }

  // Move book to completed shelf
  else if (event.target.classList.contains('completed-button')) {
    let selectedBook = event.target.parentNode.parentNode;
    moveBook(selectedBook, completedShelfBookList);
  }

  // Move book to to-read shelf
  else if (event.target.classList.contains('read-button')) {
    let selectedBook = event.target.parentNode.parentNode;
    moveBook(selectedBook, toReadShelfBookList);
  }

  // Edit book
  else if (event.target.classList.contains('edit-button')) {
    editSection.classList.remove('hidden');
    editBook(event.target.parentNode.parentNode.parentNode);
  }

  saveData();
  render();
});

const editBook = selectedBook => {
  let index = bookList.findIndex(book => book.id == selectedBook.id);
  selectedBook = bookList[index];

  EDIT_titleInput.value = selectedBook.title;
  EDIT_authorInput.value = selectedBook.author;
  EDIT_yearInput.value = selectedBook.year;
  EDIT_isCompletedInput.checked = selectedBook.isCompleted;

  EDIT_form.addEventListener('submit', event => {
    selectedBook.title = EDIT_titleInput.value;
    selectedBook.author = EDIT_authorInput.value;
    selectedBook.year = EDIT_yearInput.value;
    selectedBook.isCompleted = EDIT_isCompletedInput.checked;

    bookList.push(bookList.splice(index, 1)[0]);

    event.preventDefault();
    EDIT_closeButton.click();
    render();
  });
}

ADD_closeButton.addEventListener('click', () => {
  addSection.classList.add('hidden');
})

EDIT_closeButton.addEventListener('click', () => {
  editSection.classList.add('hidden');
});

ALERT_closeButton.addEventListener('click', () => {
  deleteAlert.classList.add('hidden');
});

document.addEventListener(RENDER, () => {
  toReadShelfBookList.innerHTML = '';
  for (let book of bookList.filter(book => !book.isCompleted)) {
    toReadShelfBookList.appendChild(makeBookElement(book));
  }
  if (toReadShelfBookList.innerHTML === '') addEmptyLabel(toReadShelf);

  completedShelfBookList.innerHTML = '';
  for (let book of bookList.filter(book => book.isCompleted)) {
    completedShelfBookList.appendChild(makeBookElement(book));
  }
  if (completedShelfBookList.innerHTML === '') addEmptyLabel(completedShelf);
});