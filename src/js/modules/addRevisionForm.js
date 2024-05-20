import { checkRevision } from "./checkRevisionFields.js";
import { handleAjaxError, handleResponse } from "./handleAjax.js";

export function toggleFormVisibility(state, targaNumber) {
  if (state) {
    $("#addButton").show();
    prepareForm(targaNumber); // Show the form
  } else {
    $("#addButton").hide(); // Hide the form
  }
}

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
