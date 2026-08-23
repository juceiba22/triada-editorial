const supabaseUrl = "https://noabatfkgcdlzlpyyvgz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYWJhdGZrZ2NkbHpscHl5dmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NjMyMjYsImV4cCI6MjA5NzMzOTIyNn0.jfviFnKkn4WhcXOwB8Ne6UeJ-v0OPlpaa_1RaVbSS2g";
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

let session = null;

// DOM Elements
const authView = document.getElementById('auth-view');
const dashView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const booksTableBody = document.querySelector('#books-table tbody');
const bookForm = document.getElementById('book-form');
const bookFormMsg = document.getElementById('book-form-msg');

// Initialize
async function init() {
    const { data } = await supabase.auth.getSession();
    session = data.session;
    updateView();
    
    supabase.auth.onAuthStateChange((_event, newSession) => {
        session = newSession;
        updateView();
    });

    setupEventListeners();
}

function updateView() {
    if (session) {
        authView.classList.remove('active');
        dashView.classList.add('active');
        logoutBtn.style.display = 'block';
        loadBooks();
    } else {
        authView.classList.add('active');
        dashView.classList.remove('active');
        logoutBtn.style.display = 'none';
    }
}

function setupEventListeners() {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = 'Cargando...';
        
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            errorDiv.textContent = error.message;
        } else {
            errorDiv.textContent = '';
        }
    });

    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');

            if (btn.dataset.target === 'add-book') {
                if (btn.textContent === 'Añadir Libro') {
                    // Reset everything if it was just navigating to Add Book
                    bookForm.reset();
                    document.getElementById('book-id').removeAttribute('readonly');
                    document.getElementById('book-id').style.backgroundColor = '';
                    document.getElementById('book-cover-front').setAttribute('required', 'true');
                    document.querySelector('#add-book h2').textContent = 'Subir Nuevo Libro';
                }
            } else if (btn.dataset.target === 'books-list') {
                // If they go back to catalog, reset the Add Book tab text
                const addTabBtn = document.querySelector('.tab-btn[data-target="add-book"]');
                addTabBtn.textContent = 'Añadir Libro';
            }
        });
    });

    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        bookFormMsg.className = '';
        bookFormMsg.textContent = 'Guardando...';
        
        try {
            const id = document.getElementById('book-id').value;
            const frontFile = document.getElementById('book-cover-front').files[0];
            const backFile = document.getElementById('book-cover-back').files[0];
            
            let cover_front_url = '';
            let cover_back_url = '';

            if (frontFile) {
                const ext = frontFile.name.split('.').pop();
                const path = `front_${id}.${ext}`;
                const { data, error } = await supabase.storage.from('covers').upload(path, frontFile, { upsert: true });
                if (error) throw error;
                cover_front_url = supabase.storage.from('covers').getPublicUrl(path).data.publicUrl;
            }

            if (backFile) {
                const ext = backFile.name.split('.').pop();
                const path = `back_${id}.${ext}`;
                const { data, error } = await supabase.storage.from('covers').upload(path, backFile, { upsert: true });
                if (error) throw error;
                cover_back_url = supabase.storage.from('covers').getPublicUrl(path).data.publicUrl;
            }

            const bookData = {
                id,
                title: document.getElementById('book-title').value,
                author: document.getElementById('book-author').value,
                artist: document.getElementById('book-artist').value,
                price_ars: parseFloat(document.getElementById('book-price-ars').value),
                price_usd: parseFloat(document.getElementById('book-price-usd').value),
                has_back: document.getElementById('book-has-back').checked,
                description: document.getElementById('book-desc').value,
                features: document.getElementById('book-features').value
            };

            if (cover_front_url) bookData.cover_front_url = cover_front_url;
            if (cover_back_url) bookData.cover_back_url = cover_back_url;

            const { error: dbError } = await supabase.from('books').upsert(bookData);
            if (dbError) throw dbError;

            // Handle optional review
            const rName = document.getElementById('book-review-name').value;
            const rComment = document.getElementById('book-review-comment').value;
            if (rName && rComment) {
                const reviewData = {
                    book_id: id,
                    name: rName,
                    rating: parseInt(document.getElementById('book-review-rating').value),
                    date: document.getElementById('book-review-date').value || new Date().toLocaleDateString('es-AR'),
                    comment: rComment
                };
                const { error: revError } = await supabase.from('reviews').insert(reviewData);
                if (revError) throw revError;
            }

            bookFormMsg.className = 'success';
            bookFormMsg.textContent = 'Libro y datos guardados exitosamente.';
            bookForm.reset();
            
            // Reset states
            document.getElementById('book-id').removeAttribute('readonly');
            document.getElementById('book-id').style.backgroundColor = '';
            document.getElementById('book-cover-front').setAttribute('required', 'true');
            const addTabBtn = document.querySelector('.tab-btn[data-target="add-book"]');
            addTabBtn.textContent = 'Añadir Libro';
            document.querySelector('#add-book h2').textContent = 'Subir Nuevo Libro';

            loadBooks();
        } catch (err) {
            bookFormMsg.className = 'error';
            bookFormMsg.textContent = 'Error: ' + err.message;
        }
    });
}

let currentBooks = [];

async function loadBooks() {
    const { data: books, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error loading books:', error);
        return;
    }

    currentBooks = books;
    booksTableBody.innerHTML = '';
    books.forEach(book => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>$${book.price_ars}</td>
            <td>$${book.price_usd} USD</td>
            <td>
                <button class="btn-edit" data-id="${book.id}">Editar</button>
                <button class="btn-delete" data-id="${book.id}">Eliminar</button>
            </td>
        `;
        booksTableBody.appendChild(tr);
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm('¿Seguro que deseas eliminar este libro?')) {
                const id = e.target.dataset.id;
                await supabase.from('books').delete().eq('id', id);
                loadBooks();
            }
        });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const book = currentBooks.find(b => b.id === id);
            if (!book) return;

            // Populate form
            document.getElementById('book-id').value = book.id;
            document.getElementById('book-id').setAttribute('readonly', true);
            document.getElementById('book-id').style.backgroundColor = '#eee';
            
            document.getElementById('book-title').value = book.title;
            document.getElementById('book-author').value = book.author;
            document.getElementById('book-artist').value = book.artist || '';
            document.getElementById('book-price-ars').value = book.price_ars;
            document.getElementById('book-price-usd').value = book.price_usd;
            document.getElementById('book-has-back').checked = book.has_back;
            document.getElementById('book-desc').value = book.description || '';
            document.getElementById('book-features').value = book.features || '';

            // Optional image requirements (remove required if editing)
            document.getElementById('book-cover-front').removeAttribute('required');

            // Switch to add-book tab
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            const addTabBtn = document.querySelector('.tab-btn[data-target="add-book"]');
            addTabBtn.classList.add('active');
            addTabBtn.textContent = 'Editar Libro';
            document.getElementById('add-book').classList.add('active');
            
            document.querySelector('#add-book h2').textContent = 'Editar Libro';
        });
    });
}

init();
