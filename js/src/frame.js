// This class defines the basic AZ4 "frame" for building an essential Item DB
define(function(){
    var $t = {};
    $t.module = "frame";
    
    $t.create = function(target, cb) {
        // create frame object
        var frame = {
            nav: $m.nav.create(),
            list: $m.lists.create(null, null)
        };
        
        // append to target
        target.html("").append(frame.nav).append(frame.list.body);
        
        // callback with frame object
        if (cb) cb(frame);
    }
    
    return $t;
});