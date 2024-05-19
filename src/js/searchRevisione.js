import { performDefaultSearch, performSearch } from "./test.js";
import {
  addFormSubmitted,
  addEsitoChanged,
  hideAddForm,
  showAddForm,
} from "./addRevisionForm.js";

$(document).ready(function () {
  $("#searchForm").submit(searchFormSubmitted);
  $("#addForm").submit(addFormSubmitted);
  $("#addButton").on("click", showAddForm);
  $("#undoButton").on("click", function (event) {
    hideAddForm(event);
  });

  $("#addForm").submit(function (event) {
    event.preventDefault();
    var formData = $(this).serialize() + "&action=create";
    addFormSubmitted(event, formData, performDefaultSearch);
  });

  //$(document).on("click", ".deleteBtn", deleteBtnClicked);
  $("#addEsito").change(addEsitoChanged); // need to be copied for the #editEsitoS

  performDefaultSearch();

  function searchFormSubmitted(event) {
    event.preventDefault();
    var formData = $(this).serialize() + "&action=read";
    performSearch(formData);
  }
});
