define(["frame"], function(frame) {
    frame.add_page(/^\/?$/, function() {
        frame.clear();
        
        frame.page.html("<h2>AlphaZone4 Item Database</h2><p>Page to include some basic stats/information on the database.</p>");
    });
});