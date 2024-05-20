import {
    toggleFormVisibility,
    addEsitoChanged,
    showAddForm,
    hideAddForm,
    addFormSubmitted
} from "../modules/addRevisionForm.js";
import {loadRevisioniDiv} from "../modules/loadRevisions.js";
import {renderTargaCard} from "../renderComponents/renderTarga.js";
import {renderVeicoloDetail} from "../renderComponents/renderVeicolo.js";

// this function is called from the initDettagliVeicolo.js once the dettagli-veicolo.php page is laoded
export function initializePage() {
    // Function to fetch vehicle details based on ID (telaio's number), once that get the vehicle
    // use the telaio to get the targhe details. From the plates it use the plates.number to get the linked revisions
    // The revisions are loaded by loadRevisionDiv that takes plates as an input and basically calls
    // renderRevisionCard.js for each revision linked to each plate.
    $(document).ready(function () {
        $("#addForm").submit(function (event) {
            event.preventDefault();
            var formData = $(this).serialize() + "&addTarga=" + targaAttiva.numero + "&action=create";
            // when the form is submitted the callback function is called, and will reload the revisionDiv
            addFormSubmitted(event, formData, () => loadRevisioniDiv(targhe));
        });
        $("#addEsito").change(addEsitoChanged); // need to be copied for the #editEsitoS

        $("#addButton").on("click", showAddForm);
        $("#undoButton").on("click", function (event) {
            hideAddForm(event);
        });
        // Function to fetch car details based on ID
        async function fetchVeicoloDetails(id) {
            try {
                const veicoloResponse = await new Promise((resolve, reject) => {
                    handleAjaxRequest("/php/search_veicolo.php", // URL to fetch car details from the server
                            "GET", "telaio=" + id,
                    resolve, reject);
                });
                if (veicoloResponse.success == true) {
                    const veicolo = veicoloResponse.data[0];
                    $("#titolo").html("<h1>Dettagli sul veicolo " + veicolo.telaio + "</h1>");
                    const veicoloComponent = renderVeicoloDetail(veicolo);
                    veicoloComponent.appendTo($("#veicolo"));

                    const targaResponse = await new Promise((resolve, reject) => {
                        handleAjaxRequest("/php/search_targa.php", "GET", "telaio=" + veicolo.telaio, resolve, reject);
                    });
                    var state = false;
                    // targhe = [];
                    if (targaResponse.success == true) {
                        var length = targaResponse.data.length;
                        var targaText = length === 1 ? "è associata " + length + " targa" : "sono associate " + length + " targhe";
                        $(".targa .titolo").html("<h3>A questo veicolo " + targaText + "</h3>");
                        targaResponse.data.forEach((targa) => {
                            if (targa.status == "active") {
                                targaAttiva = targa;
                                state = true;
                            }
                            // here i could save targhe infos and sort them to find the active one and put it first, but i'm lazy :)
                            // better if done in the backend. I actually done it
                            targhe.push(targa.numero);
                            var targaComponent = renderTargaCard(targa);
                            targaComponent.appendTo($("#targa"));
                        });
                    } else {
                        $(".targa .titolo").html("<h3>Questo veicolo non è ancora stato targato</h3>");
                    }
                    // if there's an activePlate than the addForm is displayed and prepared
                    toggleFormVisibility(state, state ? targaAttiva.numero : null);
                    loadRevisioniDiv(targhe);
                    // non devo più fare la richiesta per ottenere le targhe, le ho già da prima
                } else {
                    alert("Non sono state trovate corrispondenze");
                    returnToMotherPage();
                }
            } catch (error) {
                console.error("Error", error);
                alert("Error occurred while fetching data.");
            }
        }

        // var targhe = null;
        var targaAttiva = null;
        // Fetch car details based on the ID
        fetchVeicoloDetails(veicoloNumber);
    });

    // Get car ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const veicoloNumber = urlParams.get("id");
}
var targhe = [];

function returnToMotherPage() {
    var motherURL = "/pages/veicoli.php";
    window.location.href = motherURL;
}

// used by revisionHandlers.js to handle the reloadOnEdit or reloadOnDelete that are called when editing or deleting a revions Card
export function getTarghe() {
    return targhe;
}
