<?php
$page = $_GET['page'] ?? 'homepage';

switch ($page) {
    case "homepage":
    case "controller_home":
        $_GET['op'] = $_GET['op'] ?? 'view';
        include("module/home/controller/controller_home.php");
        break;
    case "shop":
        $_GET['op'] = $_GET['op'] ?? 'list';
        include("module/shop/controller/controller_shop.php");
        break;
    case "404":
        include("view/inc/error404.php");
        break;
    case "503":
        include("view/inc/error503.php");
        break;
    default:
        $_GET['op'] = 'view';
        include("module/home/controller/controller_home.php");
        break;
}
?>
