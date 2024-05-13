<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca veicolo</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/veicolo.css">
    <script type="text/javascript" src="/js/jquery-3.7.1.js"></script>
    <script src="/js/renderVeicolo.js"></script>
    <script src="/js/ajaxHelper.js"></script>
    <script src="/js/searchVeicolo.js"></script>
    <script src="/js/activePage.js"></script>
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <div class="navigation">
            <?php include '../includes/navigation.php'; ?>
        </div>
        <div class="results">
            <!-- Search Form -->
            <form id="searchForm">
                <div>
                    <label for="telaio">Telaio:</label>
                    <input type="text" id="telaio" name="telaio">
                </div>
                <div>
                    <label for="modello">Modello:</label>
                    <input type="text" id="modello" name="modello">
                </div>
                <div>
                    <label for="marca">Marca:</label>
                    <input type="text" id="marca" name="marca">
                </div>
                <button type="submit">Cerca</button>
            </form>


            <!-- Search Results -->
            <div id="searchResults"></div>
        </div>
    </div>
</body>
<?php include '../includes/footer.php'; ?>