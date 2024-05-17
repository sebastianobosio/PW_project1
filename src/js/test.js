export async function performDefaultSearch() { 
  var data = "&action=read";
  performSearch(data);
}

export async function performSearch(data) {
  handleAjaxRequest(
    "../php/search_revisione.php",
    "GET",
    data,
    function (xhr, status, error) {
        handleAjaxError(xhr.responseText);
    },
    /*function (response) {
        
      if (response.success === true) {
        data = response.data;
        console.log(data);
        $("#searchResults").empty();
        data.forEach(async (revisione) => {
          var revisioneComponent = await renderRevisioneCard(revisione);
          revisioneComponent.appendTo($("#searchResults"));
        });
      } else {
        alert("Non sono state trovate corrispondenze");
      }
    },*/
    function (xhr, status, error) {
      handleAjaxError(xhr.responseText);
    }
  );
}
