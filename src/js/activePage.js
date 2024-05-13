$(document).ready(function() {
    // Get the current URL path
    var path = window.location.pathname;
    console.log('Current Path:', path);

    // Get the links in the navbar
    var links = $('.navigation-menu a');

    // Loop through each link
    links.each(function(link) {
        var href = $(this).attr('href');

        if (path.endsWith(href)) {
            // If it matches, add a class to emphasize it
            $(this).addClass('active');
        } else if (href == '/index.php' && path == '/') {
            $(this).addClass('active');
        }
    });
});