// 1. Book Constructor (Ab isme image bhi store hogi)
function Book(title, author, pages, status, image) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.image = image || "https://via.placeholder.com/100x140?text=No+Cover";
}

// 2. Default Library Data
let myLibrary = [
    new Book("Atomic Habits", "James Clear", 320, "read", "https://covers.openlibrary.org/b/id/12884409-M.jpg"),
    
    new Book("The Hobbit", "J.R.R. Tolkien", 310, "read", "https://covers.openlibrary.org/b/id/14575855-M.jpg"),
    
    new Book("Deep Work", "Cal Newport", 304, "unread", "https://covers.openlibrary.org/b/id/12718105-M.jpg")
];

// 3. DOM Elements Selectors
const mainGrid = document.querySelector(".main-grid");
const addbtn = document.querySelector(".add");
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");
const mainContainer = document.querySelector(".main");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const addBookBtn = document.getElementById("addBookBtn");

// 4. Function to generate Card UI
function createCard(book) {
    const card = document.createElement("div");
    card.classList.add("book_card");
    const isRead = book.status === "read";
    
    card.innerHTML = `
        <img src="${book.image}" alt="book cover">
        <div>
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <p>${book.pages} pages</p>
            <div class="card-buttons">
                <button class="status-toggle ${isRead ? 'read-btn' : 'unread-btn'}">
                    <i class="fa-solid ${isRead ? 'fa-check' : 'fa-xmark'}"></i> 
                    ${isRead ? "Read" : "Not Read"}
                </button>
                <button class="remove-btn">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `;

    // Status Toggle
    card.querySelector(".status-toggle").addEventListener("click", () => {
        book.status = (book.status === "read" ? "unread" : "read");
        displayBooks();
    });

    // Remove logic
    card.querySelector(".remove-btn").addEventListener("click", () => {
        myLibrary = myLibrary.filter(b => b.id !== book.id);
        displayBooks();
    });

    mainGrid.appendChild(card);
}

// 5. Function to Render Library
function displayBooks() {
    mainGrid.innerHTML = "";
    myLibrary.forEach(book => createCard(book));
}

// 6. Popup Logic (Open/Close)
function openPopup() {
    popup.classList.add("active");
    overlay.style.display = "block";
    mainContainer.classList.add("active-popup");
}

function closePopup() {
    popup.classList.add("closing");
    mainContainer.classList.remove("active-popup");
    overlay.style.display = "none";
    
    setTimeout(() => {
        popup.classList.remove("active");
        popup.classList.remove("closing");
        // Clear Inputs
        document.getElementById("name").value = "";
        document.getElementById("authorNam").value = "";
        document.getElementById("num").value = "";
    }, 300);
}

addbtn.addEventListener('click', openPopup);
closeBtn.addEventListener('click', closePopup);
cancelBtn.addEventListener('click', closePopup);
overlay.addEventListener('click', closePopup);

// 7. Add New Book Logic (WITH API FETCH)
addBookBtn.addEventListener("click", async () => {
    const title = document.getElementById("name").value;
    const author = document.getElementById("authorNam").value;
    const pages = document.getElementById("num").value;
    const status = document.getElementById("status").value;

    if (title && author && pages) {
        addBookBtn.innerText = "Searching...";
        addBookBtn.disabled = true;

        let imageUrl = "https://via.placeholder.com/100x140?text=No+Cover";

        try {
            // Open Library API use kar rahe hain (Title aur Author dono se search)
            const searchQuery = encodeURIComponent(`${title} ${author}`);
            const response = await fetch(`https://openlibrary.org/search.json?q=${searchQuery}`);
            const data = await response.json();
            
            // Agar result mila aur usme cover_i (Image ID) hai
            if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
                const coverId = data.docs[0].cover_i;
                imageUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
            }
        } catch (error) {
            console.error("API Error:", error);
        }

        const newBook = new Book(title, author, pages, status, imageUrl);
        myLibrary.push(newBook);
        
        displayBooks();
        closePopup();
        
        addBookBtn.innerText = "Add Book";
        addBookBtn.disabled = false;
    } else {
        alert("Please fill all fields!");
    }
});

// 8. Initial Load
displayBooks();
