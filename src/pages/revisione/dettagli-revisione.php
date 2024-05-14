<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca targa</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Libre+Baskerville&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">

    <script type="text/javascript" src="/js/jquery-3.7.1.js"></script>
    <script src="/js/renderTarga.js"></script>
    <script src="/js/renderVeicolo.js"></script>
   <!-- <script src="/js/performSearchRevisioni.js"></script> -->
    <script src="/js/renderRevisione.js"></script>
    <script src="/js/dettagliRevisione.js"></script>
    <script src="/js/ajaxHelper.js"></script>
    <script src="/js/activePage.js"></script>
</head>
<body>
    <?php include '../../includes/header.php'; ?>
    <div class="container">
        <div class="navigation">
            <?php include '../../includes/navigation.php'; ?>
        </div>
        <div id="titolo"></div>
        <div class="dettagliRevisione">
            <div id="revisione"></div>
            <div id="veicoloAssociato"></div>
            <div id="targaAssociata"></div>
        </div>
    </div>
</body>
<?php include '../../includes/footer.php'; ?>