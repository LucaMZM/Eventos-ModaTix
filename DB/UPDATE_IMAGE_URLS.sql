USE modatix;

UPDATE cities
SET city_image = 'https://images.unsplash.com/photo-1627764164847-eb86d3ed27c9?auto=format&fit=crop&w=1920&q=80'
WHERE city_name = 'Barcelona';

UPDATE venues
SET venue_image = 'https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg'
WHERE venue_name = 'Barcelona Runway Space';

UPDATE event_types
SET type_image = 'https://cdn-icons-png.flaticon.com/512/11002/11002841.png'
WHERE type_name = 'Desfile';

UPDATE event_types
SET type_image = 'https://cdn.pixabay.com/photo/2022/10/08/02/36/fashion-show-7506157_1280.jpg'
WHERE type_name = 'Presentación';

UPDATE event_types
SET type_image = 'https://cdn.pixabay.com/photo/2016/11/21/16/55/high-heels-1846436_1280.jpg'
WHERE type_name = 'Gala';

UPDATE categories
SET category_image = 'https://cdn.pixabay.com/photo/2022/01/25/06/50/fashion-6965393_1280.jpg'
WHERE category_name = 'Alta Costura';

UPDATE categories
SET category_image = 'https://cdn.pixabay.com/photo/2020/03/11/13/30/fashion-4922161_1280.jpg'
WHERE category_name = 'Streetwear';

UPDATE categories
SET category_image = 'https://cdn.pixabay.com/photo/2021/10/11/18/56/shoes-6701631_1280.jpg'
WHERE category_name = 'Minimalista';

UPDATE categories
SET category_image = 'https://cdn.pixabay.com/photo/2022/10/08/02/48/knitwear-7506176_1280.jpg'
WHERE category_name = 'VIP';

UPDATE brands
SET brand_logo = 'view/img/brands/modatix_studio.jpg'
WHERE brand_name = 'ModaTix Studio';

UPDATE brands
SET brand_logo = 'view/img/brands/atelier_nova.png'
WHERE brand_name = 'Atelier Nova';

UPDATE brands
SET brand_logo = 'view/img/brands/urban_pulse.png'
WHERE brand_name = 'Urban Pulse';

UPDATE models
SET main_image = 'https://cdn.pixabay.com/photo/2020/03/06/02/01/black-4905876_1280.jpg'
WHERE model_name = 'Luca M.';

UPDATE models
SET main_image = 'https://cdn.pixabay.com/photo/2025/03/12/09/59/fashion-9464875_640.jpg'
WHERE model_name = 'Sofía R.';

UPDATE models
SET main_image = 'https://cdn.pixabay.com/photo/2025/08/06/22/31/close-up-portrait-9759768_640.jpg'
WHERE model_name = 'Adrián V.';

UPDATE events
SET poster_image = 'https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg'
WHERE slug = 'modatix-runway-valencia';

UPDATE events
SET poster_image = 'https://cdn.pixabay.com/photo/2023/07/07/03/45/fashion-show-8111584_1280.jpg'
WHERE slug = 'atelier-nova-collection-reveal';

UPDATE events
SET poster_image = 'https://cdn.pixabay.com/photo/2020/03/11/13/30/fashion-4922161_1280.jpg'
WHERE slug = 'urban-pulse-night-gala';

UPDATE model_images
SET image_url = 'https://cdn.pixabay.com/photo/2022/09/24/16/43/fashion-7476765_1280.jpg'
WHERE id_image = 1;

UPDATE model_images
SET image_url = 'https://cdn.pixabay.com/photo/2022/09/24/17/17/model-7476894_1280.jpg'
WHERE id_image = 2;

UPDATE model_images
SET image_url = 'https://cdn.pixabay.com/photo/2022/09/24/17/32/model-7476916_1280.jpg'
WHERE id_image = 3;

UPDATE model_images
SET image_url = 'https://cdn.pixabay.com/photo/2022/09/24/17/17/model-7476893_1280.jpg'
WHERE id_image = 4;

UPDATE event_images
SET image_url = 'https://cdn.pixabay.com/photo/2022/01/25/06/50/fashion-6965393_1280.jpg'
WHERE id_image = 1;

UPDATE event_images
SET image_url = 'https://cdn.pixabay.com/photo/2022/09/24/16/43/fashion-7476765_1280.jpg'
WHERE id_image = 2;

UPDATE event_images
SET image_url = 'https://cdn.pixabay.com/photo/2022/09/24/17/17/model-7476894_1280.jpg'
WHERE id_image = 3;

UPDATE event_images
SET image_url = 'https://cdn.pixabay.com/photo/2016/11/21/16/55/high-heels-1846436_1280.jpg'
WHERE id_image = 4;
