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
                    <label for="esito">Esito:</label>
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
        <div class="addForm">
            <h2>Add New Entry</h2>
            <form id="addForm">
                <label for="addTarga">Targa:</label>
                <input type="text" id="addTarga" name="addTarga" required><br><br>
                <label for="addDataRev">Data Revisione:</label>
                <input type="date" id="addDataRev" name="addDataRev" required><br><br>
                <label for="addEsito">Esito:</label>
                <select id="addEsito" name="addEsito" required>
                    <option value="">Select</option>
                    <option value="positivo">Positivo</option>
                    <option value="negativo">Negativo</option>
                </select><br><br>
                <div id="addMotivazioneDiv" style="display: none;">
                    <label for="addMotivazione">Motivazione:</label>
                    <input type="text" id="addMotivazione" name="addMotivazione">
                </div>
                <br>
                <button type="submit">Submit</button>
            </form>
        </div>

        <div class="editForm" style="display: none">
            <h2>Edit Entry</h2>
            <form id="editForm">
                <label for="editTarga">Targa:</label>
                <input type="text" id="editTarga" name="editTarga" required><br><br>
                <label for="editDataRev">Data Revisione:</label>
                <input type="date" id="editDataRev" name="editDataRev" required><br><br>
                <label for="editEsito">Esito:</label>
                <select id="editEsito" name="editEsito" required>
                    <option value="">Select</option>
                    <option value="positivo">Positivo</option>
                    <option value="negativo">Negativo</option>
                </select><br><br>
                <div id="editMotivazioneDiv" style="display: none;">
                    <label for="editMotivazioneDiv">Motivazione:</label>
                    <input type="text" id="editMotivazioneDiv" name="editMotivazioneDiv">
                </div>
                <br>
                <button type="submit">Submit</button>
            </form>
        </div>
    </div>
</body>
<?php include '../includes/footer.php'; ?>