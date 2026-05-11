USE modatix;

ALTER TABLE events
    ADD COLUMN IF NOT EXISTS lat DECIMAL(10,8) NULL AFTER ticket_price;

ALTER TABLE events
    ADD COLUMN IF NOT EXISTS lon DECIMAL(11,8) NULL AFTER lat;

UPDATE events
SET lat = 39.46990750, lon = -0.37628810
WHERE slug = 'modatix-runway-valencia';

UPDATE events
SET lat = 40.41670500, lon = -3.70358250
WHERE slug = 'atelier-nova-collection-reveal';

UPDATE events
SET lat = 41.38739740, lon = 2.16856800
WHERE slug = 'urban-pulse-night-gala';

UPDATE events e
INNER JOIN cities c ON c.id_city = e.id_city
SET e.lat = 39.46990750, e.lon = -0.37628810
WHERE c.city_name = 'Valencia'
  AND (e.lat IS NULL OR e.lon IS NULL);

UPDATE events e
INNER JOIN cities c ON c.id_city = e.id_city
SET e.lat = 40.41670500, e.lon = -3.70358250
WHERE c.city_name = 'Madrid'
  AND (e.lat IS NULL OR e.lon IS NULL);

UPDATE events e
INNER JOIN cities c ON c.id_city = e.id_city
SET e.lat = 41.38739740, e.lon = 2.16856800
WHERE c.city_name = 'Barcelona'
  AND (e.lat IS NULL OR e.lon IS NULL);
