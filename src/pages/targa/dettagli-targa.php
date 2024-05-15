<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricerca targa</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Libre+Baskerville&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/dettagliStyle.css">
    <link rel="stylesheet" href="/css/genericCard.css">
    <link rel="stylesheet" href="/css/revisioneCard.css">
    <link rel="stylesheet" href="/css/targaCard.css">
    <link rel="stylesheet" href="/css/addForm.css">
    
    <script type="text/javascript" src="/js/jquery-3.7.1.js"></script>
    <script src="https://kit.fontawesome.com/0a63b22d0b.js" crossorigin="anonymous"></script>
    <script src="/js/renderTarga.js"></script>
    <script src="/js/renderVeicolo.js"></script>
    <!-- <script src="/js/performSearchRevisioni.js"></script> -->
    <script src="/js/renderRevisione.js"></script>
    <script src="/js/addForm.js"></script>
    <script src="/js/dettagliTarga.js"></script>
    <script src="/js/ajaxHelper.js"></script>
    <script src="/js/activePage.js"></script>
</head>

<body>
    <?php include '../../includes/header.php'; ?>
    <div class="container">
        <div class="navigation">
            <?php include '../../includes/navigation.php'; ?>
        </div>
        <div class="content">
            <!-- Search Form -->
            <div class="titolo-container">
                <div id="titolo"></div>
                <button id="addButton"><i class="fa-solid fa-plus"></i></button>
            </div>
            <!-- Search Results -->
            <div id="dettagli-content">
                <div class="targa">
                    <div class="titolo"></div>
                    <div id="targa"></div>
                </div>
                <div class="veicolo">
                    <div class="titolo"></div>
                    <div id="veicolo"></div>
                </div>
                <div class="revisione">
                    <div class="titolo"></div>
                    <div id="revisione"></div>
                </div>
            </div>
        </div>
        <div class="addFormDiv" style="display: none;">
            <h2>Aggiungi nuova revisione</h2>
            <form id="addForm">
                <div class="form-group">
                    <label for="addTarga">Targa:</label>
                    <input type="text" id="addTarga" name="addTarga" required>
                </div>
                <div class="form-group">
                    <label for="addDataRev">Data Revisione:</label>
                    <input type="date" id="addDataRev" name="addDataRev" required>
                </div>
                <div class="form-group">
                    <label for="addEsito">Esito:</label>
                    <select id="addEsito" name="addEsito" required>
                        <option value="">Select</option>
                        <option value="positivo">Positivo</option>
                        <option value="negativo">Negativo</option>
                    </select>
                </div>
                <div class="form-group" id="addMotivazioneDiv" style="display: none;">
                    <label for="addMotivazione">Motivazione:</label>
                    <input type="text" id="addMotivazione" name="addMotivazione">
                </div>
                <div class="button-group">
                    <button type="submit" class="submit-button">Submit<i class="fa-solid fa-paper-plane"></i></button>
                    <button id="undoButton" class="undo-button"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </form>
        </div>

    </div>
</body>
<?php include '../../includes/footer.php'; ?>