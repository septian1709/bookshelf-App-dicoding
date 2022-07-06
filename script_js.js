const books=[];
const STORAGE_KEY = 'bookstack';
const RENDER_EVENT = 'render';
const checkbox = document.getElementById("inputBookIsComplete");

function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
	if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
	}
}

function showBooks(bookObject){
	const createImg = document.createElement('img');
	createImg.classList.add('coverBook');
	createImg.src = bookObject.url;
	const buttonText = document.getElementById('bookSubmit');
	
	const buttonContainer = document.createElement('div');
	buttonContainer.classList.add('button_Container');
	
	const titleBook = document.createElement('h3');
	titleBook.innerText = bookObject.title;
	
	const author= document.createElement('p');
	author.innerText = bookObject.author;
	
	const year = document.createElement('p');
	year.innerText = bookObject.year;
	
	const card = document.createElement('article');
	card.classList.add('booksCard');
	
	card.append(createImg, titleBook, author, year);
	card.setAttribute('id', `books-${bookObject.id}`);
	
	if(bookObject.isComplete == true){
		const btnEdit = document.createElement('img');
		btnEdit.src = "asset/img/edit.png";
		btnEdit.classList.add("btn_action");
		btnEdit.setAttribute('id', 'btnEdit');
		
		const btnDelete = document.createElement('img');
		btnDelete.src = "asset/img/trash.png";
		btnDelete.classList.add("btn_action");
		btnDelete.setAttribute('id', 'btnDelete');
		
		const btnUndo = document.createElement('img');
		btnUndo.src = "asset/img/undo.png";
		btnUndo.classList.add("btn_action");
		btnUndo.setAttribute('id', 'btnUndo');
		
		
		btnUndo.addEventListener('click', function(){
			console.log("undo ditekan");
			console.log(bookObject.id);
			undoBook(bookObject.id);
		});
		
		btnDelete.addEventListener('click', function(){
			console.log("delete ditekan");
			console.log(bookObject.id);
			deleteBook(bookObject.id);
		});
		
		
		btnEdit.addEventListener('click', function(){
			buttonText.remove();
			const btnUpdate = document.createElement('button');
			btnUpdate.innerText = "Update";
			btnUpdate.setAttribute('id','btn_update');
			
			const btnCancel = document.createElement('button');
			btnCancel.innerText = "cancel";
			btnCancel.setAttribute('id','btn_cancel');
			
			const form = document.getElementById('inputBooks');
			form.append(btnUpdate, btnCancel);
	
			editBook(bookObject.id);
		});
		
		buttonContainer.append(btnEdit,btnUndo,btnDelete);
		
		card.append(buttonContainer);
	}
	else{
		const btnEdit = document.createElement('img');
		btnEdit.src = "asset/img/edit.png";
		btnEdit.classList.add("btn_action");
		btnEdit.setAttribute('id', 'btnEdit');
		
		const btnDelete = document.createElement('img');
		btnDelete.src = "asset/img/trash.png";
		btnDelete.classList.add("btn_action");
		btnDelete.setAttribute('id', 'btnDelete');
		
		const btnFinish = document.createElement('img');
		btnFinish.src = "asset/img/finish.png";
		btnFinish.classList.add("btn_action");
		btnFinish.setAttribute('id', 'btnFinish');
		
		btnDelete.addEventListener('click', function(){
			console.log("del ditekan");
			console.log(bookObject.id);
			deleteBook(bookObject.id);
		});
		
		btnFinish.addEventListener('click', function(){
			console.log("fin ditekan");
			console.log(bookObject.id);
			
			finishBook(bookObject.id);
		});
		
		btnEdit.addEventListener('click', function(){
			buttonText.remove();
			const btnUpdate = document.createElement('button');
			btnUpdate.innerText = "Update";
			btnUpdate.setAttribute('id','btn_update');
			
			const btnCancel = document.createElement('button');
			btnCancel.innerText = "cancel";
			btnCancel.setAttribute('id','btn_cancel');
			
			const form = document.getElementById('inputBooks');
			form.append(btnUpdate, btnCancel);
	
			editBook(bookObject.id);
		});
		
		buttonContainer.append(btnEdit,btnFinish,btnDelete);
		
		card.append(buttonContainer);
	}
	return card;
}

function generateBook(id, title, author, year, url, isComplete){
	return {id, title, author, year, url, isComplete};
}

function addBooks(){
	const inputTitle = document.getElementById("inputBookTitle").value;
	const inputAuthor = document.getElementById("inputBookAuthor").value;
	const inputYear = document.getElementById("inputBookYear").value;
	const inputImgUrl = document.getElementById("inputImgUrl").value;
	const isComplete = document.getElementById("inputBookIsComplete").checked;
	const newID = +new Date();
	
	const bookObject = generateBook(newID, inputTitle, inputAuthor, inputYear, inputImgUrl, isComplete);
	
	books.push(bookObject);
	saveData();
	
	document.getElementById("inputBookTitle").value ="";
	document.getElementById("inputBookAuthor").value="";
	document.getElementById("inputBookYear").value="";
	document.getElementById("inputImgUrl").value="";
	
	document.dispatchEvent(new Event(RENDER_EVENT));
}

checkbox.addEventListener('change',function (){
	const buttonText = document.getElementById("bookSubmit");
	if(buttonText!=null)
	{
		if (checkbox.checked == true)
		{
			console.log("Checkbox is checked..");
			buttonText.innerText = "Masukkan Buku ke Rak Sudah Selesai Dibaca";
		}
		else{
			console.log("Checkbox is unchecked..");
			buttonText.innerText = "Masukkan Buku ke Rak Belum Selesai Dibaca";
		}
	}
	
});

document.addEventListener('DOMContentLoaded', function(){
	const submit = document.getElementById('inputBooks');
	
	submit.addEventListener('submit', function(event){
		event.preventDefault();
		addBooks();
		console.log(books);
	});
	
	if (isStorageExist()) {
		loadDataFromStorage();
	}
});
	
document.addEventListener(RENDER_EVENT, function () {
		
		const completedBook = document.getElementById('completeBookshelfList');
		completedBook.innerHTML = '';
		
		const uncompletedBook = document.getElementById('incompleteBookshelfList');
		uncompletedBook.innerHTML = '';
	 
		for (const todoItem of books) {
			
			const todoElement = showBooks(todoItem);
			if(todoItem.isComplete == true){
				console.log("render event berjalan");
				console.log("looping item");
				
				completedBook.append(todoElement);
			}else{
				uncompletedBook.append(todoElement);
			}
		}
});

function findBook(id) {
	 for (const book of books) 
	 {
		if (book.id === id) {
		  return book;
		  console.log(book.id);
		}
	 }
	 return null;
}
	
function deleteBook(id){
	const book = findBook(id);
	 
	if (book === -1){
	return;
	} 
	books.splice(book, 1);
	
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function undoBook(id){
	const book = findBook(id);
	 
	if (book == null){
		return;
	}
	book.isComplete = false;
	
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function finishBook(id){
	const book = findBook(id);
	 
	if (book == null){
		return;
	}
	book.isComplete = true;
	
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function editBook(id){
	const book = findBook(id);
	console.log("book");
	
	const btnUpdate = document.getElementById('btn_update');
	const btnCancel = document.getElementById('btn_cancel');
	
	document.getElementById('inputBookTitle').value = book.title;
	document.getElementById('inputBookAuthor').value = book.author;
	document.getElementById('inputBookYear').value = book.year;
	document.getElementById('inputImgUrl').value = book.url;
	
	if(book.isComplete == true){
		document.getElementById('inputBookIsComplete').checked = true;
	}
	else{
		document.getElementById('inputBookIsComplete').checked = false;
	}
	
	btnUpdate.addEventListener('click', function(){
		book.title = document.getElementById('inputBookTitle').value;
		book.author = document.getElementById('inputBookAuthor').value;
		book.year = document.getElementById('inputBookYear').value;
		book.url = document.getElementById('inputImgUrl').value;
		book.isComplete = document.getElementById('inputBookIsComplete').checked;
		
		console.log(book.title);
		removeBtn();
		
		
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	});
	
	btnCancel.addEventListener('click', function(){
		removeBtn();
		document.dispatchEvent(new Event(RENDER_EVENT));
	});
	
	function removeBtn(){
		btnUpdate.remove();
		btnCancel.remove();
		
		const btnSubmit = document.createElement('button');
		btnSubmit.innerText = "MasukkanBuku Ke Rak Sudah Selesai Dibaca";
		btnSubmit.setAttribute('id','bookSubmit');
		btnSubmit.setAttribute('type','submit');
		
		document.getElementById('inputBookTitle').value = '';
		document.getElementById('inputBookAuthor').value = '';
		document.getElementById('inputBookYear').value = '';
		document.getElementById('inputImgUrl').value = '';
		document.getElementById('inputBookIsComplete').checked = true;
		
		const form = document.getElementById('inputBooks');
		form.append(btnSubmit);
	}
	
	document.dispatchEvent(new Event(RENDER_EVENT));
}

	