function formatRevisioneData(data) {
    $('#searchResults').empty();

    data.forEach(revisione => {
        const revisioneDiv = $('<div>').addClass('revisione');
        $('<div>').text('Revisione: ' + revisione.numero).appendTo(revisioneDiv);
        $('<div>').text('Data della revisione: ' + revisione.dataRev).appendTo(revisioneDiv);
        $('<div>').text('Targa associata: ' + revisione.targa).appendTo(revisioneDiv);
        $('<div>').text('Esito: ' + revisione.esito).appendTo(revisioneDiv);
        if (revisione.esiot == 'negativo') {
            $('<div>').text('Motivazione: ' + revisione.motivazione).appendTo(revisioneDiv);
        }
        const informationBtnDiv = $('<div>').addClass('infoBtn');
        const veicoloButton = $('<button>').text('Dettaglio veicolo').addClass('veicolo-button');
        const targaButton = $('<button>').text('Dettaglio targa').addClass('targa-button');
        veicoloButton.appendTo(informationBtnDiv)
        targaButton.appendTo(informationBtnDiv);

        veicoloButton.on('click', function() {veicoloDaRevisioneBtnClicked(revisione)});
        targaButton.on('click', function() {targaDaRevisioneBtnClicked(revisione)});
        informationBtnDiv.appendTo(revisioneDiv);
        revisioneDiv.appendTo($('#searchResults'));
    });
}

function veicoloDaRevisioneBtnClicked(revisione) {
    console.log("sono qui");
    data = "targa=" + revisione.targa;
    handleAjaxRequest(
        '../php/search_targa.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
            if (response.success === true) {
                data = response.data[0].telaio;
                handleAjaxRequest(
                    '../php/search_veicolo.php',
                    'GET',
                    "telaio=" + data,
                    function(response) {
                        if (response.success === true) {
                            formatVehicleData(response.data);
                        } else {
                            alert("Non sono state trovate corrispondenze");
                        }
                    },
                    function(xhr, status, error) {
                        console.error('Error', xhr.responseText);
                        alert("Error occurred while fetching data.");
                    }
                )
            } else {
                alert("No results found");
            } 
        },
        function(xhr, status, error) {
            console.error('Error', xhr.responseText);
            alert("Error occurred while fetching data.");
        }
    )
};    

function targaDaRevisioneBtnClicked(revisione) {
    console.log("sono qui");
    data = "targa=" + revisione.targa;
    handleAjaxRequest(
        '../php/search_targa.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
            if (response.success === true) {
                formatTargaData(response.data);
            } else {
                alert("Non sono state trovate corrispondenze");
            }
        },
        function(xhr, status, error) {
            console.error('Error', xhr.responseText);
            alert("Error occurred while fetching data.");
        }
    )
    console.log("bho");
}