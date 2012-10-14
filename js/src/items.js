define(function() {
    var $t = {};
    $t.module = "items";
    
    // click handler for items
    $t.itemClick = function() {
        var data = $(this).parent().data("item");
        
        // create a popup of item data
        $m.popup.create(data.description, data.name, ":D");
        
        return false;
    };
    
    // click handler for categories
    $t.catClick = function() {
        var data = $(this).parent().data("item");
        
        // load new category ID
        data.list.loadCat(data.id);
        
        return false;
    };
    
    $t.list = function(i) {
        // popup handler!
        i.click = function(){
            return $m.popup.create("cool-beans!", i.name, "yummy!");
        };
        
        return i;
    };
    
    return $t;
});