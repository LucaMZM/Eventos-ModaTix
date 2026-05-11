USE modatix;

CREATE TABLE IF NOT EXISTS extras (
    id_extra INT AUTO_INCREMENT PRIMARY KEY,
    extra_name VARCHAR(100) NOT NULL,
    icon_class VARCHAR(120) NOT NULL,
    UNIQUE KEY uk_extra_name (extra_name)
);

CREATE TABLE IF NOT EXISTS event_extras (
    id_event INT NOT NULL,
    id_extra INT NOT NULL,
    PRIMARY KEY (id_event, id_extra),
    FOREIGN KEY (id_event) REFERENCES events(id_event) ON DELETE CASCADE,
    FOREIGN KEY (id_extra) REFERENCES extras(id_extra) ON DELETE CASCADE
);

INSERT INTO extras (extra_name, icon_class) VALUES
('Piscina', 'fa-solid fa-water-ladder'),
('Jardín', 'fa-solid fa-tree'),
('WiFi', 'fa-solid fa-wifi'),
('Parking', 'fa-solid fa-square-parking'),
('Bar', 'fa-solid fa-martini-glass-citrus'),
('VIP', 'fa-solid fa-crown'),
('Backstage', 'fa-solid fa-shirt'),
('Fotografía', 'fa-solid fa-camera-retro')
ON DUPLICATE KEY UPDATE icon_class = VALUES(icon_class);

INSERT IGNORE INTO event_extras (id_event, id_extra)
SELECT 1, id_extra FROM extras WHERE extra_name IN ('Piscina', 'Jardín', 'WiFi', 'Parking', 'VIP');

INSERT IGNORE INTO event_extras (id_event, id_extra)
SELECT 2, id_extra FROM extras WHERE extra_name IN ('WiFi', 'Parking', 'Bar', 'Backstage');

INSERT IGNORE INTO event_extras (id_event, id_extra)
SELECT 3, id_extra FROM extras WHERE extra_name IN ('WiFi', 'VIP', 'Fotografía');
