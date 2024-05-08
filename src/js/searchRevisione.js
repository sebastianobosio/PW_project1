$(document).ready(function() {
    $('#searchForm').submit(searchFormSubmitted);
    $('#addForm').submit(addFormSubmitted);
    $(document).on('click', '.deleteBtn', deleteBtnClicked);
    $('#addEsito').change(addEsitoChanged); // need to be copied for the #editEsitoS

    performDefaultSearch();

    function searchFormSubmitted(event) {
        event.preventDefault();
        var formData = $(this).serialize() + "&action=read";
        performSearch(formData);
    }

    async function addFormSubmitted(event) {
        event.preventDefault();
        var formData = $(this).serialize() + '&action=create';
        var targa = $('#addTarga').val();
        var dataRev = $('#addDataRev').val();
        if (await checkRevision(targa, dataRev)) {
            performAddAction(formData);
        }
    }

    function performAddAction(formData) {
        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            formData,
            function(response) {
                handleResponse(response, "Istanza inserita correttamente");
            },
            function(xhr, status, error) {
                handleAjaxError(xhr.responseText);
            }
        );
    }

    function handleResponse(response, successMessage) {
        console.log('Response:', response.message);
        if (response.success === true) {
            alert(successMessage);
            performDefaultSearch();
        } else {
            alert("Operazione non riuscita");
        }
    }

    function addEsitoChanged() {
        $('#addMotivazioneDiv').toggle($(this).val() === 'negativo');
        $('#addMotivazione').prop('required', $(this).val() === 'negativo');
    }

    function performDefaultSearch() {
        var data = "&action=read";
        performSearch(data);
    }

    function performSearch(data) {
        handleAjaxRequest(
            '../php/search_revisione.php',
            'GET',
            data,
            function(response) {
                if (response.success === true) {
                    formatRevisioneData(response.data);
                } else {
                    alert("Non sono state trovate corrispondenze");
                }
            },
            function(xhr, status, error) {
                handleAjaxError(xhr.responseText);
            }
        );
    }

    function handleAjaxError(responseText) {
        console.error('Error', responseText);
        alert("Error occurred while fetching data.");
    }

});