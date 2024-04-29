<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca veicolo</title>
    <link rel="stylesheet" href="../css/style.css">
    <script type="text/javascript" src="../js/jquery-3.7.1.js"></script>
    <script src="../js/search_vehicle.js"></script>
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
                <label for="telaio">Telaio:</label>
                <input type="text" id="telaio" name="telaio">
                <label for="model">Modello:</label>
                <input type="text" id="model" name="model">
                <label for="marca">Marca:</label>
                <input type="text" id="marca" name="marca">
                <button type="submit">Cerca</button>
            </form>

            <!-- Search Results -->
            <div id="searchResults"></div>
        </div>
    </div>
</body>
<?php include '../includes/footer.php'; ?>