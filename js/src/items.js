define(function() {
    var $t = {};
    $t.module = "items";
    
    $t.list = function(i) {
        // popup handler!
        i.click = function(){
            return $m.popup.new("cool-beans!", i.name, "yummy!");
        };
        
        return i;
    };
    
    return $t;
});