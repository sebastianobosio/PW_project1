import { checkRevision } from "./checkRevisionFields.js";
import { handleAjaxError, handleResponse } from "./handleAjax.js";

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
    console.log("ciao" + targaNumber);
  $("#addTarga").val(targaNumber);
  $("#addTarga").prop("disabled", true);
}

export async function addFormSubmitted(event, formData, callback) {
  event.preventDefault();
  console.log(formData);
  var targa = $("#addTarga").val();
  var dataRev = $("#addDataRev").val();
  if (await checkRevision(targa, dataRev)) {
    performAddAction(formData, callback);
  }
}

export function performAddAction(formData, callback) {
  handleAjaxRequest(
    "/php/search_revisione.php",
    "POST",
    formData,
    function (response) {
      // when the form is submitted the fields are resetted and the handleResponse is called
      //handle response is a simple function that print the message and make the callback if a function is passed.
      $('#addForm')[0].reset();
      handleResponse(response, "Istanza inserita correttamente", callback);
    },
    function (xhr, status, error) {
      handleAjaxError(xhr.responseText);
    }
  );
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

export function hideAddForm(event) {
  if ($(".addFormDiv").is(":visible")) {
    $(".addFormDiv").toggle("slow");
    $("#addForm").attr("novalidate", true);
    event.preventDefault();
  }
}

