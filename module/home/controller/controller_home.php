<?php
include_once(__DIR__ . "/../model/DAOHome.php");
@session_start();

$op = $_GET['op'] ?? 'view';
$daohome = new DAOHome();

switch ($op) {
    case 'view':
        include(__DIR__ . "/../view/home.html");
        break;

    case 'homePageHero':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daohome->select_home_hero() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'homePageEvents':
    case 'homePageCategory':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daohome->select_home_events() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'homePagePopular':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daohome->select_home_popular() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'homePageModels':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daohome->select_home_models() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'homePageCategories':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daohome->select_home_categories() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'homePageCities':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daohome->select_home_cities() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'homePageVenues':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daohome->select_home_venues() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'homePageBrands':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daohome->select_home_brands() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    default:
        include(__DIR__ . "/../../../view/inc/error404.php");
        break;
}
