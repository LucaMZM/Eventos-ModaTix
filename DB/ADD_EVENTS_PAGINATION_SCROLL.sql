USE modatix;

-- Dataset ampliado para paginación (6 por página) y bloque de eventos similares por ciudad.

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 1, 1, 2, 1,
       'Valencia Fashion Breakfast', 'valencia-fashion-breakfast-ss26',
       'Encuentro matinal de presentación de colección en Valencia',
       65.00, 39.47201000, -0.37148000,
       'Sesión matinal con estilismo editorial, networking y preview de temporada.',
       '2026-05-18 10:00:00', '2026-05-18 13:00:00',
       'view/img/background.png', 'Smart Casual', 'Spring/Summer 2026', 'proximamente', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'valencia-fashion-breakfast-ss26');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 1, 1, 1, 2,
       'Mediterranean Couture Night', 'mediterranean-couture-night',
       'Desfile nocturno de alta costura con enfoque mediterráneo',
       190.00, 39.46576000, -0.38112000,
       'Pasarela premium con estilismo artesanal, dirección artística y live set.',
       '2026-06-02 20:30:00', '2026-06-02 22:45:00',
       'view/img/background.png', 'Elegant', 'Couture 2026', 'proximamente', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'mediterranean-couture-night');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 1, 1, 3, 3,
       'Valencia VIP Gala Summer', 'valencia-vip-gala-summer',
       'Gala estival con invitados del sector moda y lifestyle',
       240.00, 39.47841000, -0.36795000,
       'Evento de gala con photocall, backstage abierto y experiencias VIP.',
       '2026-06-28 21:00:00', '2026-06-29 00:30:00',
       'view/img/background.png', 'Black Tie', 'Summer Gala 2026', 'proximamente', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'valencia-vip-gala-summer');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 2, 2, 2, 1,
       'Madrid Editorial Showcase', 'madrid-editorial-showcase',
       'Presentación editorial con looks comerciales y cápsula digital',
       95.00, 40.42098000, -3.69982000,
       'Formato presentación con recorrido de colección y zona media.',
       '2026-05-22 19:00:00', '2026-05-22 21:15:00',
       'view/img/background.png', 'Creative Formal', 'Editorial 2026', 'proximamente', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'madrid-editorial-showcase');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 2, 2, 1, 2,
       'Madrid Runway Core', 'madrid-runway-core',
       'Desfile central con dirección creativa y casting principal',
       170.00, 40.41423000, -3.70841000,
       'Runway de temporada con montaje escénico y cobertura audiovisual.',
       '2026-06-11 20:00:00', '2026-06-11 22:20:00',
       'view/img/background.png', 'Elegant', 'Runway Core 2026', 'proximamente', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'madrid-runway-core');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 2, 2, 3, 3,
       'Madrid Creative Gala', 'madrid-creative-gala',
       'Gala creativa con performance y curaduría de estilismo',
       260.00, 40.42576000, -3.70433000,
       'Noche de gala con experiencias inmersivas y zona VIP.',
       '2026-07-03 21:15:00', '2026-07-04 00:15:00',
       'view/img/background.png', 'Black Tie', 'Creative Gala 2026', 'proximamente', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'madrid-creative-gala');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 3, 3, 2, 1,
       'Barcelona Design Presentation', 'barcelona-design-presentation',
       'Presentación de diseño con enfoque comercial y retail',
       88.00, 41.39104000, 2.17225000,
       'Evento de presentación con estaciones temáticas por línea de producto.',
       '2026-05-30 18:45:00', '2026-05-30 21:00:00',
       'view/img/background.png', 'Smart Casual', 'Design Series 2026', 'proximamente', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'barcelona-design-presentation');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 3, 3, 1, 3,
       'Barcelona Street Runway', 'barcelona-street-runway',
       'Desfile streetwear con identidad urbana y performance',
       72.00, 41.38492000, 2.16513000,
       'Pasarela urbana con cápsula limitada y activación de marca.',
       '2026-06-20 20:00:00', '2026-06-20 22:00:00',
       'view/img/background.png', 'Street Black', 'Urban Runway 2026', 'proximamente', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'barcelona-street-runway');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 3, 3, 3, 2,
       'Barcelona Night Gala VIP', 'barcelona-night-gala-vip',
       'Gala de noche para invitados, prensa y compradores',
       285.00, 41.38791000, 2.17684000,
       'Experiencia nocturna con salón VIP, cocktail y showroom exclusivo.',
       '2026-07-18 21:30:00', '2026-07-19 00:45:00',
       'view/img/background.png', 'Black Tie', 'Night Gala 2026', 'proximamente', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'barcelona-night-gala-vip');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 1, 1, 2, 3,
       'Valencia Urban Drop Launch', 'valencia-urban-drop-launch',
       'Lanzamiento urbano de colección cápsula limitada',
       59.00, 39.46384000, -0.36972000,
       'Presentación de drop urbano con venta anticipada y set en vivo.',
       '2026-08-01 19:30:00', '2026-08-01 22:00:00',
       'view/img/background.png', 'Urban Smart', 'Urban Drop 2026', 'proximamente', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'valencia-urban-drop-launch');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 2, 2, 1, 2,
       'Madrid Haute Couture Session', 'madrid-haute-couture-session',
       'Sesión runway de alta costura con piezas exclusivas',
       210.00, 40.41876000, -3.69524000,
       'Sesión de alta costura con casting editorial y cierre de colección.',
       '2026-08-12 20:15:00', '2026-08-12 22:40:00',
       'view/img/background.png', 'Formal', 'Haute Couture 2026', 'proximamente', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'madrid-haute-couture-session');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 3, 3, 2, 1,
       'Barcelona Minimal Experience', 'barcelona-minimal-experience',
       'Presentación minimalista con foco en producto y patronaje',
       77.00, 41.39322000, 2.16738000,
       'Formato compacto para compradores y creativos del sector.',
       '2026-08-24 18:30:00', '2026-08-24 20:30:00',
       'view/img/background.png', 'Minimal', 'Minimal 2026', 'proximamente', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'barcelona-minimal-experience');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 1, 1, 3, 1,
       'Valencia Premium Afterparty', 'valencia-premium-afterparty',
       'Afterparty oficial con invitados del calendario de moda',
       130.00, 39.47098000, -0.37385000,
       'Cierre de jornada con DJ set, networking y activaciones premium.',
       '2026-08-29 23:00:00', '2026-08-30 02:00:00',
       'view/img/background.png', 'Night Elegant', 'Afterparty 2026', 'proximamente', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'valencia-premium-afterparty');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 2, 2, 2, 2,
       'Madrid Atelier Open Day', 'madrid-atelier-open-day',
       'Jornada abierta de atelier con presentación de lookbook',
       49.00, 40.41392000, -3.70081000,
       'Evento abierto para comunidad creativa, prensa y clientes.',
       '2026-09-05 17:00:00', '2026-09-05 20:00:00',
       'view/img/background.png', 'Smart Casual', 'Atelier 2026', 'proximamente', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'madrid-atelier-open-day');

INSERT INTO events (
    id_city, id_venue, id_event_type, id_brand,
    event_name, slug, short_description, ticket_price, lat, lon, description,
    event_date, end_date, poster_image, dress_code, season_name, status, featured
)
SELECT 3, 3, 1, 3,
       'Barcelona Runway Closing', 'barcelona-runway-closing',
       'Cierre de circuito runway con selección best-of-season',
       145.00, 41.38651000, 2.17022000,
       'Gran cierre de temporada con pasarela extendida y final artístico.',
       '2026-09-19 20:30:00', '2026-09-19 23:00:00',
       'view/img/background.png', 'Elegant', 'Closing 2026', 'proximamente', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM events WHERE slug = 'barcelona-runway-closing');

-- Relaciones modelo/evento
INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 1, 'Lead Model', 1 FROM events e
WHERE e.slug = 'valencia-fashion-breakfast-ss26'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 1);
INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 2, 'Guest Model', 2 FROM events e
WHERE e.slug = 'valencia-fashion-breakfast-ss26'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 2);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 2, 'Main Face', 1 FROM events e
WHERE e.slug = 'mediterranean-couture-night'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 2);
INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 3, 'Runway Support', 2 FROM events e
WHERE e.slug = 'mediterranean-couture-night'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 3);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 3, 'Opening Model', 1 FROM events e
WHERE e.slug = 'valencia-vip-gala-summer'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 3);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 1, 'Editorial Lead', 1 FROM events e
WHERE e.slug = 'madrid-editorial-showcase'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 1);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 2, 'Main Model', 1 FROM events e
WHERE e.slug = 'madrid-runway-core'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 2);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 3, 'Creative Lead', 1 FROM events e
WHERE e.slug = 'madrid-creative-gala'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 3);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 1, 'Design Face', 1 FROM events e
WHERE e.slug = 'barcelona-design-presentation'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 1);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 3, 'Street Lead', 1 FROM events e
WHERE e.slug = 'barcelona-street-runway'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 3);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 2, 'VIP Face', 1 FROM events e
WHERE e.slug = 'barcelona-night-gala-vip'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 2);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 1, 'Urban Lead', 1 FROM events e
WHERE e.slug = 'valencia-urban-drop-launch'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 1);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 2, 'Couture Lead', 1 FROM events e
WHERE e.slug = 'madrid-haute-couture-session'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 2);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 1, 'Minimal Lead', 1 FROM events e
WHERE e.slug = 'barcelona-minimal-experience'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 1);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 3, 'Afterparty Lead', 1 FROM events e
WHERE e.slug = 'valencia-premium-afterparty'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 3);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 2, 'Host Model', 1 FROM events e
WHERE e.slug = 'madrid-atelier-open-day'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 2);

INSERT INTO event_models (id_event, id_model, role_name, appearance_order)
SELECT e.id_event, 3, 'Closing Lead', 1 FROM events e
WHERE e.slug = 'barcelona-runway-closing'
  AND NOT EXISTS (SELECT 1 FROM event_models em WHERE em.id_event = e.id_event AND em.id_model = 3);

-- Categorías por evento
INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 1 FROM events e WHERE e.slug = 'valencia-fashion-breakfast-ss26'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 1);
INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 3 FROM events e WHERE e.slug = 'valencia-fashion-breakfast-ss26'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 3);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 1 FROM events e WHERE e.slug = 'mediterranean-couture-night'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 1);
INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 4 FROM events e WHERE e.slug = 'mediterranean-couture-night'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 4);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 4 FROM events e WHERE e.slug = 'valencia-vip-gala-summer'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 4);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 3 FROM events e WHERE e.slug = 'madrid-editorial-showcase'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 3);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 1 FROM events e WHERE e.slug = 'madrid-runway-core'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 1);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 4 FROM events e WHERE e.slug = 'madrid-creative-gala'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 4);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 3 FROM events e WHERE e.slug = 'barcelona-design-presentation'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 3);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 2 FROM events e WHERE e.slug = 'barcelona-street-runway'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 2);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 4 FROM events e WHERE e.slug = 'barcelona-night-gala-vip'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 4);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 2 FROM events e WHERE e.slug = 'valencia-urban-drop-launch'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 2);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 1 FROM events e WHERE e.slug = 'madrid-haute-couture-session'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 1);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 3 FROM events e WHERE e.slug = 'barcelona-minimal-experience'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 3);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 4 FROM events e WHERE e.slug = 'valencia-premium-afterparty'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 4);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 3 FROM events e WHERE e.slug = 'madrid-atelier-open-day'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 3);

INSERT INTO event_categories (id_event, id_category)
SELECT e.id_event, 1 FROM events e WHERE e.slug = 'barcelona-runway-closing'
AND NOT EXISTS (SELECT 1 FROM event_categories ec WHERE ec.id_event = e.id_event AND ec.id_category = 1);

-- Imagen principal extra por evento
INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'view/img/background.png', 'Galería principal'
FROM events e
WHERE e.slug IN (
    'valencia-fashion-breakfast-ss26', 'mediterranean-couture-night', 'valencia-vip-gala-summer',
    'madrid-editorial-showcase', 'madrid-runway-core', 'madrid-creative-gala',
    'barcelona-design-presentation', 'barcelona-street-runway', 'barcelona-night-gala-vip',
    'valencia-urban-drop-launch', 'madrid-haute-couture-session', 'barcelona-minimal-experience',
    'valencia-premium-afterparty', 'madrid-atelier-open-day', 'barcelona-runway-closing'
)
AND NOT EXISTS (
    SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.alt_text = 'Galería principal'
);

-- Extras por evento
INSERT INTO event_extras (id_event, id_extra)
SELECT e.id_event, 3 FROM events e
WHERE e.slug IN ('valencia-fashion-breakfast-ss26', 'madrid-editorial-showcase', 'barcelona-design-presentation', 'madrid-atelier-open-day')
AND NOT EXISTS (SELECT 1 FROM event_extras ee WHERE ee.id_event = e.id_event AND ee.id_extra = 3);

INSERT INTO event_extras (id_event, id_extra)
SELECT e.id_event, 4 FROM events e
WHERE e.slug IN ('mediterranean-couture-night', 'madrid-runway-core', 'madrid-haute-couture-session', 'barcelona-runway-closing')
AND NOT EXISTS (SELECT 1 FROM event_extras ee WHERE ee.id_event = e.id_event AND ee.id_extra = 4);

INSERT INTO event_extras (id_event, id_extra)
SELECT e.id_event, 6 FROM events e
WHERE e.slug IN ('valencia-vip-gala-summer', 'madrid-creative-gala', 'barcelona-night-gala-vip', 'valencia-premium-afterparty')
AND NOT EXISTS (SELECT 1 FROM event_extras ee WHERE ee.id_event = e.id_event AND ee.id_extra = 6);

-- Normalización de imágenes para evitar usar assets de error (404/503) como portada o galería.
UPDATE events e
SET e.poster_image = CASE e.slug
    WHEN 'valencia-fashion-breakfast-ss26' THEN 'https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg'
    WHEN 'mediterranean-couture-night' THEN 'https://cdn.pixabay.com/photo/2023/07/07/03/45/fashion-show-8111584_1280.jpg'
    WHEN 'valencia-vip-gala-summer' THEN 'https://cdn.pixabay.com/photo/2020/03/11/13/30/fashion-4922161_1280.jpg'
    WHEN 'madrid-editorial-showcase' THEN 'https://cdn.pixabay.com/photo/2022/01/25/06/50/fashion-6965393_1280.jpg'
    WHEN 'madrid-runway-core' THEN 'https://cdn.pixabay.com/photo/2022/09/24/16/43/fashion-7476765_1280.jpg'
    WHEN 'madrid-creative-gala' THEN 'https://cdn.pixabay.com/photo/2022/09/24/17/17/model-7476894_1280.jpg'
    WHEN 'barcelona-design-presentation' THEN 'https://cdn.pixabay.com/photo/2016/11/21/16/55/high-heels-1846436_1280.jpg'
    WHEN 'barcelona-street-runway' THEN 'https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg'
    WHEN 'barcelona-night-gala-vip' THEN 'https://cdn.pixabay.com/photo/2023/07/07/03/45/fashion-show-8111584_1280.jpg'
    WHEN 'valencia-urban-drop-launch' THEN 'https://cdn.pixabay.com/photo/2020/03/11/13/30/fashion-4922161_1280.jpg'
    WHEN 'madrid-haute-couture-session' THEN 'https://cdn.pixabay.com/photo/2022/01/25/06/50/fashion-6965393_1280.jpg'
    WHEN 'barcelona-minimal-experience' THEN 'https://cdn.pixabay.com/photo/2022/09/24/16/43/fashion-7476765_1280.jpg'
    WHEN 'valencia-premium-afterparty' THEN 'https://cdn.pixabay.com/photo/2022/09/24/17/17/model-7476894_1280.jpg'
    WHEN 'madrid-atelier-open-day' THEN 'https://cdn.pixabay.com/photo/2016/11/21/16/55/high-heels-1846436_1280.jpg'
    WHEN 'barcelona-runway-closing' THEN 'https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg'
    ELSE e.poster_image
END
WHERE e.slug IN (
    'valencia-fashion-breakfast-ss26', 'mediterranean-couture-night', 'valencia-vip-gala-summer',
    'madrid-editorial-showcase', 'madrid-runway-core', 'madrid-creative-gala',
    'barcelona-design-presentation', 'barcelona-street-runway', 'barcelona-night-gala-vip',
    'valencia-urban-drop-launch', 'madrid-haute-couture-session', 'barcelona-minimal-experience',
    'valencia-premium-afterparty', 'madrid-atelier-open-day', 'barcelona-runway-closing'
);

UPDATE event_images ei
INNER JOIN events e ON e.id_event = ei.id_event
SET
    ei.image_url = CASE e.slug
        WHEN 'valencia-fashion-breakfast-ss26' THEN 'https://cdn.pixabay.com/photo/2022/09/24/16/43/fashion-7476765_1280.jpg'
        WHEN 'mediterranean-couture-night' THEN 'https://cdn.pixabay.com/photo/2022/09/24/17/17/model-7476894_1280.jpg'
        WHEN 'valencia-vip-gala-summer' THEN 'https://cdn.pixabay.com/photo/2016/11/21/16/55/high-heels-1846436_1280.jpg'
        WHEN 'madrid-editorial-showcase' THEN 'https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg'
        WHEN 'madrid-runway-core' THEN 'https://cdn.pixabay.com/photo/2023/07/07/03/45/fashion-show-8111584_1280.jpg'
        WHEN 'madrid-creative-gala' THEN 'https://cdn.pixabay.com/photo/2020/03/11/13/30/fashion-4922161_1280.jpg'
        WHEN 'barcelona-design-presentation' THEN 'https://cdn.pixabay.com/photo/2022/01/25/06/50/fashion-6965393_1280.jpg'
        WHEN 'barcelona-street-runway' THEN 'https://cdn.pixabay.com/photo/2022/09/24/16/43/fashion-7476765_1280.jpg'
        WHEN 'barcelona-night-gala-vip' THEN 'https://cdn.pixabay.com/photo/2022/09/24/17/17/model-7476894_1280.jpg'
        WHEN 'valencia-urban-drop-launch' THEN 'https://cdn.pixabay.com/photo/2016/11/21/16/55/high-heels-1846436_1280.jpg'
        WHEN 'madrid-haute-couture-session' THEN 'https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg'
        WHEN 'barcelona-minimal-experience' THEN 'https://cdn.pixabay.com/photo/2023/07/07/03/45/fashion-show-8111584_1280.jpg'
        WHEN 'valencia-premium-afterparty' THEN 'https://cdn.pixabay.com/photo/2020/03/11/13/30/fashion-4922161_1280.jpg'
        WHEN 'madrid-atelier-open-day' THEN 'https://cdn.pixabay.com/photo/2022/01/25/06/50/fashion-6965393_1280.jpg'
        WHEN 'barcelona-runway-closing' THEN 'https://cdn.pixabay.com/photo/2022/09/24/16/43/fashion-7476765_1280.jpg'
        ELSE ei.image_url
    END,
    ei.alt_text = CONCAT('Galería evento #', e.id_event)
WHERE e.slug IN (
    'valencia-fashion-breakfast-ss26', 'mediterranean-couture-night', 'valencia-vip-gala-summer',
    'madrid-editorial-showcase', 'madrid-runway-core', 'madrid-creative-gala',
    'barcelona-design-presentation', 'barcelona-street-runway', 'barcelona-night-gala-vip',
    'valencia-urban-drop-launch', 'madrid-haute-couture-session', 'barcelona-minimal-experience',
    'valencia-premium-afterparty', 'madrid-atelier-open-day', 'barcelona-runway-closing'
);

-- Curación visual avanzada (set final de portadas y galerías con imágenes más realistas/diversas).
UPDATE events e
SET e.poster_image = CASE e.slug
    WHEN 'modatix-runway-valencia' THEN 'https://sananastasio.com/wp-content/uploads/pasarela.jpg'
    WHEN 'atelier-nova-collection-reveal' THEN 'https://malne.es/wp-content/uploads/2025/08/eventos-moda-lujo-madrid-2025.jpg'
    WHEN 'urban-pulse-night-gala' THEN 'https://media.gq.com.mx/photos/63cee46d7b0ce5b4c4028ada/16:9/w_2560%2Cc_limit/paris-fashion-week-otono-invierno-tendencias-para-hombre.jpg'
    WHEN 'valencia-fashion-breakfast-ss26' THEN 'https://ohmagazinerd.com/wp-content/uploads/2020/10/HOMENAJE-2.jpg'
    WHEN 'mediterranean-couture-night' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_969_969580-i3jwmy0qj4-whr.jpg'
    WHEN 'valencia-vip-gala-summer' THEN 'https://media.gq.com.mx/photos/62879e10500ac81936c4851a/16:9/w_2560%2Cc_limit/dior-men-spring-2023-coleccion-desfile-looks.jpg'
    WHEN 'madrid-editorial-showcase' THEN 'https://images.ecestaticos.com/u0vl7OCWAjjhNIw31NhvfkaEALQ=/0x0:2272x1453/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fe6d%2Fac3%2Fe87%2Fe6dac3e87a2d71841a7af0f42281ca32.jpg'
    WHEN 'madrid-runway-core' THEN 'https://img.lavdg.com/sc/1ZoCLOl04eI9YGmyrYgUBFT1mkM=/480x/2026/01/19/00121768836601571637679/Foto/efe_20260119_140720109.jpg'
    WHEN 'madrid-creative-gala' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_754_754943-w4h9fejcqd-whr.jpg'
    WHEN 'barcelona-design-presentation' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_1110_1110069-m1eljmrsq5-whr.jpg'
    WHEN 'barcelona-street-runway' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_1110_1110069-m1eljmrsq5-whr.jpg'
    WHEN 'barcelona-night-gala-vip' THEN 'https://sananastasio.com/wp-content/uploads/pasarela.jpg'
    WHEN 'valencia-urban-drop-launch' THEN 'https://ohmagazinerd.com/wp-content/uploads/2020/10/HOMENAJE-2.jpg'
    WHEN 'madrid-haute-couture-session' THEN 'https://malne.es/wp-content/uploads/2025/08/eventos-moda-lujo-madrid-2025.jpg'
    WHEN 'barcelona-minimal-experience' THEN 'https://images.ecestaticos.com/u0vl7OCWAjjhNIw31NhvfkaEALQ=/0x0:2272x1453/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fe6d%2Fac3%2Fe87%2Fe6dac3e87a2d71841a7af0f42281ca32.jpg'
    WHEN 'valencia-premium-afterparty' THEN 'https://img.lavdg.com/sc/1ZoCLOl04eI9YGmyrYgUBFT1mkM=/480x/2026/01/19/00121768836601571637679/Foto/efe_20260119_140720109.jpg'
    WHEN 'madrid-atelier-open-day' THEN 'https://media.gq.com.mx/photos/62879e10500ac81936c4851a/16:9/w_2560%2Cc_limit/dior-men-spring-2023-coleccion-desfile-looks.jpg'
    WHEN 'barcelona-runway-closing' THEN 'https://media.gq.com.mx/photos/63cee46d7b0ce5b4c4028ada/16:9/w_2560%2Cc_limit/paris-fashion-week-otono-invierno-tendencias-para-hombre.jpg'
    ELSE e.poster_image
END
WHERE e.slug IN (
    'modatix-runway-valencia', 'atelier-nova-collection-reveal', 'urban-pulse-night-gala',
    'valencia-fashion-breakfast-ss26', 'mediterranean-couture-night', 'valencia-vip-gala-summer',
    'madrid-editorial-showcase', 'madrid-runway-core', 'madrid-creative-gala',
    'barcelona-design-presentation', 'barcelona-street-runway', 'barcelona-night-gala-vip',
    'valencia-urban-drop-launch', 'madrid-haute-couture-session', 'barcelona-minimal-experience',
    'valencia-premium-afterparty', 'madrid-atelier-open-day', 'barcelona-runway-closing'
);

UPDATE event_images ei
INNER JOIN (
    SELECT id_event, MIN(id_image) AS first_id
    FROM event_images
    GROUP BY id_event
) f ON f.first_id = ei.id_image
INNER JOIN events e ON e.id_event = ei.id_event
SET ei.image_url = CASE e.slug
    WHEN 'modatix-runway-valencia' THEN 'https://ohmagazinerd.com/wp-content/uploads/2020/10/HOMENAJE-2.jpg'
    WHEN 'atelier-nova-collection-reveal' THEN 'https://images.ecestaticos.com/u0vl7OCWAjjhNIw31NhvfkaEALQ=/0x0:2272x1453/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fe6d%2Fac3%2Fe87%2Fe6dac3e87a2d71841a7af0f42281ca32.jpg'
    WHEN 'urban-pulse-night-gala' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_969_969580-i3jwmy0qj4-whr.jpg'
    WHEN 'valencia-fashion-breakfast-ss26' THEN 'https://sananastasio.com/wp-content/uploads/pasarela.jpg'
    WHEN 'mediterranean-couture-night' THEN 'https://media.gq.com.mx/photos/62879e10500ac81936c4851a/16:9/w_2560%2Cc_limit/dior-men-spring-2023-coleccion-desfile-looks.jpg'
    WHEN 'valencia-vip-gala-summer' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_754_754943-w4h9fejcqd-whr.jpg'
    WHEN 'madrid-editorial-showcase' THEN 'https://malne.es/wp-content/uploads/2025/08/eventos-moda-lujo-madrid-2025.jpg'
    WHEN 'madrid-runway-core' THEN 'https://img.lavdg.com/sc/1ZoCLOl04eI9YGmyrYgUBFT1mkM=/480x/2026/01/19/00121768836601571637679/Foto/efe_20260119_140720109.jpg'
    WHEN 'madrid-creative-gala' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_1110_1110069-m1eljmrsq5-whr.jpg'
    WHEN 'barcelona-design-presentation' THEN 'https://media.gq.com.mx/photos/63cee46d7b0ce5b4c4028ada/16:9/w_2560%2Cc_limit/paris-fashion-week-otono-invierno-tendencias-para-hombre.jpg'
    WHEN 'barcelona-street-runway' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_1110_1110069-m1eljmrsq5-whr.jpg'
    WHEN 'barcelona-night-gala-vip' THEN 'https://sananastasio.com/wp-content/uploads/pasarela.jpg'
    WHEN 'valencia-urban-drop-launch' THEN 'https://ohmagazinerd.com/wp-content/uploads/2020/10/HOMENAJE-2.jpg'
    WHEN 'madrid-haute-couture-session' THEN 'https://images.ecestaticos.com/u0vl7OCWAjjhNIw31NhvfkaEALQ=/0x0:2272x1453/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fe6d%2Fac3%2Fe87%2Fe6dac3e87a2d71841a7af0f42281ca32.jpg'
    WHEN 'barcelona-minimal-experience' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_969_969580-i3jwmy0qj4-whr.jpg'
    WHEN 'valencia-premium-afterparty' THEN 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_754_754943-w4h9fejcqd-whr.jpg'
    WHEN 'madrid-atelier-open-day' THEN 'https://media.gq.com.mx/photos/62879e10500ac81936c4851a/16:9/w_2560%2Cc_limit/dior-men-spring-2023-coleccion-desfile-looks.jpg'
    WHEN 'barcelona-runway-closing' THEN 'https://media.gq.com.mx/photos/63cee46d7b0ce5b4c4028ada/16:9/w_2560%2Cc_limit/paris-fashion-week-otono-invierno-tendencias-para-hombre.jpg'
    ELSE ei.image_url
END,
ei.alt_text = CONCAT('Galería principal evento #', ei.id_event)
WHERE e.slug IN (
    'modatix-runway-valencia', 'atelier-nova-collection-reveal', 'urban-pulse-night-gala',
    'valencia-fashion-breakfast-ss26', 'mediterranean-couture-night', 'valencia-vip-gala-summer',
    'madrid-editorial-showcase', 'madrid-runway-core', 'madrid-creative-gala',
    'barcelona-design-presentation', 'barcelona-street-runway', 'barcelona-night-gala-vip',
    'valencia-urban-drop-launch', 'madrid-haute-couture-session', 'barcelona-minimal-experience',
    'valencia-premium-afterparty', 'madrid-atelier-open-day', 'barcelona-runway-closing'
);

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_969_969580-i3jwmy0qj4-whr.jpg', 'Detalle pasarela Madrid 1'
FROM events e
WHERE e.slug = 'madrid-editorial-showcase'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_969_969580-i3jwmy0qj4-whr.jpg');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://media.gq.com.mx/photos/62879e10500ac81936c4851a/16:9/w_2560%2Cc_limit/dior-men-spring-2023-coleccion-desfile-looks.jpg', 'Detalle runway Madrid 2'
FROM events e
WHERE e.slug = 'madrid-runway-core'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://media.gq.com.mx/photos/62879e10500ac81936c4851a/16:9/w_2560%2Cc_limit/dior-men-spring-2023-coleccion-desfile-looks.jpg');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://media.gq.com.mx/photos/63cee46d7b0ce5b4c4028ada/16:9/w_2560%2Cc_limit/paris-fashion-week-otono-invierno-tendencias-para-hombre.jpg', 'Detalle gala Madrid 3'
FROM events e
WHERE e.slug = 'madrid-creative-gala'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://media.gq.com.mx/photos/63cee46d7b0ce5b4c4028ada/16:9/w_2560%2Cc_limit/paris-fashion-week-otono-invierno-tendencias-para-hombre.jpg');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://ohmagazinerd.com/wp-content/uploads/2020/10/HOMENAJE-2.jpg', 'Detalle Barcelona 1'
FROM events e
WHERE e.slug = 'barcelona-design-presentation'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://ohmagazinerd.com/wp-content/uploads/2020/10/HOMENAJE-2.jpg');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_1110_1110069-m1eljmrsq5-whr.jpg', 'Detalle Barcelona 2'
FROM events e
WHERE e.slug = 'barcelona-street-runway'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_1110_1110069-m1eljmrsq5-whr.jpg');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOGPnc6bvWIKd7o_dt8U9jI0hsDh_lg3TvVw&s', 'Detalle Barcelona extra (web)'
FROM events e
WHERE e.slug = 'barcelona-street-runway'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOGPnc6bvWIKd7o_dt8U9jI0hsDh_lg3TvVw&s');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://sananastasio.com/wp-content/uploads/pasarela.jpg', 'Detalle Barcelona 3'
FROM events e
WHERE e.slug = 'barcelona-night-gala-vip'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://sananastasio.com/wp-content/uploads/pasarela.jpg');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://media.gq.com.mx/photos/62879e10500ac81936c4851a/16:9/w_2560%2Cc_limit/dior-men-spring-2023-coleccion-desfile-looks.jpg', 'Detalle Valencia 1'
FROM events e
WHERE e.slug = 'valencia-fashion-breakfast-ss26'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://media.gq.com.mx/photos/62879e10500ac81936c4851a/16:9/w_2560%2Cc_limit/dior-men-spring-2023-coleccion-desfile-looks.jpg');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://img.lavdg.com/sc/1ZoCLOl04eI9YGmyrYgUBFT1mkM=/480x/2026/01/19/00121768836601571637679/Foto/efe_20260119_140720109.jpg', 'Detalle Valencia 2'
FROM events e
WHERE e.slug = 'mediterranean-couture-night'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://img.lavdg.com/sc/1ZoCLOl04eI9YGmyrYgUBFT1mkM=/480x/2026/01/19/00121768836601571637679/Foto/efe_20260119_140720109.jpg');

INSERT INTO event_images (id_event, image_url, alt_text)
SELECT e.id_event, 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_754_754943-w4h9fejcqd-whr.jpg', 'Detalle Valencia 3'
FROM events e
WHERE e.slug = 'valencia-vip-gala-summer'
  AND NOT EXISTS (SELECT 1 FROM event_images ei WHERE ei.id_event = e.id_event AND ei.image_url = 'https://diorama.dam-broadcast.com/cdn-cgi/image/width=3000,format=auto/pm_11872_754_754943-w4h9fejcqd-whr.jpg');
