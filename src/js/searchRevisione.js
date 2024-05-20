import { performDefaultSearch, performSearch } from "./performRevisionSearch.js";
import {
    addFormSubmitted,
    addEsitoChanged,
    hideAddForm,
    showAddForm,
} from "./addRevisionForm.js";

$(document).ready(function () {
    $("#addForm").submit(function (event) {
        console.log("siìasf");
        event.preventDefault();
        var formData =
            $(this).serialize() +
            "&action=create";
        addFormSubmitted(event, formData, () => performDefaultSearch());
    });
    $("#addEsito").change(addEsitoChanged); // need to be copied for the #editEsitoS

    $("#addButton").on("click", showAddForm);
    $("#undoButton").on("click", function (event) {
        hideAddForm(event);
    });
    $("#searchForm").submit(searchFormSubmitted);

    performDefaultSearch();

    function searchFormSubmitted(event) {
        event.preventDefault();
        var formData = $(this).serialize() + "&action=read";
        performSearch(formData);
    }
});
