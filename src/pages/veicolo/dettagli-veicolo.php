<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca targa</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/targa.css">
    <link rel="stylesheet" href="/css/veicolo.css">
    <link rel="stylesheet" href="/css/revisione.css">
    <script type="text/javascript" src="/js/jquery-3.7.1.js"></script>
    <script src="/js/renderTarga.js"></script>
    <script src="/js/renderVeicolo.js"></script>
    <script src="/js/renderRevisione.js"></script>
    <script src="/js/dettagliVeicolo.js"></script>
    <script src="/js/ajaxHelper.js"></script>
    <script src="/js/activePage.js"></script>
</head>
<body>
    <?php include '../../includes/header.php'; ?>
    <div class="container">
        <div class="navigation">
            <?php include '../../includes/navigation.php'; ?>
        </div>
        <div class="dettagliVeicolo">
            <div id="veicolo"></div>
            <div id="targheAssociate"></div>
            <div id="revisioniAssociate"></div>
        </div>
    </div>
</body>
<?php include '../../includes/footer.php'; ?>