import {
    toggleFormVisibility,
    addEsitoChanged,
    showAddForm,
    hideAddForm,
    addFormSubmitted
} from "../modules/addRevisionForm.js";
import {loadRevisioniDiv} from "../modules/loadRevisions.js";
import {renderVeicoloCard} from "../renderComponents/renderVeicolo.js";
import {renderTargaDetail} from "../renderComponents/renderTarga.js";

var targa = null;

// this function is called from the initDettagliVeicolo.js once the dettagli-veicolo.php page is laoded
export function initializePage() {
    // Function to fetch targa details based on ID (targa's number), once that get the targa
    // use the telaio to get the vehicle details. From the targa number to the linked revisions
    // The revisions are loaded by loadRevisionDiv that takes plate as an input and basically calls
    // renderRevisionCard.js for each revision linked the plate.
    $(document).ready(function () {
        $("#addForm").submit(function (event) {
            event.preventDefault();
            var formData = $(this).serialize() + "&addTarga=" + targa.numero + "&action=create";
            addFormSubmitted(event, formData, () => loadRevisioniDiv(targa.numero));
        });
        $("#addEsito").change(addEsitoChanged); // need to be copied for the #editEsitoS

        $("#addButton").on("click", showAddForm);
        $("#undoButton").on("click", function (event) {
            hideAddForm(event);
        });
        // Function to fetch car details based on ID
        async function fetchTargaDetails(id) {
            try {
                const targaResponse = await new Promise((resolve, reject) => {
                    handleAjaxRequest("/php/search_targa.php", // URL to fetch car details from the server
                            "GET", "targa=" + id,
                    resolve, reject);
                });
                if (targaResponse.success == true) {
                    targa = targaResponse.data[0];
                    const targaStatus = targa.status;
                    const state = targaStatus == "active";
                    $("#titolo").html("<h1>Dettagli sulla targa " + targa.numero + "</h1>");
                    const targaComponent = renderTargaDetail(targa);
                    targaComponent.appendTo($("#targa"));

                    const veicoloResponse = await new Promise((resolve, reject) => {
                        handleAjaxRequest("/php/search_veicolo.php", "GET", "telaio=" + targa.veicolo, resolve, reject);
                    });
                    if (veicoloResponse.success == true) {
                        var veicolo = veicoloResponse.data[0];
                        var veicoloComponent = renderVeicoloCard(veicolo);
                        if (state) {
                            $(".veicolo .titolo").html("<h3>Veicolo attualmente associato</h3>");
                        } else {
                            $(".veicolo .titolo").html("<h3>Ultimo veicolo associato</h3>");
                        } veicoloComponent.appendTo($("#veicolo"));
                    } else {
                        $(".veicolo .titolo").html("<h3>Nessun veicolo associato. Strano!</h3>");
                        // render niente veicolo per questa targa
                        // non dovrebbe mai accadere. Ogni targa ha almeno un veicolo per costruzione del db
                    }
                    // Add form only if the plate is active
                    toggleFormVisibility(state, state ? targa.numero : null);
                    loadRevisioniDiv(targa.numero);
                } else {
                    alert("Non sono state trovate corrispondenze");
                    returnToMotherPage();
                }
            } catch (error) {
                console.error("Error", error);
                alert("Error occurred while fetching data.");
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const targaNumber = urlParams.get("id");
        // global variable
        // Fetch car details based on the ID
        fetchTargaDetails(targaNumber);
    });
}

function returnToMotherPage() {
    var motherURL = "/pages/targhe.php";
    window.location.href = motherURL;
}

// used by revisionHandlers.js to handle the reloadOnEdit or reloadOnDelete that are called when editing or deleting a revions Card
export function getTarga() {
    return targa.numero;
}
