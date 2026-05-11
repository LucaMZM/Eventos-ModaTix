<?php
include_once(__DIR__ . "/../../../model/connect.php");

class DAOHome
{
    private function fetchAll($sql, $params = [])
    {
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute($params);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    public function select_home_hero()
    {
        $sql = "SELECT
                    e.id_event,
                    e.event_name,
                    e.short_description,
                    e.description,
                    e.event_date,
                    e.status,
                    e.featured,
                    c.city_name,
                    v.venue_name,
                    et.type_name,
                    b.brand_name,
                    COALESCE(
                        (SELECT ei.image_url
                         FROM event_images ei
                         WHERE ei.id_event = e.id_event
                         ORDER BY ei.id_image ASC
                         LIMIT 1),
                        e.poster_image,
                        ''
                    ) AS image_url
                FROM events e
                INNER JOIN cities c ON c.id_city = e.id_city
                INNER JOIN venues v ON v.id_venue = e.id_venue
                INNER JOIN event_types et ON et.id_event_type = e.id_event_type
                LEFT JOIN brands b ON b.id_brand = e.id_brand
                ORDER BY e.featured DESC, e.event_date ASC, e.id_event ASC";
        return $this->fetchAll($sql);
    }

    public function select_home_events()
    {
        $sql = "SELECT
                    e.id_event,
                    e.event_name,
                    e.slug,
                    e.short_description,
                    e.event_date,
                    e.status,
                    c.city_name,
                    v.venue_name,
                    et.type_name,
                    b.brand_name,
                    COALESCE(
                        e.poster_image,
                        (SELECT ei.image_url
                         FROM event_images ei
                         WHERE ei.id_event = e.id_event
                         ORDER BY ei.id_image ASC
                         LIMIT 1),
                        ''
                    ) AS card_image
                FROM events e
                INNER JOIN cities c ON c.id_city = e.id_city
                INNER JOIN venues v ON v.id_venue = e.id_venue
                INNER JOIN event_types et ON et.id_event_type = e.id_event_type
                LEFT JOIN brands b ON b.id_brand = e.id_brand
                ORDER BY e.event_date ASC, e.id_event ASC";
        return $this->fetchAll($sql);
    }

    public function select_home_popular()
    {
        $sql = "SELECT
                    e.id_event,
                    e.event_name,
                    e.slug,
                    e.short_description,
                    e.event_date,
                    e.status,
                    e.visits,
                    c.city_name,
                    v.venue_name,
                    et.type_name,
                    b.brand_name,
                    COALESCE(
                        e.poster_image,
                        (SELECT ei.image_url
                         FROM event_images ei
                         WHERE ei.id_event = e.id_event
                         ORDER BY ei.id_image ASC
                         LIMIT 1),
                        ''
                    ) AS card_image
                FROM events e
                INNER JOIN cities c ON c.id_city = e.id_city
                INNER JOIN venues v ON v.id_venue = e.id_venue
                INNER JOIN event_types et ON et.id_event_type = e.id_event_type
                LEFT JOIN brands b ON b.id_brand = e.id_brand
                ORDER BY e.visits DESC, e.event_date ASC, e.id_event ASC
                LIMIT 3";
        return $this->fetchAll($sql);
    }

    public function select_home_models()
    {
        $sql = "SELECT
                    m.id_model,
                    m.model_name,
                    m.stage_name,
                    m.nationality,
                    m.age,
                    m.height_cm,
                    m.main_image,
                    m.instagram,
                    m.is_featured,
                    b.brand_name
                FROM models m
                LEFT JOIN brands b ON b.id_brand = m.id_brand
                ORDER BY m.is_featured DESC, m.id_model ASC";
        return $this->fetchAll($sql);
    }

    public function select_home_categories()
    {
        $sql = "SELECT
                    id_category,
                    category_name,
                    category_image,
                    description
                FROM categories
                ORDER BY id_category ASC";
        return $this->fetchAll($sql);
    }

    public function select_home_cities()
    {
        $sql = "SELECT
                    c.id_city,
                    c.city_name,
                    c.city_image,
                    c.description,
                    COUNT(e.id_event) AS total_events
                FROM cities c
                LEFT JOIN events e ON e.id_city = c.id_city
                GROUP BY
                    c.id_city,
                    c.city_name,
                    c.city_image,
                    c.description
                ORDER BY total_events DESC, c.city_name ASC";
        return $this->fetchAll($sql);
    }

    public function select_home_venues()
    {
        $sql = "SELECT
                    v.id_venue,
                    v.venue_name,
                    v.address,
                    v.capacity,
                    v.venue_image,
                    v.description,
                    c.city_name
                FROM venues v
                INNER JOIN cities c ON c.id_city = v.id_city
                ORDER BY v.id_venue ASC";
        return $this->fetchAll($sql);
    }

    public function select_home_brands()
    {
        $sql = "SELECT
                    id_brand,
                    brand_name,
                    brand_logo,
                    website,
                    description
                FROM brands
                ORDER BY id_brand ASC";
        return $this->fetchAll($sql);
    }

    public function select_all_home()
    {
        return $this->select_home_events();
    }
}
