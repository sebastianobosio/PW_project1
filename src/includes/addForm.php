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
                <option value="positive">Positivo</option>
                <option value="negative">Negativo</option>
            </select>
        </div>
        <div class="form-group" id="addMotivazioneDiv" style="display: none;">
            <label for="addMotivazione">Motivazione:</label>
            <textarea class="motivazione" oninput="autoResize()" id="addMotivazione" name="addMotivazione"></textarea>
        </div>
        <div class="button-group">
            <button type="submit" class="submit-button">Invia<i class="fa-solid fa-paper-plane"></i></button>
            <button id="undoButton" class="undo-button"><i class="fa-solid fa-xmark"></i></button>
        </div>
    </form>
</div>