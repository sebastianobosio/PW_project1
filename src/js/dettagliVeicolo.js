import {
    toggleFormVisibility,
    addEsitoChanged,
    showAddForm,
    hideAddForm,
    addFormSubmitted,
} from "./addRevisionForm.js";
import { loadRevisioniDiv } from "./loadRevisions.js";

export function initializePage() {
    $(document).ready(function () {
        $("#addForm").submit(function (event) {
            console.log("siìasf");
            event.preventDefault();
            var formData =
                $(this).serialize() +
                "&addTarga=" +
                targaAttiva.numero +
                "&action=create";
            addFormSubmitted(event, formData, () => loadRevisioniDiv(targhe));
        });
        $("#addEsito").change(addEsitoChanged); // need to be copied for the #editEsitoS

        $("#addButton").on("click", showAddForm);
        $("#undoButton").on("click", function (event) {
            hideAddForm(event);
        });
        // Function to fetch car details based on ID
        async function fetchVeicoloDetails(id) {
            console.log(id);
            try {
                const veicoloResponse = await new Promise((resolve, reject) => {
                    handleAjaxRequest(
                        "/php/search_veicolo.php", // URL to fetch car details from the server
                        "GET",
                        "telaio=" + id,
                        resolve,
                        reject
                    );
                });
                if (veicoloResponse.success == true) {
                    console.log(veicoloResponse.data[0]);
                    const veicolo = veicoloResponse.data[0];
                    $("#titolo").html(
                        "<h1>Dettagli sul veicolo " + veicolo.telaio + "</h1>"
                    );
                    const veicoloComponent = renderVeicoloDetail(veicolo);
                    veicoloComponent.appendTo($("#veicolo"));

                    const targaResponse = await new Promise(
                        (resolve, reject) => {
                            handleAjaxRequest(
                                "/php/search_targa.php",
                                "GET",
                                "telaio=" + veicolo.telaio,
                                resolve,
                                reject
                            );
                        }
                    );
                    console.log(targaResponse);
                    var state = false;
                    //targhe = [];
                    if (targaResponse.success == true) {
                        var length = targaResponse.data.length;
                        var targaText =
                            length === 1
                                ? "è associata " + length + " targa"
                                : "sono associate " + length + " targhe";
                        $(".targa .titolo").html(
                            "<h3>A questo veicolo " + targaText + "</h3>"
                        );
                        targaResponse.data.forEach((targa) => {
                            console.log(targa);
                            if (targa.status == "active") {
                                targaAttiva = targa;
                                console.log(targaAttiva);
                                state = true;
                            }
                            // here i could save targhe infos and sort them to find the active one and put it first, but i'm lazy :)
                            // better if done in the backend. I actually done it
                            targhe.push(targa.numero);
                            var targaComponent = renderTargaCard(targa);
                            targaComponent.appendTo($("#targa"));
                        });
                    } else {
                        $(".targa .titolo").html(
                            "<h3>Questo veicolo non è ancora stato targato</h3>"
                        );
                    }
                    console.log("popii" + state);
                    toggleFormVisibility(
                        state,
                        state ? targaAttiva.numero : null
                    );
                    console.log(targhe);
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

        //var targhe = null;
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

export function getTarghe() {
    return targhe;
}
