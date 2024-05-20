<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca revisione</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Libre+Baskerville&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/addForm.css">
    <link rel="stylesheet" href="/css/genericCard.css">
    <link rel="stylesheet" href="/css/revisioneCard.css">
    <link rel="stylesheet" href="/css/textarea.css">
    
    <script type="text/javascript" src="/js/jquery-3.7.1.js"></script>   
    <script src="https://kit.fontawesome.com/0a63b22d0b.js" crossorigin="anonymous"></script>
    
    <script src="/js/resizeMotivazioneField.js"></script>
    <script src="/js/ajaxHelper.js"></script>
    <script src="/js/activePage.js"></script>
    <!--<script type="module" src="/js/renderComponents/renderRevisione.js"></script>-->
    <script type="module" src="/js/pages/revisione.js"></script>
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
                        <label for="numero">Numero:</label>
                        <input type="text" id="numero" name="numero">
                    </div>
                    <div>
                        <label for="targa">Targa:</label>
                        <input type="text" id="targa" name="targa">
                    </div>
                    <div>
                        <label for="dataRev">Data Revisione:</label>
                        <input type="date" id="dataRev" name="dataRev">
                    </div>
                    <div>
                        <label for="esito">Esito:</label>
                        <select id="esito" name="esito">
                            <option value="positive">Positivo</option>
                            <option value="negative">Negativo</option>
                            <option value="both" selected>Entrambi</option>
                        </select>
                    </div>
                    <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
                </form>
                <button id="addButton"><i class="fa-solid fa-plus"></i></button>
            </div>
            <!-- Search Results -->
            <div id="searchResults"></div>
        </div>
        <?php include '../includes/addForm.php'; ?>
    </div>
</body>
<?php include '../includes/footer.php'; ?>