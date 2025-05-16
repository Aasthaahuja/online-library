const backendUrl = "https://mixed-ivy-owner.glitch.me";

// Load books when page loads
window.onload = async function () {
    loadBooks();
};

// Search filter
document.getElementById('searchInput').addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    const bookItems = document.querySelectorAll('#book-list li');

    bookItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
    });
});

async function loadBooks() {
    try {
        const response = await fetch(`${backendUrl}/books`);
        const books = await response.json();

        const bookList = document.getElementById('book-list');
        bookList.innerHTML = '';

        books.forEach(book => {
            const li = document.createElement('li');
            const bookLink = document.createElement('a');
            bookLink.href = `https://www.google.com/search?q=${encodeURIComponent(book.title + " by " + book.author)}`;
            bookLink.textContent = `${book.title} by ${book.author}`;
            bookLink.target = "_blank";
            bookLink.style.textDecoration = "none";
            bookLink.style.color = "black";

            li.appendChild(bookLink);


            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.marginLeft = '1rem';
            deleteBtn.onclick = () => deleteBook(book.id);

            li.appendChild(deleteBtn);
            bookList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Add new book
document.getElementById('addBookForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;

    try {
        const response = await fetch(`${backendUrl}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        });

        await response.json();
        loadBooks();
        e.target.reset();
    } catch (err) {
        console.error('Error adding book:', err);
    }
});

// Delete book
async function deleteBook(id) {
    try {
        await fetch(`${backendUrl}/books/${id}`, {
            method: 'DELETE'
        });
        loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}
