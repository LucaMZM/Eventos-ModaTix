<?php
include_once(__DIR__ . "/../model/DAOShop.php");
@session_start();

$op = $_GET['op'] ?? 'list';
$daoShop = new DAOShop();

switch ($op) {
    case 'list':
        include(__DIR__ . "/../view/shop.html");
        break;

    case 'all_events':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daoShop->select_all_events() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'print_filters':
        header('Content-Type: application/json; charset=utf-8');
        try {
            echo json_encode($daoShop->select_shop_filters() ?: []);
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'filter':
        header('Content-Type: application/json; charset=utf-8');
        $filters = $_POST['filter'] ?? [];
        if (is_string($filters)) {
            $decoded = json_decode($filters, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $filters = $decoded;
            } else {
                $filters = [];
            }
        }
        if (!is_array($filters)) {
            $filters = [];
        }
        try {
            $eventsFilter = $daoShop->select_filter_events($filters);
            if (!empty($eventsFilter)) {
                echo json_encode($eventsFilter);
            } else {
                echo json_encode("error");
            }
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    case 'details_event':
        header('Content-Type: application/json; charset=utf-8');
        $idEvent = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if ($idEvent <= 0) {
            echo json_encode("error");
            exit;
        }

        try {
            $event = $daoShop->select_one_event($idEvent);
            $images = $daoShop->select_event_images($idEvent);
            $categories = $daoShop->select_event_categories($idEvent);
            $models = $daoShop->select_event_models($idEvent);
            $extras = $daoShop->select_event_extras($idEvent);
        } catch (Exception $e) {
            echo json_encode("error");
            exit;
        }

        if (!empty($event)) {
            echo json_encode([
                'event' => $event,
                'images' => $images,
                'categories' => $categories,
                'models' => $models,
                'extras' => $extras
            ]);
        } else {
            echo json_encode("error");
        }
        exit;

    case 'add_visit':
        header('Content-Type: application/json; charset=utf-8');
        $idEvent = isset($_POST['id']) ? (int)$_POST['id'] : 0;
        if ($idEvent <= 0) {
            echo json_encode("error");
            exit;
        }
        try {
            $ok = $daoShop->increment_event_visit($idEvent);
            echo json_encode($ok ? "done" : "error");
        } catch (Exception $e) {
            echo json_encode("error");
        }
        exit;

    default:
        include(__DIR__ . "/../../../view/inc/error404.php");
        break;
}
