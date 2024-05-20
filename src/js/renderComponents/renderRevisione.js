import { checkRevision } from "../modules/checkRevisionFields.js";
import {
    handlePageReloadOnDelete,
    handlePageReloadOnEdit,
} from "../modules/revisionHandlers.js";
import { handleAjaxError, handleResponse } from "../modules/handleAjax.js";

export async function renderRevisioneCard(revisione) {
    const revisioneComponent = await createRevisioneCardComponent(revisione);
    // attach handler to edit button
    return revisioneComponent;
}

export async function renderRevisioneDetail(revisione) {
    const revisioneComponent = await createRevisioneDetailComponent(revisione);
    // attach handler to edit button
    return revisioneComponent;
}

/*  there are some complication with how i handled this component
    The motivation field is toggled on and off based on the status of esito. But I
    also had to take in consideration the original esito (and all the original fields values)
    to revert back in case of errors.
    The edit button have two stages. The first when clicked the edit button let you
    make changes to certain fields. The edit button become the save-changes button.
    The detail button and delete button disappear appear a discard-button.
    If the discard-button is pressed the values are reverted back, if the save button is
    pressed it calls the function saveChanges.
    The hard part was handle all the cases.
*/
async function createRevisioneCardComponent(revisione) {
    const revisioneDiv = $("<div>").addClass("revisione card");
    const infoDiv = $("<div>").addClass("info");
    const revisioneNumberDiv = $("<div>")
        .html('Revisione: <span class="numero">' + revisione.numero + "</span>")
        .appendTo(infoDiv);
    const dataRevDiv = $("<div>")
        .html(
            'Data della revisione: <span class="dataRev">' +
                '<input type="date" value="' +
                revisione.dataRev +
                '" disabled></input>' +
                "</span>"
        )
        .appendTo(infoDiv);
    const targaNumberDiv = $("<div>")
        .html(
            'Targa associata: <span class="targa">' +
                revisione.targa +
                "</span>"
        )
        .appendTo(infoDiv);
    const esitoSelect = $("<select>").addClass("esito").prop("disabled", true); // Disable select element initially
    $("<option>").val("positive").text("Positivo").appendTo(esitoSelect);
    $("<option>").val("negative").text("Negativo").appendTo(esitoSelect);
    if (revisione.esito === "positive") {
        esitoSelect.val("positive");
    } else if (revisione.esito === "negative") {
        esitoSelect.val("negative");
    }
    const esitoDiv = $("<div>")
        .html("Esito: ")
        .append(esitoSelect)
        .appendTo(infoDiv);
    const motivazioneDiv = $("<div>")
        .addClass("motivazioneDiv")
        .css("display", "none")
        .html(
            'Motivazione: <span class="motivazione"><textarea class="motivazione" oninput="autoResize()" type="text" required disabled></textarea></span>'
        )
        .appendTo(infoDiv);
    if (revisione.esito == "negative") {
        motivazioneDiv.toggle(revisione.esito === "negative");
        motivazioneDiv.find(".motivazione textarea").val(revisione.motivazione);
    }
    infoDiv.appendTo(revisioneDiv);
    //info buttons
    const btnsDiv = $("<div>").addClass("action-btn");
    var discardChangeBtn = $("<button>")
        .addClass("discard-changes")
        .html('<i class="fa-solid fa-arrow-left"></i>')
        .hide()
        .appendTo(btnsDiv);
    const detailsButton = $("<button>")
        .html("Scopri di più" + '<i class="fa-solid fa-circle-info"></i>')
        .addClass("detail-button");
    detailsButton.appendTo(btnsDiv);
    detailsButton.on("click", function () {
        revisioneDetailsBtnClicked(revisione);
    });

    //Edit and remove buttons
    const removeButton = $("<button>").addClass("remove-button");
    removeButton.on("click", function () {
        deleteBtnClicked(revisione.numero);
    });
    const editButton = await createEditButton(
        revisioneDiv,
        removeButton,
        discardChangeBtn,
        detailsButton
    );
    removeButton.html('<i class="fas fa-trash-alt"></i>'); // This adds a trash icon
    editButton.appendTo(btnsDiv);
    removeButton.appendTo(btnsDiv);
    btnsDiv.appendTo(revisioneDiv);

    return revisioneDiv;
}

async function createRevisioneDetailComponent(revisione) {
    const revisioneDiv = $("<div>").addClass("revisione card");
    const infoDiv = $("<div>").addClass("info");
    const revisioneNumberDiv = $("<div>")
        .html('Revisione: <span class="numero">' + revisione.numero + "</span>")
        .appendTo(infoDiv);
    const dataRevDiv = $("<div>")
        .html(
            'Data della revisione: <span class="dataRev">' +
                '<input type="date" value="' +
                revisione.dataRev +
                '" disabled></input>' +
                "</span>"
        )
        .appendTo(infoDiv);
    const targaNumberDiv = $("<div>")
        .html(
            'Targa associata: <span class="targa">' +
                revisione.targa +
                "</span>"
        )
        .appendTo(infoDiv);
    const esitoSelect = $("<select>").addClass("esito").prop("disabled", true); // Disable select element initially
    $("<option>").val("positive").text("Positivo").appendTo(esitoSelect);
    $("<option>").val("negative").text("Negativo").appendTo(esitoSelect);
    if (revisione.esito === "positive") {
        esitoSelect.val("positive");
    } else if (revisione.esito === "negative") {
        esitoSelect.val("negative");
    }
    const esitoDiv = $("<div>")
        .html("Esito: ")
        .append(esitoSelect)
        .appendTo(infoDiv);
    const motivazioneDiv = $("<div>")
        .addClass("motivazioneDiv")
        .css("display", "none")
        .html(
            'Motivazione: <span class="motivazione"><textarea class="motivazione" oninput="autoResize()" required disabled></textarea></span>'
        )
        .appendTo(infoDiv);
    if (revisione.esito == "negative") {
        motivazioneDiv.toggle(revisione.esito === "negative");
        motivazioneDiv.find(".motivazione textarea").val(revisione.motivazione);
    }
    infoDiv.appendTo(revisioneDiv);
    //info buttons
    const btnsDiv = $("<div>").addClass("action-btn");
    //const detailsButton = $('<button>').html('Scopri di più' + '<i class="fa-solid fa-circle-info"></i>').addClass('detail-button');
    //detailsButton.appendTo(btnsDiv)
    //detailsButton.on('click', function() {revisioneDetailsBtnClicked(revisione)});
    var discardChangeBtn = $("<button>")
        .addClass("discard-changes")
        .html('<i class="fa-solid fa-arrow-left"></i>')
        .hide()
        .appendTo(btnsDiv);

    //Edit and remove buttons
    const removeButton = $("<button>").addClass("remove-button");
    removeButton.on("click", function () {
        deleteBtnClicked(revisione.numero);
    });
    const editButton = await createEditButton(
        revisioneDiv,
        removeButton,
        discardChangeBtn
    );
    removeButton.html('<i class="fas fa-trash-alt"></i>'); // This adds a trash icon
    editButton.appendTo(btnsDiv);
    removeButton.appendTo(btnsDiv);
    btnsDiv.appendTo(revisioneDiv);

    return revisioneDiv;
}

function revisioneDetailsBtnClicked(revisione) {
    console.log("sono qui");
    viewRevisioneDetails(revisione);
}

function viewRevisioneDetails(revisione) {
    window.location.href =
        "/pages/revisione/dettagli-revisione.php?id=" + revisione.numero;
}

function deleteBtnClicked(numeroRev) {
    const id = numeroRev;

    var confirmed = confirm("Are you sure you want to delete this entry");
    if (confirmed) {
        handleAjaxRequest(
            "/php/search_revisione.php",
            "POST",
            { action: "delete", id: id },
            function (response) {
                handleResponse(response, "Elemento rimosso", null);
                handlePageReloadOnDelete();
            },
            function (xhr, status, error) {
                handleAjaxError(xhr.responseText);
            }
        );
    }
}

function editEsitoChanged(revisioneDiv) {
    console.log(
        "Esito ha cambiato stato: " + revisioneDiv.find("select.esito").val() ==
            "negative"
    );
    revisioneDiv
        .find(".motivazioneDiv")
        .toggle(revisioneDiv.find("select.esito").val() == "negative");
    revisioneDiv
        .find(".motivazione textarea")
        .prop(
            "required",
            revisioneDiv.find("select.esito").val() == "negative"
        );
    revisioneDiv
        .find(".motivazione textarea")
        .prop(
            "disabled",
            revisioneDiv.find("select.esito").val() == "positive"
        );
    revisioneDiv
        .find(".motivazione textarea")
        .prop(
            "disabled",
            revisioneDiv.find("select.esito").val() == "positive"
        );
}

async function createEditButton(
    revisioneDiv,
    removeButton,
    discardButton,
    detailsButton = null
) {
    const editButton = $("<button>").addClass("edit-button");
    editButton.html('<i class="fa-solid fa-pen-to-square"></i>');

    async function attachEditHandler() {
        const id = revisioneDiv.find(".numero").text();
        var originalDataRev = revisioneDiv
            .find(".dataRev input")
            .prop("disabled", true)
            .val();
        var originalTarga = revisioneDiv
            .find(".targa")
            .attr("contenteditable", false)
            .text();
        var originalEsito = revisioneDiv
            .find("select.esito")
            .prop("disabled", true)
            .val();
        var originalMotivazione = revisioneDiv
            .find(".motivazione textarea")
            .prop("disabled", true)
            .val();
        console.log(
            "valori prima di cliccare l'edit: " +
                id +
                " " +
                originalDataRev +
                " " +
                originalTarga +
                " " +
                originalEsito +
                " " +
                originalMotivazione
        );
        editButton.off("click").on("click", async function () {
            revisioneDiv.find(".dataRev input").prop("disabled", false);
            revisioneDiv.find(".targa").attr("contenteditable", true);
            var esito = revisioneDiv
                .find("select.esito")
                .prop("disabled", false)
                .val();
            if (esito === "negative") {
                revisioneDiv
                    .find(".motivazione textarea")
                    .prop("disabled", false);
            }

            revisioneDiv.find("select.esito").change(function () {
                editEsitoChanged(revisioneDiv);
            });
            console.log("diocane");
            if (detailsButton != null) {
                detailsButton.hide();
            }

            removeButton.hide();
            // add logic here for discard changes.
            discardButton.show();

            editButton
                .addClass("save-change")
                .html('<i class="fa-solid fa-floppy-disk"></i>')
                .off("click")
                .on("click", async function () {
                    const id = revisioneDiv.find(".numero").text();
                    var dataRevObj = revisioneDiv
                        .find(".dataRev input")
                        .prop("disabled", true);
                    var targaObj = revisioneDiv
                        .find(".targa")
                        .attr("contenteditable", false);
                    var esitoObj = revisioneDiv
                        .find("select.esito")
                        .prop("disabled", true);
                    var motivazioneObj = revisioneDiv
                        .find(".motivazione textarea")
                        .prop("disabled", true);
                    var motivazione = motivazioneObj.val();
                    var esito = esitoObj.val();
                    if (esito === "negative" && motivazione === "") {
                        alert(
                            "La motivazione non può essere nulla in caso di esito negativo"
                        );
                        motivazioneObj.prop("disabled", false); // Re-enable input
                        dataRevObj.prop("disabled", false);
                        targaObj.attr("contenteditable", true);
                        esitoObj.prop("disabled", false);
                        motivazioneObj.text(originalMotivazione);
                        dataRevObj.val(originalDataRev);
                        targaObj.text(originalTarga);
                        esitoObj.val(originalEsito);
                        if (originalEsito == "positive") {
                            motivazioneObj.prop("disabled", true);
                            revisioneDiv
                                .find(".motivazioneDiv")
                                .toggle(
                                    revisioneDiv.find("select.esito").val() ==
                                        "negative"
                                );
                        }
                        return false; // Prevent form submission
                    }

                    var targa = targaObj.text();
                    var dataRev = dataRevObj.val();

                    const dataUpdateRequest =
                        "editId=" +
                        id +
                        "&editDataRev=" +
                        dataRev +
                        "&editTarga=" +
                        targa +
                        "&editEsito=" +
                        esito +
                        "&editMotivazione=" +
                        motivazione +
                        "&action=update";
                    console.log(targa);
                    if (await checkRevision(targa, dataRev)) {
                        try {
                            await saveChanges(dataUpdateRequest);
                            console.log("sono qui");
                            if (targa != originalTarga) {
                                handlePageReloadOnEdit();
                            }
                            if (detailsButton != null) {
                                detailsButton.show();
                            }
                            removeButton.show();
                            discardButton.hide();
                            editButton
                                .removeClass("save-change")
                                .html(
                                    '<i class="fa-solid fa-pen-to-square"></i>'
                                );
                            attachEditHandler();
                        } catch (error) {
                            console.log("non funziona un cazzo");
                        }
                        console.log("aggiornare stato bottone");
                    } else {
                        motivazioneObj.prop("disabled", false); // Re-enable input
                        dataRevObj.prop("disabled", false);
                        targaObj.attr("contenteditable", true);
                        esitoObj.prop("disabled", false);
                        motivazioneObj.text(originalMotivazione);
                        dataRevObj.val(originalDataRev);
                        targaObj.text(originalTarga);
                        esitoObj.val(originalEsito);
                        if (originalEsito == "positive") {
                            motivazioneObj.prop("disabled", true);
                            revisioneDiv
                                .find(".motivazioneDiv")
                                .toggle(
                                    revisioneDiv.find("select.esito").val() ==
                                        "negative"
                                );
                        }
                        return false;
                    }
                });
            discardButton.off("click").on("click", function () {
                var dataRevObj = revisioneDiv.find(".dataRev input");
                var targaObj = revisioneDiv.find(".targa");
                var esitoObj = revisioneDiv.find("select.esito");
                var motivazioneObj = revisioneDiv.find(".motivazione textarea");
                var motivazione = motivazioneObj.val();
                var esito = esitoObj.val();
                motivazioneObj.prop("disabled", true); // Re-enable input
                dataRevObj.prop("disabled", true);
                targaObj.attr("contenteditable", false);
                esitoObj.prop("disabled", true);
                motivazioneObj.text(originalMotivazione);
                dataRevObj.val(originalDataRev);
                targaObj.text(originalTarga);
                esitoObj.val(originalEsito);
                if (originalEsito == "positive") {
                    motivazioneObj.prop("disabled", true);
                    revisioneDiv
                        .find(".motivazioneDiv")
                        .toggle(
                            revisioneDiv.find("select.esito").val() ==
                                "negative"
                        );
                } else if (originalEsito == "negative") {
                    revisioneDiv
                        .find(".motivazioneDiv")
                        .toggle(
                            revisioneDiv.find("select.esito").val() ==
                                "negative"
                        );
                }
                if (detailsButton != null) {
                    detailsButton.show();
                }
                removeButton.show();
                discardButton.hide();
                editButton.removeClass("save-change");
                editButton.html('<i class="fa-solid fa-pen-to-square"></i>');
                attachEditHandler();
                discardButton.hide();
                return false;
            });
        });
    }

    await attachEditHandler();
    return editButton;
}

async function saveChanges(dataUpdateRequest) {
    return new Promise((resolve, reject) => {
        handleAjaxRequest(
            "/php/search_revisione.php",
            "POST",
            dataUpdateRequest,
            function (response) {
                handleResponse(
                    response,
                    "Istanza modificata correttamente",
                    null
                );
                resolve(response);
            },
            function (xhr, status, error) {
                handleAjaxError(xhr.responseText);
                resolve(error);
            }
        );
    });
}
