<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca targa</title>
    <link rel="stylesheet" href="../css/style.css">
    <script type="text/javascript" src="../js/jquery-3.7.1.js"></script>
    <script src="../js/search_veicolo.js"></script>
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
                <label for="targa">Targa:</label>
                <input type="text" id="targa" name="targa">
                <br>
                <label for="telaio">Telaio:</label>
                <input type="text" id="telaio" name="telaio">
                <br>
                <label for="status">Stato:</label>
                <select id="status" name="status">
                    <option value="active">Attiva</option>
                    <option value="returned">Resituita</option>
                    <option value="both" selected>Tutte</option>
                </select>
                <br>
                <button type="submit">Search</button>
            </form>
            <!-- Search Results -->
            <div id="searchResults"></div>
        </div>
    </div>
</body>
<?php include '../includes/footer.php'; ?>