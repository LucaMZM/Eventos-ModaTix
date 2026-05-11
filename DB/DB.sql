DROP DATABASE IF EXISTS modatix;
CREATE DATABASE modatix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE modatix;

SET NAMES utf8mb4;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
START TRANSACTION;

CREATE TABLE cities (
    id_city INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    city_image VARCHAR(255),
    description TEXT,
    UNIQUE KEY uk_city_name (city_name)
);

CREATE TABLE venues (
    id_venue INT AUTO_INCREMENT PRIMARY KEY,
    id_city INT NOT NULL,
    venue_name VARCHAR(150) NOT NULL,
    address VARCHAR(200),
    capacity INT,
    venue_image VARCHAR(255),
    description TEXT,
    FOREIGN KEY (id_city) REFERENCES cities(id_city)
);

CREATE TABLE event_types (
    id_event_type INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    type_image VARCHAR(255),
    description TEXT,
    UNIQUE KEY uk_type_name (type_name)
);

CREATE TABLE categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_image VARCHAR(255),
    description TEXT,
    UNIQUE KEY uk_category_name (category_name)
);

CREATE TABLE brands (
    id_brand INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(120) NOT NULL,
    brand_logo VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    UNIQUE KEY uk_brand_name (brand_name)
);

CREATE TABLE models (
    id_model INT AUTO_INCREMENT PRIMARY KEY,
    id_brand INT NULL,
    model_name VARCHAR(150) NOT NULL,
    stage_name VARCHAR(150),
    nationality VARCHAR(100),
    age INT,
    height_cm INT,
    bio TEXT,
    main_image VARCHAR(255),
    instagram VARCHAR(255),
    is_featured TINYINT(1) DEFAULT 0,
    FOREIGN KEY (id_brand) REFERENCES brands(id_brand) ON DELETE SET NULL
);

CREATE TABLE model_images (
    id_image INT AUTO_INCREMENT PRIMARY KEY,
    id_model INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(150),
    FOREIGN KEY (id_model) REFERENCES models(id_model) ON DELETE CASCADE
);

CREATE TABLE events (
    id_event INT AUTO_INCREMENT PRIMARY KEY,
    id_city INT NOT NULL,
    id_venue INT NOT NULL,
    id_event_type INT NOT NULL,
    id_brand INT NULL,
    event_name VARCHAR(180) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    short_description VARCHAR(255),
    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    lat DECIMAL(10,8) NULL,
    lon DECIMAL(11,8) NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    end_date DATETIME NULL,
    poster_image VARCHAR(255),
    dress_code VARCHAR(100),
    season_name VARCHAR(100),
    status ENUM('activo','cancelado','proximamente','finalizado') DEFAULT 'activo',
    featured TINYINT(1) DEFAULT 0,
    visits INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_event_slug (slug),
    FOREIGN KEY (id_city) REFERENCES cities(id_city),
    FOREIGN KEY (id_venue) REFERENCES venues(id_venue),
    FOREIGN KEY (id_event_type) REFERENCES event_types(id_event_type),
    FOREIGN KEY (id_brand) REFERENCES brands(id_brand) ON DELETE SET NULL
);

CREATE TABLE event_models (
    id_event INT NOT NULL,
    id_model INT NOT NULL,
    role_name VARCHAR(100),
    appearance_order INT DEFAULT 1,
    PRIMARY KEY (id_event, id_model),
    FOREIGN KEY (id_event) REFERENCES events(id_event) ON DELETE CASCADE,
    FOREIGN KEY (id_model) REFERENCES models(id_model) ON DELETE CASCADE
);

CREATE TABLE event_categories (
    id_event INT NOT NULL,
    id_category INT NOT NULL,
    PRIMARY KEY (id_event, id_category),
    FOREIGN KEY (id_event) REFERENCES events(id_event) ON DELETE CASCADE,
    FOREIGN KEY (id_category) REFERENCES categories(id_category)
);

CREATE TABLE event_images (
    id_image INT AUTO_INCREMENT PRIMARY KEY,
    id_event INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(150),
    FOREIGN KEY (id_event) REFERENCES events(id_event) ON DELETE CASCADE
);

CREATE TABLE extras (
    id_extra INT AUTO_INCREMENT PRIMARY KEY,
    extra_name VARCHAR(100) NOT NULL,
    icon_class VARCHAR(120) NOT NULL,
    UNIQUE KEY uk_extra_name (extra_name)
);

CREATE TABLE event_extras (
    id_event INT NOT NULL,
    id_extra INT NOT NULL,
    PRIMARY KEY (id_event, id_extra),
    FOREIGN KEY (id_event) REFERENCES events(id_event) ON DELETE CASCADE,
    FOREIGN KEY (id_extra) REFERENCES extras(id_extra) ON DELETE CASCADE
);

INSERT INTO cities (city_name, city_image, description) VALUES
('Valencia', 'https://fotografias-2.larazon.es/clipping/cmsimages02/2024/11/12/EE5B4C33-FBBD-408D-91FE-0E884FC9506B/valencia_98.jpg?crop=612,344,x0,y31&width=1900&height=1069&optimize=low&format=webply', 'Ciudad mediterránea con gran actividad cultural y de moda'),
('Madrid', 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFkcmlkJTIwY2l0eXxlbnwwfHwwfHx8MA%3D%3D', 'Capital con eventos exclusivos y pasarelas importantes'),
('Barcelona', 'view/img/background.png', 'Ciudad creativa ideal para eventos de diseño y lifestyle');

INSERT INTO venues (id_city, venue_name, address, capacity, venue_image, description) VALUES
(1, 'Palacio Moda Valencia', 'Av. de Francia 20', 1200, 'https://upload.wikimedia.org/wikipedia/commons/5/52/Valencia_-_Monasterio_de_San_Miguel_de_los_Reyes_05_2017-05-01.jpg', 'Espacio elegante para desfiles y presentaciones'),
(2, 'Madrid Fashion Hall', 'Calle Serrano 55', 2000, 'https://images.griddo.udit.es/c/cover/q/70/w/1920/h/1080/p/center/f/jpeg/pabelloncristal', 'Recinto premium para eventos de moda'),
(3, 'Barcelona Runway Space', 'Passeig de Gràcia 101', 1500, 'view/img/background.png', 'Ubicación moderna para pasarelas y showrooms');

INSERT INTO event_types (type_name, type_image, description) VALUES
('Desfile', 'https://cdn-icons-png.flaticon.com/512/11002/11002841.png', 'Evento de pasarela con modelos y colección principal'),
('Presentación', 'https://marketplace.canva.com/EAGphQAKwTs/1/0/1600w/canva-presentaci%C3%B3n-diapositivas-moda-colecci%C3%B3n-ropa-elegante-ilustrado-minimalista-beige-negro-kPwKWwnbrsA.jpg', 'Presentación de marca, colección o temporada'),
('Gala', 'https://imagenes.elpais.com/resizer/v2/36BRBHD4SVCELPHEX7ULSY27Y4.jpg?auth=9110b9cdc0d9b1416c609cff1e237417f37a4cbdd6868f06d4f4c4c620f015c6&width=1200', 'Evento formal con invitados y exhibición visual');

INSERT INTO categories (category_name, category_image, description) VALUES
('Alta Costura', 'view/img/background.png', 'Moda de lujo y diseño exclusivo'),
('Streetwear', 'view/img/background.png', 'Moda urbana y contemporánea'),
('Minimalista', 'view/img/background.png', 'Diseño limpio, sobrio y moderno'),
('VIP', 'view/img/background.png', 'Eventos o accesos de perfil premium');

INSERT INTO brands (brand_name, brand_logo, website, description) VALUES
('ModaTix Studio', 'view/img/brands/modatix_studio.jpg', 'https://modatix.com', 'Marca principal del proyecto'),
('Atelier Nova', 'view/img/brands/atelier_nova.png', 'https://ateliernova.com', 'Firma centrada en elegancia contemporánea'),
('Urban Pulse', 'view/img/brands/urban_pulse.png', 'https://urbanpulse.com', 'Marca enfocada en streetwear y cultura urbana');

INSERT INTO models (id_brand, model_name, stage_name, nationality, age, height_cm, bio, main_image, instagram, is_featured) VALUES
(1, 'Luca M.', 'Luca Maz', 'España', 20, 183, 'Modelo principal del proyecto con imagen sobria y moderna.', 'view/img/background.png', 'https://instagram.com/lucamaz', 1),
(2, 'Sofía R.', 'Sofi Rae', 'España', 22, 177, 'Modelo editorial especializada en pasarela y campañas.', 'view/img/background.png', 'https://instagram.com/sofirae', 1),
(3, 'Adrián V.', 'Adri V', 'España', 24, 185, 'Perfil masculino para colecciones urbanas y premium.', 'view/img/background.png', 'https://instagram.com/adriv', 0);

INSERT INTO model_images (id_model, image_url, alt_text) VALUES
(1, 'view/img/background.png', 'Luca en sesión editorial'),
(1, 'view/img/background.png', 'Luca en desfile'),
(2, 'view/img/background.png', 'Sofía en pasarela'),
(3, 'view/img/background.png', 'Adrián en campaña urbana');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
) VALUES
(1, 1, 1, 1, 'ModaTix Runway Valencia', 'modatix-runway-valencia', 'Desfile principal de temporada en Valencia',
 120.00, 39.46990750, -0.37628810, 'Evento visual para presentar looks, modelos y estilo de marca.', '2026-06-15 20:00:00', '2026-06-15 22:00:00',
 'view/img/background.png', 'Elegant', 'Spring/Summer 2026', 'activo', 1),

(2, 2, 2, 2, 'Atelier Nova Collection Reveal', 'atelier-nova-collection-reveal', 'Presentación exclusiva de nueva colección',
 320.00, 40.41670500, -3.70358250, 'Evento privado para prensa, invitados y showcase digital.', '2026-07-10 19:30:00', '2026-07-10 21:30:00',
 'view/img/background.png', 'Formal', 'Autumn/Winter 2026', 'proximamente', 1),

(3, 3, 3, 3, 'Urban Pulse Night Gala', 'urban-pulse-night-gala', 'Gala urbana con estética streetwear premium',
 85.00, 41.38739740, 2.16856800, 'Una noche de moda, performance y branding visual.', '2026-08-05 21:00:00', '2026-08-05 23:30:00',
 'view/img/background.png', 'Black Urban', 'Urban Drop 2026', 'activo', 0);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order) VALUES
(1, 1, 'Opening Model', 1),
(1, 2, 'Featured Model', 2),
(2, 2, 'Main Face', 1),
(3, 1, 'Guest Model', 2),
(3, 3, 'Main Model', 1);

INSERT INTO event_categories (id_event, id_category) VALUES
(1, 1),
(1, 3),
(2, 1),
(2, 4),
(3, 2),
(3, 4);

INSERT INTO event_images (id_event, image_url, alt_text) VALUES
(1, 'view/img/background.png', 'Pasarela principal en Valencia'),
(1, 'view/img/background.png', 'Backstage del evento'),
(2, 'view/img/background.png', 'Presentación de colección'),
(3, 'view/img/background.png', 'Gala urbana nocturna');

INSERT INTO extras (extra_name, icon_class) VALUES
('Piscina', 'fa-solid fa-water-ladder'),
('Jardín', 'fa-solid fa-tree'),
('WiFi', 'fa-solid fa-wifi'),
('Parking', 'fa-solid fa-square-parking'),
('Bar', 'fa-solid fa-martini-glass-citrus'),
('VIP', 'fa-solid fa-crown'),
('Backstage', 'fa-solid fa-shirt'),
('Fotografía', 'fa-solid fa-camera-retro');

INSERT INTO event_extras (id_event, id_extra) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 6),
(2, 3),
(2, 4),
(2, 5),
(2, 7),
(3, 3),
(3, 6),
(3, 8);

COMMIT;
