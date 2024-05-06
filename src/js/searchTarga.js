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
            '../php/search_targa_api.php',
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

    //reload elements on page load
    function performDefaulSearch() {
        performSearch(null);
    };

    function formatData(data) {
        $('#searchResults').empty();

        data.forEach(targa => {
            const vehicleDiv = $('<div>').addClass('targa');
            $('<div>').text('Targa: ' + targa.numero).appendTo(vehicleDiv);
            $('<div>').text('Data di Emissione: ' + targa.dataEm).appendTo(vehicleDiv);
            if (targa.status == 'non-active') {
                $('<div>').text('Ultimo veicolo: ' + targa.vehicle).appendTo(vehicleDiv);
                $('<div>').text('Data di restituzione: ' + targa.dataRes).appendTo(vehicleDiv);
            } else if (targa.status == 'active') {
                $('<div>').text('Veicolo associato: ' + targa.vehicle).appendTo(vehicleDiv);
            }
            const informationBtnDiv = $('<div>').addClass('infoBtn');
            const targaButton = $('<button>').text('Dettaglio veicolo').addClass('targa-button');
            const revisioneButton = $('<button>').text('Revisioni associate').addClass('revisione-button');
            targaButton.appendTo(informationBtnDiv)
            revisioneButton.appendTo(informationBtnDiv);

            targaButton.on('click', function() {targaBtnClicked(targa)});
            revisioneButton.on('click', revisioneBtnClicked);
            informationBtnDiv.appendTo(vehicleDiv);
            vehicleDiv.appendTo($('#searchResults'));
        });
    }

    function targaBtnClicked(targa) {
        data = "telaio=" + targa.vehicle;
        handleAjaxRequest(
            '../php/search_veicolo.php',
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