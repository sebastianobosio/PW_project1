$(document).ready(function() {
    $('#searchForm').submit(searchFormSubmitted);

    performDefaulSearch();

    function searchFormSubmitted (event) {
        event.preventDefault();

        var formData = $(this).serialize();
        performSearch(formData);
    }

    function performSearch(formData) {
        handleAjaxRequest(
            '../php/search_veicolo.php',
            'GET',
            formData,
            function(response) {
                console.log('Response:', response.message);
                if (response.success === true) {
                    formatData(response.data);
                } else {
                    alert("Non sono state trovate corrispondenze");
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                alert("Error occurred while fetching data.");
            }
        )
    };

    function performDefaulSearch() {
        performSearch(null);
    };

    function formatData(data) {
        $('#searchResults').empty();

        data.forEach(car => {
            const vehicleDiv = $('<div>').addClass('vehicle');
            $('<div>').text('Veicolo: ' + car.telaio).appendTo(vehicleDiv);
            $('<div>').text('Modello: ' + car.modello).appendTo(vehicleDiv);
            $('<div>').text('Marca: ' + car.marca).appendTo(vehicleDiv);
            const informationBtnDiv = $('<div>').addClass('infoBtn');
            const targaButton = $('<button>').text('Targhe associate').addClass('targa-button');
            const revisioneButton = $('<button>').text('Revisioni associate').addClass('revisione-button');
            targaButton.appendTo(informationBtnDiv)
            revisioneButton.appendTo(informationBtnDiv);

            targaButton.on('click', function() {targaBtnClicked(car)});
            revisioneButton.on('click', revisioneBtnClicked);
            informationBtnDiv.appendTo(vehicleDiv);
            vehicleDiv.appendTo($('#searchResults'));
        });
    }

    function targaBtnClicked(car) {
        data = "telaio=" + car.telaio;
        handleAjaxRequest(
            '../php/search_targa_api.php',
            'GET',
            data,
            function(response) {
                console.log('Response:', response.message);
                if (response.success === true) {
                    //formatData(response.data);
                } else {
                    alert("Non sono state trovate corrispondenze");
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                alert("Error occurred while fetching data.");
            }
        )
    };    

    function revisioneBtnClicked() {

    }
});