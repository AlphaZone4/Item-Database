// a generic "listen for resizes" module
define(function() {
    var resizers = [];
    
    var timer;
    
    window.onresize = function() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(resize, 100);
    };
    
    var resize = function() {
        for(var ii=0; ii<resizers.length; ii++) {
            resizers[ii]();
        }
    };
    
    var add = function(func) {
        resizers.push(func);
    };
    
    return {
        add: add
    };
});