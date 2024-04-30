$(document).ready(function() {
    // Get the current URL path
    var path = window.location.pathname;
    console.log('Current Path:', path);

    // Get the links in the navbar
    var links = $('.navigation-menu a');

    // Loop through each link
    links.each(function(link) {
        var href = $(this).attr('href');
        if (href.startsWith('../')) {
            // Remove the '../' part from the href attribute
            href = href.substring(3);
        }
        // Check if the modified href matches the current URL path
        if (path.endsWith(href)) {
            // If it matches, add a class to emphasize it
            $(this).addClass('active');
        }
    });
});