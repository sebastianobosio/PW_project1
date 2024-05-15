$(document).ready(function() {
    $("#addButton").on("click", showAddForm);
    $("#undoButton").on("click", function(event) {hideAddForm(event)});

    function showAddForm() {
        if (!$('.addFormDiv').is(":visible")) {
            $(".addFormDiv").toggle("slow");
            $("#addForm").removeAttr('novalidate');
        }
      }
    
      function hideAddForm(event) {
        if ($('.addFormDiv').is(":visible")) {
            $(".addFormDiv").toggle("slow");
            $("#addForm").attr('novalidate', true);
            event.preventDefault();
        }
      }
})