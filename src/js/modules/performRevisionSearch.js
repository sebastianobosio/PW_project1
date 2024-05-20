import {renderRevisioneCard} from "../renderComponents/renderRevisione.js";
import {handleAjaxError} from "./handleAjax.js";

// I exported this function from revisione.js because it's used also by revisionHandlers.js
export async function performDefaultSearch() {
    var data = "&action=read";
    performSearch(data);
}

export async function performSearch(data) {
    handleAjaxRequest("/php/search_revisione.php", "GET", data, function (response) {
        if (response.success === true) {
            $("#searchForm")[0].reset();
            data = response.data;
            $("#searchResults").empty();
            data.forEach(async (revisione) => {
                var revisioneComponent = await renderRevisioneCard(revisione);
                revisioneComponent.appendTo($("#searchResults"));
            });
        } else {
            alert("Non sono state trovate corrispondenze");
        }
    }, function (xhr, status, error) {
        handleAjaxError(xhr.responseText);
    });
}
