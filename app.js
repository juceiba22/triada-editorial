// La Tríada Editorial - Main Application JavaScript
// Implementa la SPA, el carrito, la simulación de pagos y las reseñas

const app = {
    // 0. SUPABASE CONFIGURATION
    // Reemplazar con las credenciales de tu panel de Supabase
    supabaseUrl: "https://noabatfkgcdlzlpyyvgz.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYWJhdGZrZ2NkbHpscHl5dmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NjMyMjYsImV4cCI6MjA5NzMzOTIyNn0.jfviFnKkn4WhcXOwB8Ne6UeJ-v0OPlpaa_1RaVbSS2g",

    // 1. DATA STORES
    // 1. DATA STORES
    books: {
        "comunidad-organizada": {
            id: "comunidad-organizada",
            title: "La Comunidad Organizada",
            author: "Juan Domingo Perón",
            artist: "",
            price: 25000,
            priceUSD: 1.50,
            coverFront: "assets/Tapa - Comunidad Organizada.png",
            coverBack: "assets/Contratapa - Comunidad Organizada.png",
            hasBack: true,
            desc: "Publicado originalmente en 1949, La Comunidad Organizada reúne la exposición doctrinaria de Juan Domingo Perón en el Primer Congreso Nacional de Filosofía de Mendoza. El texto propone una reflexión sobre el hombre, la sociedad y las formas posibles de organización de la vida colectiva, buscando superar tanto el individualismo liberal como las formas de colectivismo que subordinan al individuo. Más de siete décadas después, la obra conserva su lugar como uno de los textos fundamentales para comprender los fundamentos filosóficos y políticos del peronismo y su concepción de la comunidad organizada. La Tríada recupera esta obra dentro de Los Esenciales, colección destinada a volver a poner en circulación textos fundamentales del pensamiento nacional que, pese a su importancia, hoy resultan difíciles de conseguir o han dejado de editarse.",
            features: "Colección Los Esenciales. Edición: La Tríada Editorial, 2026 | Páginas: 96 | Formato: 15 × 21 cm | Encuadernación: Rústica · tapa blanda · cosido",
            reviews: []
        },
        "justicialismo": {
            id: "justicialismo",
            title: "El Justicialismo",
            author: "Raúl Antonio Mendé",
            artist: "",
            price: 25000,
            priceUSD: 1.50,
            coverFront: "assets/Tapa - Justicialismo.png",
            coverBack: "assets/Contratapa - Justicialismo.png",
            hasBack: true,
            desc: "¿Qué significa ser libre? ¿Dónde se encuentra la felicidad humana? ¿Cómo puede organizarse una sociedad sin sacrificar ni al individuo ni a la comunidad? Desde estas preguntas, Raúl Antonio Mendé desarrolla en El Justicialismo una interpretación de la historia y de la sociedad que busca comprender las tensiones entre individualismo y colectivismo, libertad y organización social, materia y espíritu. Su propuesta parte de una preocupación central: encontrar un equilibrio que permita la realización de la persona dentro de la comunidad. El justicialismo aparece así como una concepción que busca la liberación y perfección del hombre, pero entendiendo que esa realización no puede alcanzarse desconociendo la dimensión colectiva de la vida social. Mendé plantea una libertad situada: una libertad compatible con la sociedad y construida a partir del equilibrio entre la unidad humana y la totalidad social. Médico, poeta y político, Mendé desarrolló una obra que hoy resulta difícil de encontrar y que forma parte de una zona poco transitada de la tradición intelectual del peronismo. La Tríada recupera El Justicialismo para volver a poner estas ideas en circulación y acercarlas a nuevos lectores. La edición conserva el prólogo y el contenido de la obra original.",
            features: "Colección Los Esenciales. Edición: La Tríada Editorial, 2026 | Páginas: 112 | Formato: 15 × 21 cm | Encuadernación: Rústica · tapa blanda · cosido",
            reviews: []
        },
        "nueva-coronica": {
            id: "nueva-coronica",
            title: "Nueva Corónica y Buen Gobierno",
            author: "Felipe Guamán Poma de Ayala",
            artist: "",
            price: 45000,
            priceUSD: 2.00,
            coverFront: "assets/Tapa - Nueva Cronica y buen gobierno.png",
            coverBack: "assets/Contratapa - Nuevo Cronica y buen gobierno.png",
            hasBack: true,
            desc: "Hay obras que atraviesan siglos porque todavía tienen algo que decir. Escrita entre 1600 y 1615, Nueva corónica y buen gobierno de Felipe Guamán Poma de Ayala fue concebida como una extensa carta dirigida al rey Felipe III. Mucho más que una crónica, el manuscrito construye una interpretación del mundo andino y de su historia: las tradiciones indígenas, el Tawantinsuyu, las formas de gobierno, las jerarquías sociales, las prácticas religiosas, la vida de las mujeres, el trabajo cotidiano y las transformaciones producidas por la llegada española. Texto e imagen forman en esta obra una unidad inseparable. Los cientos de dibujos de Guamán Poma no funcionan simplemente como ilustraciones, sino como parte fundamental de su manera de narrar y como uno de los registros visuales más importantes del mundo colonial andino. La edición de La Tríada recupera integralmente el manuscrito en formato facsimilar, respetando sus grafías, construcciones lingüísticas y formas de escritura, y lo organiza en cuatro tomos mediante una curaduría editorial propia. Dentro de la colección Paganismo, esta edición propone volver a acercar al presente una obra fundamental para pensar la memoria, la historia y las formas de conocimiento producidas en América. No se trata solamente de conservar un documento del pasado, sino de volver a ponerlo en circulación para que pueda ser leído nuevamente.",
            features: "Colección Paganismo. Edición: La Tríada Editorial, 2026 | Páginas: 192 · 4 tomos | Formato: 15 × 21 cm | Encuadernación: Rústica · tapa blanda · cosido",
            reviews: []
        },
        "poema-robot": {
            id: "poema-robot",
            title: "El Poema del Robot",
            author: "Leopoldo Marechal",
            artist: "",
            price: 20000,
            priceUSD: 1.00,
            coverFront: "assets/Tapa - Poema Robot.png",
            coverBack: "assets/Contratapa - Poema Robot.png",
            hasBack: true,
            desc: "Publicado originalmente en 1966, El Poema del Robot pertenece a la obra tardía de Leopoldo Marechal, una de las figuras centrales de la literatura argentina del siglo XX. Poeta, narrador y ensayista, Marechal construyó una escritura atravesada por la filosofía, la tradición clásica y la preocupación por el destino del hombre en la modernidad. En este poema, el Robot se convierte en una figura para pensar una civilización que deposita en la técnica y en la ciencia la promesa de explicar y dominar el mundo. Pero detrás de esa fascinación aparece una pregunta más profunda: ¿qué ocurre con el hombre cuando aquello que crea termina ocupando el lugar de aquello que lo hace humano? Marechal presenta al Robot como imagen de una existencia reducida a la lógica de la técnica, la producción y el cálculo, y desde allí construye una crítica al vaciamiento espiritual del hombre moderno. La obra conserva, además, una particular combinación de ironía, humor, pensamiento filosófico y poesía. El enfrentamiento con el Robot no es solamente una oposición entre hombre y máquina: es una reflexión sobre los límites de una razón que pretende explicar toda la experiencia humana desde la técnica. La Tríada incorpora El Poema del Robot a Los Esenciales porque su pregunta sigue abierta: qué lugar ocupa el ser humano en un mundo cada vez más atravesado por sus propias tecnologías.",
            features: "Colección Los Esenciales. Edición: La Tríada Editorial, 2026 | Páginas: 28 | Formato: 15 × 21 cm | Encuadernación: Rústica · tapa blanda · cosido",
            reviews: []
        },
        "crisis-milenio": {
            id: "crisis-milenio",
            title: "La crisis del nuevo milenio",
            author: "Julio Ibarra",
            artist: "",
            price: 25000,
            priceUSD: 1.50,
            coverFront: "assets/Tapa - Crisis del Nuevo Milenio.jpg",
            coverBack: "assets/Contratapa - Crisis del Nuevo Milenio.jpg",
            hasBack: true,
            desc: "La crisis del nuevo milenio. Episodio 01: Apuntes para comprender la realidad es un ensayo de divulgación político-económica que busca ofrecer herramientas para interpretar las transformaciones que atraviesan la economía, la política, la tecnología y el mundo del trabajo contemporáneo. Ibarra parte de una pregunta central: ¿cómo comprender el mundo que emerge después de las grandes transformaciones económicas y tecnológicas de las últimas décadas? Para abordarla, recorre procesos como la globalización, las Cadenas Globales de Valor, la concentración económica, el desarrollo tecnológico, el capitalismo de plataformas y las transformaciones producidas por Internet y la inteligencia artificial. El libro presta especial atención a la relación entre tecnología, producción y trabajo. La innovación tecnológica no aparece como un fenómeno aislado, sino como parte de procesos económicos y políticos que modifican las estructuras productivas y las relaciones sociales. Pero La crisis del nuevo milenio no pretende cerrar el debate. El autor presenta su trabajo como una hipótesis abierta: una invitación a discutir, contrastar y continuar pensando la realidad. Para La Tríada, este libro representa además una apertura de catálogo: después de recuperar obras fundamentales del pensamiento nacional y latinoamericano, la editorial busca también ofrecer un espacio a autores contemporáneos que quieran producir y poner en circulación nuevas ideas. La crisis del nuevo milenio es, en ese sentido, un comienzo: una primera voz contemporánea dentro de una editorial que busca que los libros vuelvan a ser un lugar de discusión, pensamiento y construcción de futuro.",
            features: "Autores contemporáneos. Edición: La Tríada Editorial, 2024 | Páginas: 96 | Formato: 15 × 21 cm | Encuadernación: Rústica · tapa blanda · cosido",
            reviews: []
        }
    },

    authors: {
        peron: {
            id: "peron",
            name: "Juan Domingo Perón",
            initials: "JDP",
            bookTitle: "La Comunidad Organizada",
            bookId: "comunidad-organizada",
            bio: "Fue un político, militar y presidente argentino, figura central en la historia de su país y creador del peronismo. Su pensamiento dejó una huella indeleble en la concepción del Estado y la sociedad, proponiendo una Tercera Posición frente a las tensiones globales de la Guerra Fría. La Comunidad Organizada resume gran parte de esta visión doctrinaria.",
            backCover: "El texto propone una reflexión sobre el hombre, la sociedad y las formas posibles de organización de la vida colectiva, buscando superar tanto el individualismo liberal como las formas de colectivismo que subordinan al individuo."
        },
        mende: {
            id: "mende",
            name: "Raúl Antonio Mendé",
            initials: "RAM",
            bookTitle: "El Justicialismo",
            bookId: "justicialismo",
            bio: "Médico, poeta y político argentino. Mendé desarrolló una obra que forma parte de una zona poco transitada de la tradición intelectual del peronismo, preocupado por las tensiones entre individualismo y colectivismo, libertad y organización social.",
            backCover: "Su propuesta parte de una preocupación central: encontrar un equilibrio que permita la realización de la persona dentro de la comunidad. El justicialismo aparece así como una concepción que busca la liberación y perfección del hombre."
        },
        poma: {
            id: "poma",
            name: "Felipe Guamán Poma de Ayala",
            initials: "FGP",
            bookTitle: "Nueva Corónica y Buen Gobierno",
            bookId: "nueva-coronica",
            bio: "Cronista de ascendencia indígena peruana del virreinato del Perú. Su monumental obra, escrita e ilustrada entre 1600 y 1615, constituye uno de los documentos más ricos y complejos para entender el mundo andino colonial y la visión indígena tras la conquista.",
            backCover: "El manuscrito construye una interpretación del mundo andino y de su historia: las tradiciones indígenas, el Tawantinsuyu, las formas de gobierno, las jerarquías sociales, las prácticas religiosas, la vida de las mujeres y el trabajo cotidiano."
        },
        marechal: {
            id: "marechal",
            name: "Leopoldo Marechal",
            initials: "LM",
            bookTitle: "El Poema del Robot",
            bookId: "poema-robot",
            bio: "Poeta, narrador y ensayista, Leopoldo Marechal es una de las figuras centrales de la literatura argentina del siglo XX. Construyó una escritura atravesada por la filosofía, la tradición clásica y la preocupación por el destino del hombre en la modernidad.",
            backCover: "Marechal presenta al Robot como imagen de una existencia reducida a la lógica de la técnica, la producción y el cálculo, y desde allí construye una crítica al vaciamiento espiritual del hombre moderno."
        },
        ibarra: {
            id: "ibarra",
            name: "Julio Ibarra",
            initials: "JI",
            bookTitle: "La crisis del nuevo milenio",
            bookId: "crisis-milenio",
            bio: "Autor contemporáneo. Su trabajo busca ofrecer herramientas para interpretar las transformaciones que atraviesan la economía, la política, la tecnología y el mundo del trabajo actual.",
            backCover: "La innovación tecnológica no aparece como un fenómeno aislado, sino como parte de procesos económicos y políticos que modifican las estructuras productivas y las relaciones sociales. Una invitación a discutir, contrastar y continuar pensando la realidad."
        }
    },

    manifesto: `
        <p class="manifesto-lead">La Tríada Editorial es una editorial independiente y emergente que nace de una búsqueda: volver a poner en circulación libros, autores e ideas que no queremos que queden en el olvido.</p>
        <p>Hay obras que alguna vez fueron publicadas y que, con el paso del tiempo, dejaron de editarse, dejaron de distribuirse o se volvieron difíciles de encontrar. Sin embargo, que un libro deje de circular no significa que sus ideas hayan perdido vigencia. La Tríada nace para recuperar esos textos y acercarlos nuevamente a los lectores. Nuestro catálogo parte de una convicción: hay obras del pasado que todavía tienen algo que decirle al presente.</p>
        <p>En esta búsqueda ocupa un lugar central el pensamiento de Juan Domingo Perón, como una de las tradiciones fundamentales desde las que construimos nuestro catálogo. Pero nuestra mirada no se limita a un período ni a una única forma de pensamiento. Recuperamos también obras que forman parte de una historia más amplia de nuestro país y de América, como la de Felipe Guamán Poma de Ayala, cuya obra nos permite volver sobre las memorias, las ideas y las formas de comprender el mundo construidas en nuestro continente.</p>
        <p>También forman parte de esta búsqueda autores como Leopoldo Marechal, cuya obra excede los límites de la literatura para constituirse también en una profunda reflexión sobre el hombre, la comunidad, la cultura y las transformaciones de la modernidad. Un pensamiento extraordinario que, lejos de quedar anclado en su tiempo, continúa interpelando al presente.</p>
        <p>Por eso, nuestro trabajo no consiste simplemente en reeditar libros. Buscamos devolverlos al presente, acompañando cada recuperación con una mirada editorial que permita volver a encontrarse con esas obras sin perder aquello que las hace singulares.</p>
        <p>Pero La Tríada no mira únicamente hacia atrás. La recuperación de autores y textos fundamentales es también el punto de partida para construir un catálogo propio. Queremos que la editorial sea un espacio para autores contemporáneos que tengan algo para decir, que estén buscando nuevas formas de pensar la realidad y que encuentren en La Tríada un lugar para desarrollar y poner en circulación sus obras. La crisis del nuevo milenio, de Julio Ibarra, inaugura ese camino.</p>
        <p>Recuperar, publicar y poner en diálogo. Ese es el camino que queremos construir en La Tríada: un catálogo donde los textos del pasado puedan volver a conversar con el presente y donde las nuevas voces puedan encontrar un espacio para pensar el futuro.</p>
    `,

    cart: [],
    tempReviewStars: 5,

    // 2. INITIALIZATION
    async init() {
        // await this.loadBooksFromSupabase();
        this.loadCart();
        this.loadUserReviews();
        this.renderCatalog();
        this.renderAuthors();
        this.setupRouter();
        this.setupEventListeners();
        this.updateCartUI();
        this.renderManifesto();
    },

    async loadBooksFromSupabase() {
        try {
            const res = await fetch(`${this.supabaseUrl}/rest/v1/books?select=*`, {
                headers: {
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch books');
            const data = await res.json();
            
            if (data && data.length > 0) {
                const reviewsRes = await fetch(`${this.supabaseUrl}/rest/v1/reviews?select=*`, {
                    headers: {
                        'apikey': this.supabaseAnonKey,
                        'Authorization': `Bearer ${this.supabaseAnonKey}`
                    }
                });
                let reviewsData = [];
                if (reviewsRes.ok) {
                    reviewsData = await reviewsRes.json();
                }

                this.books = {};
                data.forEach(book => {
                    const bookReviews = reviewsData.filter(r => r.book_id === book.id).map(r => ({
                        name: r.name,
                        rating: r.rating,
                        date: r.date,
                        comment: r.comment
                    }));
                    
                    this.books[book.id] = {
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        artist: book.artist || '',
                        price: book.price_ars,
                        priceUSD: book.price_usd,
                        coverFront: book.cover_front_url || "assets/cover_placeholder.png",
                        coverBack: book.cover_back_url || "assets/cover_placeholder.png",
                        hasBack: book.has_back || false,
                        desc: book.description || '',
                        features: book.features || '',
                        reviews: bookReviews
                    };
                });
            }
        } catch (err) {
            console.error("Error loading books from Supabase:", err);
            // fallback to hardcoded this.books if failed
        }
    },

    // 3. ROUTER & SECTIONS
    setupRouter() {
        const handleRoute = () => {
            const hash = window.location.hash || '#inicio';
            
            // Hide all sections
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Update active menu link
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === hash.split('/')[0]) {
                    link.classList.add('active');
                }
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Close payment modal if it was open (prevents loop when returning via browser Back button)
            const paymentModal = document.getElementById('payment-modal');
            if (paymentModal) paymentModal.classList.remove('open');

            // Route parsing
            if (hash.startsWith('#libro-detalle/')) {
                const bookId = decodeURIComponent(hash.split('/')[1]);
                this.renderBookDetail(bookId);
                document.getElementById('libro-detalle').classList.add('active');
            } else if (hash.startsWith('#checkout/success')) {
                this.handleCheckoutSuccess();
                document.getElementById('checkout-success').classList.add('active');
            } else if (hash.startsWith('#checkout/failure')) {
                this.handleCheckoutFailure();
                document.getElementById('checkout-failure').classList.add('active');
            } else if (hash === '#checkout') {
                this.renderCheckout();
                document.getElementById('checkout').classList.add('active');
            } else if (hash === '#nuestros-autores') {
                this.renderAuthors();
                document.getElementById('nuestros-autores').classList.add('active');
            } else {
                const activeSection = document.querySelector(hash);
                if (activeSection) {
                    activeSection.classList.add('active');
                } else {
                    document.getElementById('inicio').classList.add('active');
                }
            }
        };

        window.addEventListener('hashchange', handleRoute);
        
        // Handle bfcache restorations (when user navigates back from PayPal/MercadoPago)
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                const paymentModal = document.getElementById('payment-modal');
                if (paymentModal) paymentModal.classList.remove('open');
            }
        });

        // Initial run
        handleRoute();
    },

    // 4. EVENT LISTENERS
    setupEventListeners() {
        // Cart drawer open/close
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-drawer-overlay');
        const openCartBtn = document.getElementById('open-cart-btn');
        const closeCartBtn = document.getElementById('close-cart-btn');

        const openCart = () => {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
        };

        const closeCart = () => {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('open');
        };

        openCartBtn.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
        document.getElementById('cart-checkout-btn').addEventListener('click', closeCart);

        // Checkout country change
        const countrySelect = document.getElementById('checkout-country');
        if (countrySelect) {
            countrySelect.addEventListener('change', () => {
                this.updateCheckoutShippingAndPayment();
            });
        }
        
        // Dynamic Shipping Fetching
        const zipInput = document.getElementById('checkout-zip');
        const stateInput = document.getElementById('checkout-state');
        if (zipInput) {
            zipInput.addEventListener('blur', () => this.fetchShippingRates());
        }
        if (stateInput) {
            stateInput.addEventListener('blur', () => {
                this.fetchShippingRates();
                if (this.selectedShippingType === 'S') {
                    this.fetchAgencies(stateInput.value);
                }
            });
        }

        // Checkout submit
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.cart.length === 0) {
                    alert('Tu carrito está vacío.');
                    return;
                }
                this.openPaymentGateway();
            });
        }
    },

    // 5. VIEW RENDERING
    renderManifesto() {
        document.getElementById('about-manifesto-container').innerHTML = `
            <h2>Quiénes Somos</h2>
            ${this.manifesto}
        `;
    },

    renderCatalog() {
        const featuredGrid = document.getElementById('featured-books-grid');
        const catalogGrid = document.getElementById('catalog-books-grid');
        
        let booksHTML = '';
        
        Object.values(this.books).forEach(book => {
            booksHTML += `
                <div class="book-card">
                    <div class="book-cover-container">
                        <div class="book-cover-wrapper ${book.hasBack ? 'has-back' : ''}" id="card-wrapper-${book.id}">
                            <div class="book-cover-side book-cover-front">
                                <img src="${book.coverFront}" alt="Portada de ${book.title}">
                            </div>
                            ${book.hasBack ? `
                            <div class="book-cover-side book-cover-back">
                                <img src="${book.coverBack}" alt="Contratapa de ${book.title}">
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <h3>${book.title}</h3>
                    <div class="book-author">${book.author}</div>
                    <div class="book-artist">${book.artist}</div>
                    <div class="price">$${book.price.toLocaleString('es-AR')} ARS</div>
                    <div class="book-card-actions">
                        <a href="#libro-detalle/${encodeURIComponent(book.id)}" class="btn btn-secondary">Ver Reseña</a>
                        <button onclick="app.addToCart('${book.id}')" class="btn btn-primary"><i class="fa-solid fa-cart-plus"></i> Comprar</button>
                    </div>
                </div>
            `;
        });

        if (featuredGrid) featuredGrid.innerHTML = booksHTML;
        if (catalogGrid) catalogGrid.innerHTML = booksHTML;
    },

    renderAuthors() {
        const container = document.getElementById('authors-container');
        if (!container) return;

        let authorsHTML = '';
        Object.values(this.authors).forEach(author => {
            authorsHTML += `
                <div class="author-card">
                    <div class="author-header">
                        <div class="author-avatar-container" style="background-color: var(--color-bg); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.5rem; color: var(--color-accent);">
                            ${author.initials}
                        </div>
                        <div class="author-meta">
                            <h3>${author.name}</h3>
                            <a href="#libro-detalle/${encodeURIComponent(author.bookId)}" class="author-book-badge">Ver Libro "${author.bookTitle}"</a>
                        </div>
                    </div>
                    <div class="author-bio">
                        ${author.bio}
                    </div>
                    <div class="author-quote-box">
                        <div class="author-quote-title">De la Contratapa</div>
                        <p class="author-quote">"${author.backCover}"</p>
                    </div>
                </div>
            `;
        });
        container.innerHTML = authorsHTML;
    },

    renderBookDetail(bookId) {
        const book = this.books[bookId];
        const container = document.getElementById('libro-detalle');
        if (!book) {
            container.innerHTML = `<h2>Libro no encontrado</h2><a href="#catalogo" class="btn btn-secondary">Volver al catálogo</a>`;
            return;
        }

        // Calculate Average Rating
        const avg = this.getAverageRating(bookId);

        container.innerHTML = `
            <div class="detail-container">
                <div class="detail-visual">
                    <div class="detail-cover-view">
                        <div class="detail-cover-wrapper" id="detail-cover-wrapper">
                            <div class="detail-cover-side detail-cover-front">
                                <img src="${book.coverFront}" id="detail-cover-front-img" alt="Portada de ${book.title}">
                            </div>
                            <div class="detail-cover-side detail-cover-back">
                                <img src="${book.coverBack}" id="detail-cover-back-img" alt="Contratapa de ${book.title}">
                            </div>
                        </div>
                    </div>
                    
                    ${book.hasBack ? `
                    <div class="detail-cover-controls">
                        <button class="detail-cover-btn active" id="btn-show-front" onclick="app.flipDetailCover(false)">Tapa</button>
                        <button class="detail-cover-btn" id="btn-show-back" onclick="app.flipDetailCover(true)">Contratapa</button>
                    </div>
                    ` : ''}
                </div>
                
                <div class="detail-info">
                    <div style="font-size: 0.85rem; color: var(--color-accent); text-transform: uppercase; font-weight: 700; letter-spacing: 0.15em; margin-bottom: 0.5rem;">La Tríada Editorial</div>
                    <h2>${book.title}</h2>
                    <div class="book-author" style="font-size: 1.1rem; margin-bottom: 0.5rem;">${book.author}</div>
                    <div class="book-artist" style="font-size: 1rem; margin-bottom: 2rem;">${book.artist}</div>
                    
                    <div class="detail-price-box">
                        <span class="price-label">Adquisición Disponible</span>
                        <span class="price-val">$${book.price.toLocaleString('es-AR')} ARS</span>
                    </div>

                    <button onclick="app.addToCart('${book.id}')" class="btn btn-primary" style="width: 100%; padding: 1.1rem; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 3rem;">
                        <i class="fa-solid fa-cart-shopping"></i> Añadir al Carrito de Compras
                    </button>
                    
                    <div class="detail-description">
                        <h3>Reseña de la Publicación</h3>
                        <p>${book.desc}</p>
                    </div>
                    
                    <div class="meta-item" style="background-color: var(--color-bg-alt); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--color-border); margin-bottom: 4rem;">
                        <div class="meta-label">Detalles del Libro</div>
                        <div class="meta-val" style="font-weight: 500; font-size: 0.95rem; color: var(--color-text-muted);">${book.features}</div>
                    </div>

                    <!-- Reviews Section -->
                    <div class="reviews-section">
                        <h3>Opiniones y Calificaciones</h3>
                        
                        <div class="reviews-summary">
                            <div class="rating-avg-box">
                                <div class="rating-avg-num">${avg.toFixed(1)}</div>
                                <div class="stars stars-large">
                                    ${this.getStarsHTML(avg)}
                                </div>
                                <div class="rating-count">Basado en ${book.reviews.length} opiniones</div>
                            </div>
                            
                            <div class="add-review-box">
                                <h4>Deja tu reseña</h4>
                                <form class="review-form" id="new-review-form" onsubmit="app.handleNewReviewSubmit(event, '${book.id}')">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Nombre Completo</label>
                                            <input type="text" id="review-name" required placeholder="Juan Pérez">
                                        </div>
                                        <div class="form-group">
                                            <label>Tu Calificación</label>
                                            <div class="star-rating-select" id="star-selector">
                                                <span onclick="app.setReviewRating(1)" class="star-sel selected" data-value="1"><i class="fa-solid fa-star"></i></span>
                                                <span onclick="app.setReviewRating(2)" class="star-sel selected" data-value="2"><i class="fa-solid fa-star"></i></span>
                                                <span onclick="app.setReviewRating(3)" class="star-sel selected" data-value="3"><i class="fa-solid fa-star"></i></span>
                                                <span onclick="app.setReviewRating(4)" class="star-sel selected" data-value="4"><i class="fa-solid fa-star"></i></span>
                                                <span onclick="app.setReviewRating(5)" class="star-sel selected" data-value="5"><i class="fa-solid fa-star"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Comentario u Opinión</label>
                                        <textarea id="review-text" required rows="3" placeholder="¿Qué te pareció esta publicación?..."></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary" style="align-self: flex-start; padding: 0.6rem 1.5rem; font-size: 0.8rem;">Enviar Comentario</button>
                                </form>
                            </div>
                        </div>

                        <div class="reviews-list">
                            ${book.reviews.map(r => `
                                <div class="review-item">
                                    <div class="review-header">
                                        <div class="reviewer-name">${r.name}</div>
                                        <div class="stars">${this.getStarsHTML(r.rating)}</div>
                                        <div class="review-date">${r.date}</div>
                                    </div>
                                    <div class="review-comment">"${r.comment}"</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Reset temp review rating
        this.setReviewRating(5);
    },

    flipDetailCover(showBack) {
        const cover = document.getElementById('detail-cover-wrapper');
        const btnFront = document.getElementById('btn-show-front');
        const btnBack = document.getElementById('btn-show-back');
        if (showBack) {
            cover.classList.add('flipped');
            btnFront.classList.remove('active');
            btnBack.classList.add('active');
        } else {
            cover.classList.remove('flipped');
            btnFront.classList.add('active');
            btnBack.classList.remove('active');
        }
    },

    // 6. SHOPPING CART LOGIC
    addToCart(bookId) {
        const book = this.books[bookId];
        if (!book) return;

        const existingItem = this.cart.find(item => item.id === bookId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                priceUSD: book.priceUSD,
                coverFront: book.coverFront,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        
        // Open Cart Drawer automatically to show feedback
        document.getElementById('cart-drawer').classList.add('open');
        document.getElementById('cart-drawer-overlay').classList.add('open');
    },

    updateQuantity(bookId, delta) {
        const item = this.cart.find(item => item.id === bookId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            this.cart = this.cart.filter(i => i.id !== bookId);
        }

        this.saveCart();
        this.updateCartUI();
        this.updateOrderSummary();
    },

    removeFromCart(bookId) {
        this.cart = this.cart.filter(item => item.id !== bookId);
        this.saveCart();
        this.updateCartUI();
        this.updateOrderSummary();
    },

    saveCart() {
        localStorage.setItem('latriada_cart', JSON.stringify(this.cart));
    },

    loadCart() {
        const stored = localStorage.getItem('latriada_cart');
        if (stored) {
            try {
                this.cart = JSON.parse(stored);
            } catch (e) {
                this.cart = [];
            }
        }
    },

    updateCartUI() {
        // Update badge count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-badge-count').innerText = totalItems;

        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartSubtotalEl = document.getElementById('cart-subtotal');

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="cart-empty-message"><i class="fa-solid fa-book-open" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--color-border)"></i><br>El carrito de compras está vacío</div>`;
            cartSubtotalEl.innerText = '$0 ARS';
            return;
        }

        let cartHTML = '';
        let subtotal = 0;

        this.cart.forEach(item => {
            subtotal += item.price * item.quantity;
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.coverFront}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-author">${item.author}</div>
                        <div class="cart-item-price">$${item.price.toLocaleString('es-AR')} ARS</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="app.updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="app.updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" onclick="app.removeFromCart('${item.id}')" aria-label="Eliminar item">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = cartHTML;
        cartSubtotalEl.innerText = `$${subtotal.toLocaleString('es-AR')} ARS`;
    },

    // 7. CHECKOUT & SHIPPING SYSTEM
    renderCheckout() {
        this.updateCheckoutShippingAndPayment();
        this.updateOrderSummary();
    },

    updateCheckoutShippingAndPayment() {
        const countrySelect = document.getElementById('checkout-country');
        const stateLabel = document.getElementById('label-state');
        const stateInput = document.getElementById('checkout-state');
        
        const isArgentina = (countrySelect.value === 'AR');
        
        // Update State input placeholder/label
        if (isArgentina) {
            stateLabel.innerText = "Provincia *";
            stateInput.placeholder = "Salta";
            stateInput.onchange = () => {
                if (document.getElementById('shipping-options-container').innerHTML.includes('ship-S')) {
                    this.fetchAgencies(stateInput.value);
                }
            };
        } else {
            stateLabel.innerText = "Estado / Región *";
            stateInput.placeholder = "Región Metropolitana, etc.";
        }

        // Render Shipping options
        const shippingContainer = document.getElementById('shipping-options-container');
        if (isArgentina) {
            shippingContainer.innerHTML = `
                <div style="padding: 1.5rem; background: var(--color-bg-alt); border-radius: 8px; border: 1px solid var(--color-border); text-align: center;">
                    <p style="color: var(--color-text-muted); margin-bottom: 0;">Ingresa tu Código Postal y Provincia para ver las opciones de envío de Correo Argentino.</p>
                </div>
            `;
            this.selectedShippingCost = 0;
            this.selectedShippingType = null;
            this.selectedShippingAgency = null;
            document.getElementById('checkout-zip').addEventListener('input', () => this.fetchShippingRates());
        } else {
            this.selectedShippingCost = 0;
            this.selectedShippingType = 'international';
            this.selectedShippingAgency = null;
            shippingContainer.innerHTML = `
                <div class="shipping-option selected" onclick="app.selectShippingOption('international')">
                    <input type="radio" id="ship-int" name="shipping-type" checked>
                    <div class="shipping-option-details">
                        <div class="shipping-option-title">DHL Express / FedEx Internacional</div>
                        <div class="shipping-option-desc">Envío internacional prioritario Courier con seguimiento (5 a 10 días hábiles)</div>
                    </div>
                    <div class="shipping-option-price">$0 USD (Gratis)</div>
                </div>
            `;
        }

        // Render Payment options
        const paymentContainer = document.getElementById('payment-methods-container');
        if (isArgentina) {
            paymentContainer.innerHTML = `
                <div class="payment-method-card selected" id="pay-card-mp" onclick="app.selectPaymentMethod('mercadopago')">
                    <img src="https://logotipode.com/wp-content/uploads/2021/10/mercado-pago-logo.png" alt="Mercado Pago Logo" class="payment-method-logo" onerror="this.src='assets/logo_icon.png'">
                    <div class="payment-method-title">Mercado Pago</div>
                    <div class="payment-method-desc">Tarjetas de crédito/débito, Pago Fácil/RapiPago, dinero en cuenta</div>
                </div>
                <div class="payment-method-card" id="pay-card-paypal" onclick="app.selectPaymentMethod('paypal')" style="margin-top: 1rem;">
                    <img src="https://pngimg.com/d/paypal_PNG22.png" alt="PayPal Logo" class="payment-method-logo" onerror="this.src='assets/logo_icon.png'">
                    <div class="payment-method-title">PayPal</div>
                    <div class="payment-method-desc">Tarjetas internacionales o saldo en tu cuenta PayPal (en USD)</div>
                </div>
            `;
            this.selectedPaymentMethod = 'mercadopago';
        } else {
            paymentContainer.innerHTML = `
                <div class="payment-method-card selected" id="pay-card-paypal" onclick="app.selectPaymentMethod('paypal')">
                    <img src="https://pngimg.com/d/paypal_PNG22.png" alt="PayPal Logo" class="payment-method-logo" onerror="this.src='assets/logo_icon.png'">
                    <div class="payment-method-title">PayPal</div>
                    <div class="payment-method-desc">Saldo PayPal o tarjetas internacionales (Visa, Mastercard, AMEX)</div>
                </div>
            `;
            this.selectedPaymentMethod = 'paypal';
        }

        this.updateOrderSummary();
    },

    selectShippingOption(optionId, cost = 0) {
        document.querySelectorAll('.shipping-option').forEach(el => {
            el.classList.remove('selected');
        });
        const selectedEl = document.querySelector(`.shipping-option[onclick*="'${optionId}'"]`) || document.querySelector(`.shipping-option[onclick*="('${optionId}'"]`);
        if (selectedEl) {
            selectedEl.classList.add('selected');
            const radio = selectedEl.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        }

        this.selectedShippingType = optionId;
        this.selectedShippingCost = cost;
        
        if (optionId.startsWith('S')) {
            const stateInput = document.getElementById('checkout-state');
            this.fetchAgencies(stateInput.value);
            const agenciesContainer = document.getElementById('agencies-container');
            if (agenciesContainer) agenciesContainer.style.display = 'block';
        } else {
            this.selectedShippingAgency = null;
            const agenciesContainer = document.getElementById('agencies-container');
            if (agenciesContainer) agenciesContainer.style.display = 'none';
        }
        
        this.updateOrderSummary();
    },

    selectAgency(agencyCode) {
        this.selectedShippingAgency = agencyCode;
    },

    async fetchShippingRates() {
        const countrySelect = document.getElementById('checkout-country');
        const zipInput = document.getElementById('checkout-zip');
        const shippingContainer = document.getElementById('shipping-options-container');
        
        if (!countrySelect || countrySelect.value !== 'AR' || !zipInput || !zipInput.value || zipInput.value.length < 4) {
            return;
        }

        shippingContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--color-accent);"></i>
                <p style="margin-top: 1rem; color: var(--color-text-muted);">Cotizando envíos...</p>
            </div>
        `;

        try {
            const totalQuantity = this.cart.reduce((acc, item) => acc + item.quantity, 0);
            const res = await fetch(`${this.supabaseUrl}/functions/v1/correo-argentino-rates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseAnonKey
                },
                body: JSON.stringify({ 
                    postalCodeDestination: zipInput.value,
                    totalQuantity: totalQuantity
                })
            });

            if (!res.ok) throw new Error("No se pudieron cargar las tarifas de envío");
            
            const data = await res.json();
            const rates = data.rates || data.rates?.rates || []; 
            let ratesArray = Array.isArray(rates) ? rates : (Array.isArray(data.rates) ? data.rates : data);

            if (!Array.isArray(ratesArray) || ratesArray.length === 0) {
                shippingContainer.innerHTML = `<p style="color: var(--color-error);">No hay opciones de envío para este código postal.</p>`;
                return;
            }

            let html = '';
            let firstId = null;
            let firstCost = 0;

            ratesArray.forEach((rate, index) => {
                if (!rate.deliveredType) return;
                const typeId = `${rate.deliveredType}_${rate.productType || 'CP'}`;
                const cost = Number(rate.price);
                const isSelected = index === 0;
                
                if (isSelected) {
                    firstId = typeId;
                    firstCost = cost;
                }

                html += `
                    <div class="shipping-option ${isSelected ? 'selected' : ''}" onclick="app.selectShippingOption('${typeId}', ${cost})">
                        <input type="radio" id="ship-${typeId}" name="shipping-type" ${isSelected ? 'checked' : ''}>
                        <div class="shipping-option-details">
                            <div class="shipping-option-title">${rate.productName || 'Correo Argentino'} a ${rate.deliveredType === 'S' ? 'Sucursal' : 'Domicilio'}</div>
                            <div class="shipping-option-desc">Tiempo estimado: ${rate.deliveryTimeMin} a ${rate.deliveryTimeMax} días hábiles</div>
                        </div>
                        <div class="shipping-option-price">$${cost.toLocaleString('en-US')} ARS</div>
                    </div>
                `;
            });
            
            html += `<div id="agencies-container" style="display: none; margin-top: 1rem;"></div>`;
            shippingContainer.innerHTML = html;
            
            if (firstId) {
                this.selectShippingOption(firstId, firstCost);
            }

        } catch (error) {
            console.error("Error fetching rates:", error);
            shippingContainer.innerHTML = `<p style="color: var(--color-error);">Error al cotizar el envío. Intenta nuevamente.</p>`;
        }
    },

    async fetchAgencies(provinceName) {
        const agenciesContainer = document.getElementById('agencies-container');
        if (!agenciesContainer || !provinceName) return;

        const provinceMap = {
            "buenos aires": "B", "capital federal": "C", "caba": "C", "catamarca": "K", "chaco": "H", 
            "chubut": "U", "cordoba": "X", "córdoba": "X", "corrientes": "W", "entre rios": "E", 
            "entre ríos": "E", "formosa": "P", "jujuy": "Y", "la pampa": "L", "la rioja": "F", 
            "mendoza": "M", "misiones": "N", "neuquen": "Q", "neuquén": "Q", "rio negro": "R", 
            "río negro": "R", "salta": "A", "san juan": "J", "san luis": "D", "santa cruz": "Z", 
            "santa fe": "S", "santiago del estero": "G", "tierra del fuego": "V", "tucuman": "T", "tucumán": "T"
        };
        const pCode = provinceMap[provinceName.toLowerCase().trim()] || "A";

        agenciesContainer.innerHTML = `<p style="font-size: 0.9rem; color: var(--color-text-muted);">Cargando sucursales...</p>`;

        try {
            const res = await fetch(`${this.supabaseUrl}/functions/v1/correo-argentino-agencies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseAnonKey
                },
                body: JSON.stringify({ provinceCode: pCode })
            });

            if (!res.ok) throw new Error("Failed to load agencies");
            
            const data = await res.json();
            const agencies = data.agencies || [];
            
            if (agencies.length === 0) {
                agenciesContainer.innerHTML = `<p style="color: var(--color-error); font-size: 0.9rem;">No se encontraron sucursales en tu provincia.</p>`;
                return;
            }

            let selectHtml = `
                <label style="font-size: 0.9rem; font-weight: 500; margin-bottom: 0.5rem; display: block;">Selecciona la Sucursal:</label>
                <select id="checkout-agency" class="form-input" style="width: 100%; margin-bottom: 1rem;" onchange="app.selectAgency(this.value)">
                    <option value="" disabled selected>Elige una sucursal...</option>
            `;

            agencies.forEach(ag => {
                const street = ag.location?.address?.streetName || '';
                const number = ag.location?.address?.streetNumber || '';
                const loc = ag.location?.locality || '';
                selectHtml += `<option value="${ag.code}">${ag.name} - ${street} ${number} (${loc})</option>`;
            });

            selectHtml += `</select>`;
            agenciesContainer.innerHTML = selectHtml;

        } catch (error) {
            console.error("Error fetching agencies:", error);
            agenciesContainer.innerHTML = `<p style="color: var(--color-error); font-size: 0.9rem;">Error al cargar las sucursales.</p>`;
        }
    },

    selectPaymentMethod(method) {
        this.selectedPaymentMethod = method;
        const mpCard = document.getElementById('pay-card-mp');
        const ppCard = document.getElementById('pay-card-paypal');
        
        if (mpCard) mpCard.classList.remove('selected');
        if (ppCard) ppCard.classList.remove('selected');
        
        if (method === 'mercadopago' && mpCard) {
            mpCard.classList.add('selected');
        } else if (method === 'paypal' && ppCard) {
            ppCard.classList.add('selected');
        }
        
        this.updateOrderSummary();
    },

    async updateOrderSummary() {
        const countrySelect = document.getElementById('checkout-country');
        const isArgentina = (countrySelect && countrySelect.value === 'AR');
        
        const summaryItemsList = document.getElementById('summary-items-list');
        const summarySubtotal = document.getElementById('summary-subtotal');
        const summaryShipping = document.getElementById('summary-shipping');
        const summaryTotal = document.getElementById('summary-total');
        const checkoutTotalBtn = document.getElementById('checkout-submit-btn');

        if (this.cart.length === 0) {
            if (summaryItemsList) {
                summaryItemsList.innerHTML = `<div class="cart-empty-message">No hay ítems en tu compra</div>`;
            }
            if (summarySubtotal) summarySubtotal.innerText = isArgentina ? '$0 ARS' : '$0 USD';
            if (summaryShipping) summaryShipping.innerText = isArgentina ? '$0 ARS' : '$0 USD';
            if (summaryTotal) summaryTotal.innerText = isArgentina ? '$0 ARS' : '$0 USD';
            if (checkoutTotalBtn) checkoutTotalBtn.innerText = "Continuar al Pago";
            return;
        }

        let isUSD = !isArgentina || (isArgentina && this.selectedPaymentMethod === 'paypal');
        let exchangeRate = 1000;

        if (isArgentina && isUSD) {
            try {
                const res = await fetch("https://dolarapi.com/v1/dolares/oficial");
                if (res.ok) {
                    const data = await res.json();
                    exchangeRate = data.venta || 1000;
                }
            } catch(e) {}
        }

        let itemsHTML = '';
        let subtotal = 0;

        this.cart.forEach(item => {
            if (!isUSD) {
                subtotal += item.price * item.quantity;
                itemsHTML += `
                    <div class="summary-item">
                        <span class="summary-item-name">${item.title} (x${item.quantity})</span>
                        <span class="summary-item-price">$${(item.price * item.quantity).toLocaleString('es-AR')} ARS</span>
                    </div>
                `;
            } else {
                subtotal += item.priceUSD * item.quantity;
                itemsHTML += `
                    <div class="summary-item">
                        <span class="summary-item-name">${item.title} (x${item.quantity})</span>
                        <span class="summary-item-price">$${(item.priceUSD * item.quantity).toLocaleString('en-US')} USD</span>
                    </div>
                `;
            }
        });

        if (summaryItemsList) summaryItemsList.innerHTML = itemsHTML;

        // Shipping price
        let shippingARS = isArgentina ? (this.selectedShippingCost || 0) : 0;
        let shippingStr = "";
        let finalShipping = 0;

        if (isArgentina) {
            if (isUSD) {
                finalShipping = shippingARS > 0 ? Number((shippingARS / exchangeRate).toFixed(2)) : 0;
                shippingStr = finalShipping > 0 ? `$${finalShipping.toLocaleString('en-US')} USD` : 'Gratis';
            } else {
                finalShipping = shippingARS;
                shippingStr = finalShipping > 0 ? `$${finalShipping.toLocaleString('es-AR')} ARS` : 'Gratis';
            }
        } else {
            finalShipping = 0;
            shippingStr = 'Gratis';
        }

        const total = subtotal + finalShipping;

        if (summarySubtotal) summarySubtotal.innerText = isUSD ? `$${subtotal.toLocaleString('en-US')} USD` : `$${subtotal.toLocaleString('es-AR')} ARS`;
        if (summaryShipping) summaryShipping.innerText = shippingStr;
        if (summaryTotal) summaryTotal.innerText = isUSD ? `$${total.toLocaleString('en-US')} USD` : `$${total.toLocaleString('es-AR')} ARS`;
        if (checkoutTotalBtn) checkoutTotalBtn.innerText = isUSD ? `Pagar $${total.toLocaleString('en-US')} USD` : `Pagar $${total.toLocaleString('es-AR')} ARS`;
    },

    // 8. PAYMENT SIMULATION
    openPaymentGateway() {
        const countrySelect = document.getElementById('checkout-country');
        const isArgentina = (countrySelect.value === 'AR');
        
        const modal = document.getElementById('payment-modal');
        const modalCard = document.getElementById('payment-modal-card');
        
        modal.classList.add('open');
        modalCard.innerHTML = `
            <div class="payment-status-screen">
                <div style="margin: 2rem 0;">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 3.5rem; color: var(--color-accent)"></i>
                </div>
                <h4 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 1rem;">Preparando tu Pago</h4>
                <p style="color: var(--color-text-muted);">Por favor, espera un momento mientras te conectamos con la pasarela de pagos...</p>
            </div>
        `;

        const checkoutData = {
            customer_name: document.getElementById('checkout-name').value,
            customer_email: document.getElementById('checkout-email').value,
            customer_phone: document.getElementById('checkout-phone').value,
            shipping_address: document.getElementById('checkout-address').value,
            shipping_city: document.getElementById('checkout-city').value,
            shipping_state: document.getElementById('checkout-state').value,
            shipping_zip: document.getElementById('checkout-zip').value,
            shipping_country: countrySelect.value,
            payment_method: this.selectedPaymentMethod || (isArgentina ? 'mercadopago' : 'paypal'),
            shipping_type: this.selectedShippingType,
            shipping_agency: this.selectedShippingAgency,
            shipping_cost_frontend: this.selectedShippingCost,
            cart: this.cart.map(item => ({ id: item.id, quantity: item.quantity })),
            site_url: `${window.location.protocol}//${window.location.host}${window.location.pathname}`
        };

        fetch(`${this.supabaseUrl}/functions/v1/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.supabaseAnonKey
            },
            body: JSON.stringify(checkoutData)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.error || 'Error en el servidor') });
            }
            return res.json();
        })
        .then(data => {
            if (data.url) {
                sessionStorage.setItem('last_order_id', data.order_id);
                window.location.href = data.url;
            } else {
                throw new Error("No se recibió la URL de pago.");
            }
        })
        .catch(err => {
            console.error("Checkout error:", err);
            modalCard.innerHTML = `
                <div class="payment-status-screen">
                    <div class="status-icon failure">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <h3 class="status-title" style="color: #c62828;">Error en el Checkout</h3>
                    <p class="status-desc">${err.message}</p>
                    <button onclick="app.closePaymentModal()" class="btn btn-secondary" style="padding: 0.6rem 1.5rem;">
                        Cerrar y Reintentar
                    </button>
                </div>
            `;
        });
    },

    closePaymentModal() {
        document.getElementById('payment-modal').classList.remove('open');
    },

    getHashParams() {
        const hash = window.location.hash;
        const qPos = hash.indexOf('?');
        if (qPos === -1) return {};
        const search = hash.substring(qPos + 1);
        const params = {};
        search.split('&').forEach(pair => {
            const [key, val] = pair.split('=');
            if (key) params[decodeURIComponent(key)] = decodeURIComponent(val || '');
        });
        return params;
    },

    handleCheckoutSuccess() {
        const successBox = document.getElementById('success-details-box');
        const params = this.getHashParams();
        const gateway = params.gateway;
        const orderId = params.order_id || sessionStorage.getItem('last_order_id');
        
        // PayPal appends token to the query string, not the hash in some cases
        const urlParams = new URLSearchParams(window.location.search);
        const token = params.token || urlParams.get('token');

        if (!orderId) {
            successBox.innerHTML = `
                <p style="color: #c62828;"><strong>Error:</strong> No se pudo recuperar el identificador del pedido.</p>
                <p>Si realizaste el pago, por favor contáctanos con tu comprobante.</p>
            `;
            return;
        }

        if (gateway === 'paypal' && token) {
            successBox.innerHTML = `
                <div style="text-align: center; padding: 1rem 0;">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: #0070ba; margin-bottom: 1rem;"></i>
                    <p>Capturando fondos y verificando tu pago con PayPal...</p>
                </div>
            `;

            fetch(`${this.supabaseUrl}/functions/v1/paypal-capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseAnonKey
                },
                body: JSON.stringify({
                    paypal_order_id: token,
                    order_id: orderId
                })
            })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.error || 'Error al procesar la captura') });
                }
                return res.json();
            })
            .then(data => {
                this.cart = [];
                this.saveCart();
                this.updateCartUI();

                successBox.innerHTML = `
                    <div style="margin-bottom: 0.5rem;"><strong>Número de Pedido:</strong> #${orderId}</div>
                    <div style="margin-bottom: 0.5rem;"><strong>Transacción:</strong> Aprobada y capturada por PayPal</div>
                    <div><strong>Detalle de Envío:</strong> Enviaremos el código de seguimiento prioritario a tu e-mail.</div>
                `;
                sessionStorage.removeItem('last_order_id');
            })
            .catch(err => {
                console.error("PayPal Capture error:", err);
                successBox.innerHTML = `
                    <p style="color: #c62828;"><strong>Error en captura de PayPal:</strong> ${err.message}</p>
                    <p>Por favor, contáctanos si se te ha descontado saldo pero no ves la orden como completada.</p>
                `;
            });
        } else if (gateway === 'mercadopago') {
            successBox.innerHTML = `
                <div style="text-align: center; padding: 1rem 0;">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: #009ee3; margin-bottom: 1rem;"></i>
                    <p>Verificando acreditación de pago de Mercado Pago...</p>
                </div>
            `;

            let attempts = 0;
            const maxAttempts = 6;

            const checkStatus = () => {
                attempts++;
                fetch(`${this.supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=status`, {
                    headers: {
                        'apikey': this.supabaseAnonKey,
                        'Authorization': `Bearer ${this.supabaseAnonKey}`
                    }
                })
                .then(res => res.json())
                .then(orders => {
                    if (orders && orders.length > 0) {
                        const order = orders[0];
                        if (order.status === 'paid') {
                            this.cart = [];
                            this.saveCart();
                            this.updateCartUI();

                            successBox.innerHTML = `
                                <div style="margin-bottom: 0.5rem;"><strong>Número de Pedido:</strong> #${orderId}</div>
                                <div style="margin-bottom: 0.5rem;"><strong>Transacción:</strong> Acreditada por Mercado Pago</div>
                                <div><strong>Detalle de Envío:</strong> El correo prioritario de envío nacional certificado será enviado a tu e-mail.</div>
                            `;
                            sessionStorage.removeItem('last_order_id');
                        } else if (attempts < maxAttempts) {
                            setTimeout(checkStatus, 2000);
                        } else {
                            this.cart = [];
                            this.saveCart();
                            this.updateCartUI();
                            
                            successBox.innerHTML = `
                                <div style="margin-bottom: 0.5rem;"><strong>Número de Pedido:</strong> #${orderId}</div>
                                <div style="margin-bottom: 0.5rem;"><strong>Transacción:</strong> Procesando (Pendiente / Acreditándose)</div>
                                <div style="margin-top: 1rem; color: var(--color-text-muted);">El pago se está procesando. Una vez acreditado por Mercado Pago, tu pedido se despachará automáticamente. Te enviaremos un e-mail con la confirmación.</div>
                            `;
                            sessionStorage.removeItem('last_order_id');
                        }
                    } else {
                        throw new Error("No se encontró la orden.");
                    }
                })
                .catch(err => {
                    console.error("Error polling order status:", err);
                    successBox.innerHTML = `
                        <div style="margin-bottom: 0.5rem;"><strong>Número de Pedido:</strong> #${orderId}</div>
                        <div><strong>Transacción:</strong> Estado en verificación</div>
                        <div style="margin-top: 1rem; color: var(--color-text-muted);">No pudimos verificar el estado del pago al instante, pero procesaremos tu orden tan pronto como Mercado Pago notifique la acreditación.</div>
                    `;
                });
            };

            setTimeout(checkStatus, 1000);
        } else {
            successBox.innerHTML = `
                <div style="margin-bottom: 0.5rem;"><strong>Número de Pedido:</strong> #${orderId}</div>
                <div><strong>Transacción:</strong> Recibida</div>
                <div style="margin-top: 1rem;">Procesaremos tu pedido a la brevedad.</div>
            `;
        }
    },

    handleCheckoutFailure() {
        const params = this.getHashParams();
        const orderId = params.order_id || sessionStorage.getItem('last_order_id');
        const detailText = document.getElementById('failure-details-text');
        
        if (orderId) {
            detailText.innerText = `Referencia de orden interna: #${orderId}`;
        } else {
            detailText.innerText = "";
        }
    },

    finalizePurchaseOrder() {
        this.closePaymentModal();
        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.updateOrderSummary();
        
        // Reset checkout form fields
        const form = document.getElementById('checkout-form');
        if (form) form.reset();
        
        // Redirect to Home
        window.location.hash = '#inicio';
    },

    // 9. REVIEWS SYSTEM
    getAverageRating(bookId) {
        const book = this.books[bookId];
        if (!book || book.reviews.length === 0) return 0;
        const sum = book.reviews.reduce((acc, r) => acc + r.rating, 0);
        return sum / book.reviews.length;
    },

    getStarsHTML(rating) {
        let starsHTML = '';
        const rounded = Math.round(rating);
        for (let i = 1; i <= 5; i++) {
            if (i <= rounded) {
                starsHTML += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star"></i>';
            }
        }
        return starsHTML;
    },

    setReviewRating(rating) {
        this.tempReviewStars = rating;
        const selector = document.getElementById('star-selector');
        if (!selector) return;
        
        const stars = selector.querySelectorAll('.star-sel');
        stars.forEach(s => {
            const val = parseInt(s.getAttribute('data-value'));
            if (val <= rating) {
                s.classList.add('selected');
            } else {
                s.classList.remove('selected');
            }
        });
    },

    handleNewReviewSubmit(e, bookId) {
        e.preventDefault();
        const book = this.books[bookId];
        if (!book) return;

        const nameEl = document.getElementById('review-name');
        const textEl = document.getElementById('review-text');

        if (!nameEl.value || !textEl.value) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const newReview = {
            name: nameEl.value.trim(),
            rating: this.tempReviewStars,
            date: new Date().toLocaleDateString('es-AR'),
            comment: textEl.value.trim()
        };

        // Add review
        book.reviews.unshift(newReview);
        
        // Save to localStorage
        this.saveUserReviews();
        
        // Rerender book details to show the new review
        this.renderBookDetail(bookId);
    },

    saveUserReviews() {
        const dataToStore = {};
        Object.keys(this.books).forEach(bookId => {
            // Extract only user-added reviews (or store all if modified)
            dataToStore[bookId] = this.books[bookId].reviews;
        });
        localStorage.setItem('modesta_reviews', JSON.stringify(dataToStore));
    },

    loadUserReviews() {
        const stored = localStorage.getItem('modesta_reviews');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                Object.keys(parsed).forEach(bookId => {
                    if (this.books[bookId]) {
                        // Merge or replace reviews list
                        // To preserve the original default review, let's filter out duplicates or replace.
                        // Since we load from storage, we can just assign, ensuring original is kept.
                        this.books[bookId].reviews = parsed[bookId];
                    }
                });
            } catch (e) {
                console.error("Failed to load user reviews:", e);
            }
        }
    }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Expose application globally for onclick handlers
window.app = app;
