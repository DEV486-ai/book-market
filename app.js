function getBooks() { let books = localStorage.getItem('books'); return books ? JSON.parse(books) : []; }
function saveBooks(books) { localStorage.setItem('books', JSON.stringify(books)); }

if (document.getElementById('bookList')) {
    function renderBooks() {
        let books = getBooks(); let bookList = document.getElementById('bookList'); bookList.innerHTML = '';
        let approvedBooks = books.filter(book => book.status === 'approved');
        if(approvedBooks.length === 0) { bookList.innerHTML = '<p>কোনো বই এখনো যুক্ত করা হয়নি।</p>'; return; }
        approvedBooks.forEach(book => {
            bookList.innerHTML += `<div class="book-card"><div class="book-info"><h3>${book.title}</h3><p>${book.description}</p></div><div class="book-price">৳${book.price}<br><button onclick="alert('কিনতে যোগাযোগ করুন!')">কিনুন</button></div></div>`;
        });
    }
    renderBooks();
    document.getElementById('bookForm').addEventListener('submit', function(e) {
        e.preventDefault(); let title = document.getElementById('title').value; let description = document.getElementById('description').value; let price = document.getElementById('price').value;
        let books = getBooks(); books.push({ id: Date.now(), title, description, price, status: 'pending' }); saveBooks(books);
        document.getElementById('msg').innerHTML = "<span style='color:green;'>বইটি অ্যাডমিন অনুমোদনের জন্য অপেক্ষা করছে।</span>"; document.getElementById('bookForm').reset();
        setTimeout(() => { document.getElementById('msg').innerHTML = ''; }, 3000);
    });
}

if (document.getElementById('loginSection')) {
    function login() {
        let pass = document.getElementById('adminPass').value;
        if (pass === 'admin123') {
            sessionStorage.setItem('admin_logged_in', 'true'); document.getElementById('loginSection').style.display = 'none'; document.getElementById('dashboard').style.display = 'block'; renderPendingBooks();
        } else { document.getElementById('loginError').innerText = 'ভুল পাসওয়ার্ড!'; }
    }
    function renderPendingBooks() {
        let books = getBooks(); let pendingList = document.getElementById('pendingList'); pendingList.innerHTML = '';
        let pendingBooks = books.filter(book => book.status === 'pending');
        if(pendingBooks.length === 0) { pendingList.innerHTML = '<p>কোনো বই অনুমোদনের অপেক্ষায় নেই।</p>'; return; }
        pendingBooks.forEach(book => {
            pendingList.innerHTML += `<div class="book-card"><div class="book-info"><h3>${book.title}</h3><p>${book.description}</p><p>মূল্য: ৳${book.price}</p></div><div class="action-btns"><button class="approve-btn" onclick="approveBook(${book.id})">Approve</button><button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button></div></div>`;
        });
    }
    window.approveBook = function(id) { let books = getBooks(); books = books.map(book => book.id === id ? { ...book, status: 'approved' } : book); saveBooks(books); renderPendingBooks(); }
    window.deleteBook = function(id) { let books = getBooks(); books = books.filter(book => book.id !== id); saveBooks(books); renderPendingBooks(); }
}
