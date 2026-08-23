-- Update existing books with their detailed information
UPDATE public.books SET 
    artist = 'Virginia Montaldi (Pinturas)',
    description = 'Este libro es un encuentro entre dos formas de pensamiento: la escritura de Mercedes Miralpeix y la pintura de Virginia Montaldi. Ni una teoría que explica, ni una obra que ilustra: aquí lo que se abre es un diálogo crítico, feminista y situado. Las pinturas de Montaldi convocan una experiencia sensible del arte, y Miralpeix responde con una escritura que piensa desde el cuerpo y sus pliegues. Una invitación a mirar de otra manera.',
    features = 'Encuadernación cosida a hilo, papel ahuesado premium de 90g, reproducción de obras a color.',
    cover_front_url = 'assets/cover_posturas.jpg',
    cover_back_url = 'assets/cover_posturas.jpg',
    has_back = false
WHERE id = 'posturas';

UPDATE public.books SET 
    artist = 'Sergio Díaz (Intervenciones sobre billetes)',
    description = 'Un diálogo interdisciplinar sobre el valor, la creencia y la memoria del dinero. Jorge F. Pantaleón retoma su larga trayectoria investigando nuestra relación con la economía y la entrelaza con las provocadoras intervenciones artísticas de Sergio Díaz sobre billetes. Desde el norte de Argentina, surge este ensayo luminoso que desarma el sentido común económico y propone otra forma de pensar el arte y el intercambio.',
    features = 'Colección Ensayos. Rústica con solapas. Prólogo de Ariel Wilkis. Presentación de Gonzalo Aguirre. 150 páginas.',
    cover_front_url = 'assets/cover_circulantes_front.png',
    cover_back_url = 'assets/cover_circulantes_back.png',
    has_back = true
WHERE id = 'circulantes';

UPDATE public.books SET 
    artist = 'Roly Arias (Dibujos)',
    description = 'En la época de la imagen digital y su hiper-visualización, este libro explora los dibujos de Roly Arias como un espacio donde los límites se transforman y contaminan. La escritura reflexiva de Hernán Ulm nos invita a sumergirnos en esta experiencia estética, política y colectiva del presente. Memoria viva de un ojo estallado en cruce con la historia, el amor y la discrepancia.',
    features = 'Diseño apaisado de colección, tapa blanda con solapas, papel satinado de alta calidad.',
    cover_front_url = 'assets/cover_desborde_front.png',
    cover_back_url = 'assets/cover_desborde_back.png',
    has_back = true
WHERE id = 'desborde';

-- Insert reviews
INSERT INTO public.reviews (book_id, name, rating, date, comment)
VALUES
    ('posturas', 'Pedro Marcelo Ibarra', 5, '10/06/2026', 'Este libro es un encuentro. Entre dos formas de pensamiento. Entre la escritura de Mercedes Miralpeix y la pintura de Virginia Montaldi. Ni una teoría que explica, ni una obra que ilustra: aquí lo que se abre es un diálogo. Una conversación hecha de pausas, gestos, desvíos. Una poética crítica, feminista y situada, que piensa con las obras, no sobre ellas. Que no busca cerrar sentidos, sino habilitar nuevas formas de mirar, de sentir, de decir.'),
    ('circulantes', 'Pedro Marcelo Ibarra', 5, '10/06/2026', 'Este libro es, ante todo, un intercambio: entre disciplinas, entre territorios, entre imaginaciones, entre imágenes, entre reflexiones, entre personas. Jorge F. Pantaleón retoma su larga trayectoria investigando cómo nos relacionamos con el dinero —como valor, como creencia, como memoria y como vínculo— y la entrelaza con las provocadoras intervenciones artísticas de Sergio Díaz sobre los billetes. Así surge una conversación situada y desobediente.'),
    ('desborde', 'Pedro Marcelo Ibarra', 5, '10/06/2026', 'En la época de la imagen digital y su hiper-visualización, este libro se centra en el dibujo de Roly Arias. Cultiva una mirada que se enfoca en los límites del dibujo, desatando así su potencia. En este libro el límite no se define como el punto donde algo termina, sino es el espacio donde ese algo se transforma, se contamina y se potencia. La escritura reflexiva de Hernán Ulm nos invita a mirar los dibujos de Roly.');
