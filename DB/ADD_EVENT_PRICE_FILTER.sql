USE modatix;

ALTER TABLE events
    ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10,2) NULL AFTER short_description;

-- Si existía una columna antigua `price`, migramos su valor a ticket_price
SET @has_price := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'events'
      AND COLUMN_NAME = 'price'
);

SET @sql_price := IF(
    @has_price > 0,
    'UPDATE events
     SET ticket_price = price
     WHERE (ticket_price IS NULL OR ticket_price <= 0)
       AND price IS NOT NULL',
    'SELECT 1'
);
PREPARE stmt_price FROM @sql_price;
EXECUTE stmt_price;
DEALLOCATE PREPARE stmt_price;

-- Si existía una columna antigua `precio`, migramos su valor a ticket_price
SET @has_precio := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'events'
      AND COLUMN_NAME = 'precio'
);

SET @sql_precio := IF(
    @has_precio > 0,
    'UPDATE events
     SET ticket_price = precio
     WHERE (ticket_price IS NULL OR ticket_price <= 0)
       AND precio IS NOT NULL',
    'SELECT 1'
);
PREPARE stmt_precio FROM @sql_precio;
EXECUTE stmt_precio;
DEALLOCATE PREPARE stmt_precio;

UPDATE events
SET ticket_price = 1.00
WHERE ticket_price IS NULL OR ticket_price <= 0;

ALTER TABLE events
    MODIFY COLUMN ticket_price DECIMAL(10,2) NOT NULL DEFAULT 1.00;

-- Limpieza opcional para quedarte con una única columna física:
-- ALTER TABLE events DROP COLUMN price;
-- ALTER TABLE events DROP COLUMN precio;
