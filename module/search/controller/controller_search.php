<?php
include_once(__DIR__ . "/../model/DAOSearch.php");
@session_start();

$op = $_GET['op'] ?? '';
$daoSearch = new DAOSearch();

switch ($op) {
    case 'autocomplete_city':
        header('Content-Type: application/json; charset=utf-8');
        try {
            $query = $_POST['q'] ?? '';
            echo json_encode($daoSearch->select_city_suggestions($query, 8));
        } catch (Exception $e) {
            echo json_encode([]);
        }
        exit;

    default:
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([]);
        exit;
}
