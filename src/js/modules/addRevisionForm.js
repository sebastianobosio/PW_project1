import {checkRevision} from "./checkRevisionFields.js";
import {handleAjaxError, handleResponse} from "./handleAjax.js";

// this module handle the addRevisionForm that is present in dettaglio-veicolo/targa and revisione
export function toggleFormVisibility(state, targaNumber) {
    if (state) {
        $("#addButton").show();
        prepareForm(targaNumber); // Show the form
    } else {
        $("#addButton").hide(); // Hide the form
    }
}

// the targa fields is filled and blocked when the form is opened in dettaglio-veicolo/targa pages
export function prepareForm(targaNumber) {
    $("#addTarga").val(targaNumber);
    $("#addTarga").prop("disabled", true);
}

export async function addFormSubmitted(event, formData, callback) {
    event.preventDefault();
    var targa = $("#addTarga").val();
    var dataRev = $("#addDataRev").val();
    if (await checkRevision(targa, dataRev)) {
        performAddAction(formData, callback);
    }
}

export function performAddAction(formData, callback) {
    handleAjaxRequest("/php/search_revisione.php", "POST", formData, function (response) {
        var page = window.location.pathname;

        if (page.endsWith("revisioni.php")) {
            resetForm(false); // Reset all fields
        } else if (page.endsWith("dettagli-targa.php") || page.endsWith("dettagli-veicolo.php")) {
            resetForm(true); // Reset all fields except targa
        }
        // handle response is a simple function that print the message and make the callback if a function is passed.
        handleResponse(response, "Istanza inserita correttamente", callback);
    }, function (xhr, status, error) {
        handleAjaxError(xhr.responseText);
    });
}

export function addEsitoChanged() {
    $("#addMotivazioneDiv").toggle($(this).val() === "negative");
    $("#addMotivazione").prop("required", $(this).val() === "negative");
}

export function showAddForm() {
    if (!$(".addFormDiv").is(":visible")) {
        $(".addFormDiv").toggle("slow");
        $("#addForm").removeAttr("novalidate");
    }
}

export function hideAddForm(event) { // when the form is submitted the fields are resetted
    if ($(".addFormDiv").is(":visible")) {
        $(".addFormDiv").toggle("slow");
        $("#addForm").attr("novalidate", true);
        var page = window.location.pathname;
        if (page.endsWith("revisioni.php")) {
            resetForm(false); // Reset all fields
        } else if (page.endsWith("dettagli-targa.php") || page.endsWith("dettagli-veicolo.php")) {
            resetForm(true); // Reset all fields except targa
        }event.preventDefault();
    }
}

function resetForm(excludeTarga = false) {
    if (excludeTarga) { // Store the value of the targa field before resetting
        var targaField = $("#addTarga");
        var targaValue = targaField.val();
        $("#addForm")[0].reset();
        // Reset all form fields
        // Restore the value of the targa field after reset
        var wasDisabled = targaField.prop("disabled");
        if (wasDisabled) {
            targaField.prop("disabled", false);
        }
        targaField.val(targaValue);
        if (wasDisabled) {
            targaField.prop("disabled", true);
        }
    } else {
        $("#addForm")[0].reset(); // Reset all fields
    }
}
