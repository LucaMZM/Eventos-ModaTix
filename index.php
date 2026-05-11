<?php
session_start();
$page = $_GET['page'] ?? 'homepage';
$isHome = ($page === 'homepage' || $page === 'controller_home');

if ($isHome) {
    include("view/inc/top_page_home.html");
} else {
    include("view/inc/top_page.html");
}
?>
<div id="wrapper">
    <div id="header">
        <?php include("view/inc/header.html"); ?>
    </div>
    <div id="menu">
        <?php include("view/inc/menu.html"); ?>
    </div>
    <?php if ($isHome) { ?>
        <div id="contenido-home">
            <?php include("view/inc/pages.php"); ?>
        </div>
    <?php } else { ?>
        <div id="contenido">
            <?php include("view/inc/pages.php"); ?>
        </div>
    <?php } ?>
    <div id="footer">
        <?php include("view/inc/footer.html"); ?>
    </div>
</div>
<?php include("view/inc/bottom_page.html"); ?>
