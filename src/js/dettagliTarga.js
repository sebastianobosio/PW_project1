import {
    toggleFormVisibility,
    addEsitoChanged,
    showAddForm,
    hideAddForm,
    addFormSubmitted,
} from "./addRevisionForm.js";
import { loadRevisioniDiv } from "./loadRevisions.js";

var targa = null;

export function initializePage() {
    $(document).ready(function () {
        $("#addForm").submit(function (event) {
            console.log("siìasf");
            event.preventDefault();
            var formData =
                $(this).serialize() +
                "&addTarga=" +
                targa.numero +
                "&action=create";
            addFormSubmitted(event, formData, () =>
                loadRevisioniDiv(targa.numero)
            );
        });
        $("#addEsito").change(addEsitoChanged); // need to be copied for the #editEsitoS

        $("#addButton").on("click", showAddForm);
        $("#undoButton").on("click", function (event) {
            hideAddForm(event);
        });
        // Function to fetch car details based on ID
        async function fetchTargaDetails(id) {
            console.log(id);
            try {
                const targaResponse = await new Promise((resolve, reject) => {
                    handleAjaxRequest(
                        "/php/search_targa.php", // URL to fetch car details from the server
                        "GET",
                        "targa=" + id,
                        resolve,
                        reject
                    );
                });
                if (targaResponse.success == true) {
                    console.log(targaResponse.data[0]);
                    targa = targaResponse.data[0];
                    const targaStatus = targa.status;
                    const state = targaStatus == "active";
                    $("#titolo").html(
                        "<h1>Dettagli sulla targa " + targa.numero + "</h1>"
                    );
                    const targaComponent = renderTargaDetail(targa);
                    targaComponent.appendTo($("#targa"));

                    const veicoloResponse = await new Promise(
                        (resolve, reject) => {
                            handleAjaxRequest(
                                "/php/search_veicolo.php",
                                "GET",
                                "telaio=" + targa.veicolo,
                                resolve,
                                reject
                            );
                        }
                    );
                    if (veicoloResponse.success == true) {
                        var veicolo = veicoloResponse.data[0];
                        var veicoloComponent = renderVeicoloCard(veicolo);
                        if (state) {
                            $(".veicolo .titolo").html(
                                "<h3>Veicolo attualmente associato</h3>"
                            );
                        } else {
                            $(".veicolo .titolo").html(
                                "<h3>Ultimo veicolo associato</h3>"
                            );
                        }
                        veicoloComponent.appendTo($("#veicolo"));
                    } else {
                        $(".veicolo .titolo").html(
                            "<h3>Nessun veicolo associato. Strano!</h3>"
                        );
                        // render niente veicolo per questa targa
                        // non dovrebbe mai accadere. Ogni targa ha almeno un veicolo per costruzione del db
                    }

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
        const targaNumber = urlParams.get("id"); //global variable
        // Fetch car details based on the ID
        fetchTargaDetails(targaNumber);
    });


}



function returnToMotherPage() {
    var motherURL = "/pages/targhe.php";
    window.location.href = motherURL;
}

export function getTarga() {
    console.log("ciao");
    return targa.numero;
}
