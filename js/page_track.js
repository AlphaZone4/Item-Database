define(function() {
    // this module literally does one thing.
    return function(page) {
        if (typeof(window._gaq) !== "undefined") {
            window._gaq.push(["_trackPageview", page]);
        }
    };
});