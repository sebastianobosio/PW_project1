$(document).ready(function() {
    // Function to fetch car details based on ID
    function fetchTargaDetails(id) {
        console.log(id);
        handleAjaxRequest(
            '/php/search_targa.php', // URL to fetch car details from the server
            'GET',
            { targa: id , telaio: "", status: "both"},
            function(response) {
                // Render car details on success
                targaComponent = renderTargaData(response.data[0]);
                targaComponent.appendTo($('#targa'));
            },
            function(xhr, status, error) {
                // Handle errors
                console.error('Error:', error);
            }
        )
    }

    // Get car ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const targaNumber = urlParams.get('id');
    
    // Fetch car details based on the ID
    fetchTargaDetails(targaNumber);
});