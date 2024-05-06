<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca targa</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/targa.css">
    <script type="text/javascript" src="../js/jquery-3.7.1.js"></script>
    <script src="../js/ajaxHelper.js"></script>
    <script src="../js/searchTarga.js"></script>
    <script src="../js/activePage.js"></script>
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
                <button type="submit">Search</button>
            </form>
            <!-- Search Results -->
            <div id="searchResults"></div>
        </div>
    </div>
</body>
<?php include '../includes/footer.php'; ?>