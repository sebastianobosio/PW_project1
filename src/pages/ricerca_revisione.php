<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca revisione</title>
    <link rel="stylesheet" href="../css/style.css">
    <script type="text/javascript" src="../js/jquery-3.7.1.js"></script>
    <script src="../js/search_revisione.js"></script>
    <script src="../js/test.js"></script>
    <script src="../js/active_page.js"></script>
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
                    <label for="numero">Numero:</label>
                    <input type="text" id="numero" name="numero">
                </div>
                <div>
                    <label for="targa">Targa:</label>
                    <input type="text" id="targa" name="targa">
                </div>
                <div>
                    <label for="dataRev">Data Revisione:</label>
                    <input type="text" id="dataRev" name="dataRev">
                </div>
                <div>
                    <select id="esito" name="esito">
                            <option value="positive">Positivo</option>
                            <option value="negative">Negativo</option>
                            <option value="both" selected>Entrambi</option>
                    </select>
                </div>
                <button type="submit">Cerca</button>
            </form>


            <!-- Search Results -->
            <div id="searchResults"></div>
        </div>
    </div>
</body>
<?php include '../includes/footer.php'; ?>