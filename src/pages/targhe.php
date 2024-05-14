<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca targa</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Libre+Baskerville&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/genericCard.css">
    <script type="text/javascript" src="/js/jquery-3.7.1.js"></script>
    <script src="https://kit.fontawesome.com/0a63b22d0b.js" crossorigin="anonymous"></script>
    <script src="/js/renderTarga.js"></script>
    <script src="/js/ajaxHelper.js"></script>
    <script src="/js/searchTarga.js"></script>
    <script src="../js/activePage.js"></script>
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <div class="navigation">
            <?php include '../includes/navigation.php'; ?>
        </div>
        <div class="content">
            <!-- Search Form -->
            <div class="searchContainer">
            <form id="searchForm">
                <div>
                    <label for="targa">Targa:</label>
                    <input type="text" id="targa" name="targa">
                </div>
                <div>
                    <label for="telaio">Telaio:</label>
                    <input type="text" id="telaio" name="telaio">
                </div>
                <div>
                    <label for="status">Stato:</label>
                    <select id="status" name="status">
                        <option value="active">Attiva</option>
                        <option value="returned">Resituita</option>
                        <option value="both" selected>Tutte</option>
                    </select>
                </div>
                <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
            </form>
</div>
            <!-- Search Results -->
            <div id="searchResults"></div>
        </div>
    </div>
</body>
<?php include '../includes/footer.php'; ?>