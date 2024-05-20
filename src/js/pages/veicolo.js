import { renderVeicoloCard } from "../renderComponents/renderVeicolo.js";

$(document).ready(function () {
    $("#searchForm").submit(searchFormSubmitted);

    // when loaded it calls for a default search (all fields are empty)
    performDefaulSearch();

    function searchFormSubmitted(event) {
        event.preventDefault();

        var formData = $(this).serialize();
        performSearch(formData);
    }

    // fetch data from backend and render them in the searchResults div
    function performSearch(formData) {
        handleAjaxRequest(
            "../php/search_veicolo.php",
            "GET",
            formData,
            function (response) {
                console.log("Response:", response.message);
                if (response.success === true) {
                    $("#searchForm")[0].reset();
                    var data = response.data;
                    $("#searchResults").empty();
                    data.forEach((veicolo) => {
                        var veicoloComponent = renderVeicoloCard(veicolo);
                        veicoloComponent.appendTo($("#searchResults"));
                    });
                } else {
                    alert("Non sono state trovate corrispondenze");
                }
            },
            function (xhr, status, error) {
                console.error("Error", xhr.responseText);
                alert("Error occurred while fetching data.");
            }
        );
    }

    function performDefaulSearch() {
        performSearch(null);
    }
});
