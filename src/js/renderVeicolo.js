function renderVeicolo(veicolo) {
    const veicoloComponent = createVeicoloComponent(veicolo);
    return veicoloComponent;
}

function createVeicoloComponent(veicolo) {
    const vehicleDiv = $('<div>').addClass('vehicle');
    const veicoloNumberDiv = $('<div>').text('Veicolo: ' + veicolo.telaio).appendTo(vehicleDiv);
    const veicoloModelDiv = $('<div>').text('Modello: ' + veicolo.modello).appendTo(vehicleDiv);
    const veicoloBrandDiv = $('<div>').text('Marca: ' + veicolo.marca).appendTo(vehicleDiv);
    const detailsBtnDiv = $('<div>').addClass('detailsBtn');
    const detailsButton = $('<button>').text('Dettaglio veicolo').addClass('detail-button');
    detailsButton.appendTo(detailsBtnDiv)

    detailsButton.on('click', function() {detailsBtnClicked(veicolo)});
    detailsBtnDiv.appendTo(vehicleDiv);

    return vehicleDiv;
}

function detailsBtnClicked(veicolo) {
    console.log("sono qui");
    viewVeicoloDetails(veicolo);
};    

function viewVeicoloDetails(veicolo) {
    window.location.href = '/pages/veicolo/dettagli-veicolo.php?id=' + veicolo.numero;
}

/*function detailsBtnClicked(veicolo) {
    console.log(veicolo);
    data = "telaio=" + veicolo.telaio;
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

    window.location.href = 'nuova pagina per il dettaglio del veicolo'
};    

function revisioneDaVeicoloBtnClicked(car) {
    data = "telaio=" + car.telaio;
    handleAjaxRequest(
        '../php/search_targa.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
            if (response.success === true) {
                var targhe = [];
                response.data.forEach(targa => {
                    targhe.push(targa.numero);
                })
                data = "targhe=" + targhe + "&action=read-array";
                console.log(data);
                handleAjaxRequest(
                    '../php/search_revisione.php',
                    'GET',
                    data,
                    function(response) {
                        if (response.success === true) {
                            formatRevisioneData(response.data, revisioneDaVeicoloBtnClicked, car);
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
                alert("Non sono state trovate corrispondenze");
            }
        },
        function(xhr, status, error) {
            console.error('Error', xhr.responseText);
            alert("Error occurred while fetching data.");
        }
    )
}*/