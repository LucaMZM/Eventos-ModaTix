<?php
include_once(__DIR__ . "/../../../model/connect.php");

class DAOSearch
{
    private function fetchAll($sql, $params = [])
    {
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value, PDO::PARAM_STR);
        }
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $rows ?: [];
    }

    public function select_city_suggestions($query, $limit = 8)
    {
        $needle = trim((string)$query);
        if ($needle === '') {
            return [];
        }

        $safeLimit = (int)$limit;
        if ($safeLimit < 1) {
            $safeLimit = 1;
        }
        if ($safeLimit > 20) {
            $safeLimit = 20;
        }

        $sql = "SELECT city_name
                FROM cities
                WHERE city_name LIKE :query
                ORDER BY city_name ASC
                LIMIT " . $safeLimit;

        return $this->fetchAll($sql, [':query' => $needle . '%']);
    }
}
