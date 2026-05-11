<?php
include_once(__DIR__ . "/../../../model/connect.php");

class DAOShop
{
    private $supportsTicketPrice = null;
    private $supportsGeoColumns = null;

    private function supportsTicketPriceColumn()
    {
        if ($this->supportsTicketPrice !== null) {
            return $this->supportsTicketPrice;
        }

        $conexion = connect::con();
        try {
            $stmt = $conexion->query("SHOW COLUMNS FROM events LIKE 'ticket_price'");
            $this->supportsTicketPrice = (bool)$stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            $this->supportsTicketPrice = false;
        }
        connect::close($conexion);

        return $this->supportsTicketPrice;
    }

    private function supportsGeoColumns()
    {
        if ($this->supportsGeoColumns !== null) {
            return $this->supportsGeoColumns;
        }

        $conexion = connect::con();
        try {
            $stmtLat = $conexion->query("SHOW COLUMNS FROM events LIKE 'lat'");
            $stmtLon = $conexion->query("SHOW COLUMNS FROM events LIKE 'lon'");
            $hasLat = (bool)$stmtLat->fetch(PDO::FETCH_ASSOC);
            $hasLon = (bool)$stmtLon->fetch(PDO::FETCH_ASSOC);
            $this->supportsGeoColumns = ($hasLat && $hasLon);
        } catch (Throwable $e) {
            $this->supportsGeoColumns = false;
        }
        connect::close($conexion);

        return $this->supportsGeoColumns;
    }

    private function fetchAll($sql, $params = [])
    {
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        foreach ($params as $key => $value) {
            if (is_int($value)) {
                $stmt->bindValue($key, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue($key, $value, PDO::PARAM_STR);
            }
        }
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    private function fetchOne($sql, $params = [])
    {
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        foreach ($params as $key => $value) {
            if (is_int($value)) {
                $stmt->bindValue($key, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue($key, $value, PDO::PARAM_STR);
            }
        }
        $stmt->execute();
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res ?: [];
    }

    private function normalizeEventsRows($rows)
    {
        $retrArray = [];
        foreach ($rows as $row) {
            $images = [];
            $poster = trim((string)($row['card_image'] ?? ''));
            if ($poster !== '') {
                $images[] = $poster;
            }

            $rawImages = trim((string)($row['img_event'] ?? ''));
            if ($rawImages !== '') {
                $parts = explode('|||', $rawImages);
                foreach ($parts as $img) {
                    $cleanImg = trim((string)$img);
                    if ($cleanImg !== '' && !in_array($cleanImg, $images, true)) {
                        $images[] = $cleanImg;
                    }
                }
            }

            $row['img_event'] = $images;
            $modelsEvent = [];
            $rawModels = trim((string)($row['models_event'] ?? ''));
            if ($rawModels !== '') {
                $partsModels = explode('|||', $rawModels);
                foreach ($partsModels as $modelName) {
                    $cleanModel = trim((string)$modelName);
                    if ($cleanModel !== '' && !in_array($cleanModel, $modelsEvent, true)) {
                        $modelsEvent[] = $cleanModel;
                    }
                }
            }
            $row['models_event'] = $modelsEvent;
            $retrArray[] = $row;
        }

        return $retrArray;
    }

    private function select_events_base($where = "", $params = [])
    {
        $supportsTicketPrice = $this->supportsTicketPriceColumn();
        $supportsGeo = $this->supportsGeoColumns();
        $ticketPriceSelect = $supportsTicketPrice ? "e.ticket_price" : "1.00";
        $geoLatSelect = $supportsGeo ? "e.lat" : "NULL";
        $geoLonSelect = $supportsGeo ? "e.lon" : "NULL";

        $sql = "SELECT
                    e.id_event,
                    e.event_name,
                    e.slug,
                    e.short_description,
                    " . $ticketPriceSelect . " AS ticket_price,
                    " . $geoLatSelect . " AS lat,
                    " . $geoLonSelect . " AS lon,
                    e.event_date,
                    e.status,
                    e.featured,
                    c.city_name,
                    v.venue_name,
                    et.type_name,
                    b.brand_name,
                    COALESCE(
                        (SELECT GROUP_CONCAT(m.model_name ORDER BY em.appearance_order ASC SEPARATOR '|||')
                         FROM event_models em
                         INNER JOIN models m ON m.id_model = em.id_model
                         WHERE em.id_event = e.id_event),
                        ''
                    ) AS models_event,
                    COALESCE(e.poster_image, '') AS card_image,
                    COALESCE(
                        GROUP_CONCAT(ei.image_url ORDER BY ei.id_image ASC SEPARATOR '|||'),
                        ''
                    ) AS img_event
                FROM events e
                INNER JOIN cities c ON c.id_city = e.id_city
                INNER JOIN venues v ON v.id_venue = e.id_venue
                INNER JOIN event_types et ON et.id_event_type = e.id_event_type
                LEFT JOIN brands b ON b.id_brand = e.id_brand
                LEFT JOIN event_images ei ON ei.id_event = e.id_event";

        if ($where !== "") {
            $sql .= " WHERE " . $where;
        }

        $sql .= " GROUP BY
                    e.id_event,
                    e.event_name,
                    e.slug,
                    e.short_description,
                    " . ($supportsTicketPrice ? "e.ticket_price," : "") . "
                    " . ($supportsGeo ? "e.lat, e.lon," : "") . "
                    e.event_date,
                    e.status,
                    e.featured,
                    c.city_name,
                    v.venue_name,
                    et.type_name,
                    b.brand_name,
                    e.poster_image
                ORDER BY e.event_date ASC, e.id_event ASC";

        $rows = $this->fetchAll($sql, $params);
        return $this->normalizeEventsRows($rows);
    }

    public function select_all_events()
    {
        return $this->select_events_base();
    }

    public function select_shop_filters()
    {
        $cities = $this->fetchAll("SELECT city_name FROM cities ORDER BY city_name ASC");
        $models = $this->fetchAll("SELECT model_name FROM models ORDER BY model_name ASC");
        $types = $this->fetchAll("SELECT type_name FROM event_types ORDER BY type_name ASC");
        $brands = $this->fetchAll("SELECT brand_name FROM brands ORDER BY brand_name ASC");

        return [
            'cities' => array_map(function ($row) { return $row['city_name']; }, $cities),
            'models' => array_map(function ($row) { return $row['model_name']; }, $models),
            'types' => array_map(function ($row) { return $row['type_name']; }, $types),
            'brands' => array_map(function ($row) { return $row['brand_name']; }, $brands)
        ];
    }

    public function select_filter_events($filter)
    {
        if (!is_array($filter) || count($filter) === 0) {
            return $this->select_all_events();
        }

        $supportsTicketPrice = $this->supportsTicketPriceColumn();
        $whereParts = [];
        $params = [];
        $index = 0;

        foreach ($filter as $item) {
            if (!is_array($item) || count($item) < 2) {
                continue;
            }

            $key = (string)$item[0];
            $value = trim((string)$item[1]);
            if ($value === "") {
                continue;
            }

            $index++;

            if ($key === 'city_name') {
                $param = ":city_name_" . $index;
                $whereParts[] = "c.city_name = " . $param;
                $params[$param] = $value;
            } elseif ($key === 'type_name') {
                $param = ":type_name_" . $index;
                $whereParts[] = "et.type_name = " . $param;
                $params[$param] = $value;
            } elseif ($key === 'brand_name') {
                $param = ":brand_name_" . $index;
                $whereParts[] = "b.brand_name = " . $param;
                $params[$param] = $value;
            } elseif ($key === 'model_name') {
                $param = ":model_name_" . $index;
                $whereParts[] = "EXISTS (
                    SELECT 1
                    FROM event_models em_filter
                    INNER JOIN models m_filter ON m_filter.id_model = em_filter.id_model
                    WHERE em_filter.id_event = e.id_event
                    AND m_filter.model_name = " . $param . "
                )";
                $params[$param] = $value;
            } elseif ($supportsTicketPrice && $key === 'ticket_price_min' && is_numeric($value)) {
                $param = ":ticket_price_min_" . $index;
                $whereParts[] = "e.ticket_price >= " . $param;
                $params[$param] = max(1, min(20000, (int)round((float)$value)));
            } elseif ($supportsTicketPrice && $key === 'ticket_price_max' && is_numeric($value)) {
                $param = ":ticket_price_max_" . $index;
                $whereParts[] = "e.ticket_price <= " . $param;
                $params[$param] = max(1, min(20000, (int)round((float)$value)));
            }
        }

        if (count($whereParts) === 0) {
            return $this->select_all_events();
        }

        $where = implode(" AND ", $whereParts);
        return $this->select_events_base($where, $params);
    }

    public function select_one_event($idEvent)
    {
        $supportsTicketPrice = $this->supportsTicketPriceColumn();
        $supportsGeo = $this->supportsGeoColumns();
        $ticketPriceSelect = $supportsTicketPrice ? "e.ticket_price" : "1.00";
        $geoLatSelect = $supportsGeo ? "e.lat" : "NULL";
        $geoLonSelect = $supportsGeo ? "e.lon" : "NULL";

        $sql = "SELECT
                    e.id_event,
                    e.id_city,
                    e.id_venue,
                    e.id_event_type,
                    e.id_brand,
                    e.event_name,
                    e.slug,
                    e.short_description,
                    " . $ticketPriceSelect . " AS ticket_price,
                    " . $geoLatSelect . " AS lat,
                    " . $geoLonSelect . " AS lon,
                    e.description,
                    e.event_date,
                    e.end_date,
                    e.poster_image,
                    e.dress_code,
                    e.season_name,
                    e.status,
                    e.featured,
                    e.visits,
                    e.created_at,
                    c.city_name,
                    c.city_image,
                    v.venue_name,
                    v.address,
                    v.capacity,
                    v.venue_image,
                    et.type_name,
                    et.type_image,
                    b.brand_name,
                    b.brand_logo,
                    b.website
                FROM events e
                INNER JOIN cities c ON c.id_city = e.id_city
                INNER JOIN venues v ON v.id_venue = e.id_venue
                INNER JOIN event_types et ON et.id_event_type = e.id_event_type
                LEFT JOIN brands b ON b.id_brand = e.id_brand
                WHERE e.id_event = :id_event
                LIMIT 1";

        return $this->fetchOne($sql, [':id_event' => (int)$idEvent]);
    }

    public function select_event_images($idEvent)
    {
        $sql = "SELECT
                    id_image,
                    id_event,
                    image_url,
                    alt_text
                FROM event_images
                WHERE id_event = :id_event
                ORDER BY id_image ASC";

        return $this->fetchAll($sql, [':id_event' => (int)$idEvent]);
    }

    public function select_event_categories($idEvent)
    {
        $sql = "SELECT
                    c.id_category,
                    c.category_name,
                    c.category_image
                FROM event_categories ec
                INNER JOIN categories c ON c.id_category = ec.id_category
                WHERE ec.id_event = :id_event
                ORDER BY c.category_name ASC";

        return $this->fetchAll($sql, [':id_event' => (int)$idEvent]);
    }

    public function select_event_models($idEvent)
    {
        $sql = "SELECT
                    m.id_model,
                    m.model_name,
                    m.stage_name,
                    m.main_image,
                    em.role_name,
                    em.appearance_order
                FROM event_models em
                INNER JOIN models m ON m.id_model = em.id_model
                WHERE em.id_event = :id_event
                ORDER BY em.appearance_order ASC, m.id_model ASC";

        return $this->fetchAll($sql, [':id_event' => (int)$idEvent]);
    }

    public function select_event_extras($idEvent)
    {
        $sql = "SELECT
                    ex.id_extra,
                    ex.extra_name,
                    ex.icon_class
                FROM event_extras ee
                INNER JOIN extras ex ON ex.id_extra = ee.id_extra
                WHERE ee.id_event = :id_event
                ORDER BY ex.extra_name ASC";

        return $this->fetchAll($sql, [':id_event' => (int)$idEvent]);
    }

    public function increment_event_visit($idEvent)
    {
        $conexion = connect::con();
        $stmt = $conexion->prepare("UPDATE events SET visits = visits + 1 WHERE id_event = :id_event");
        $stmt->bindValue(':id_event', (int)$idEvent, PDO::PARAM_INT);
        $ok = $stmt->execute();
        connect::close($conexion);
        return $ok;
    }
}
