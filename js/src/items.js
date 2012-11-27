define(["src/stars", "src/nav", "src/popup"], function(stars, nav, popup) {
    var $t = {};
    $t.module = "items";
    
    // click handler for items
    $t.itemClick = function() {
        var data = $(this).parent().data("item");
        
        // make nice pretty item detail page
        var content_box = $("<div>").addClass("item_detail");
        
        var content = $("<div>");
        
        // add item image
        //  wrap top item detail section in div with class so we can resize
        if (data.image_large_exist) {
            content.addClass("item_detail item_detail_large");
            content.append("<img src='"+data.image.replace("/i/", "/l/")+"' />");
        } else {
            content.addClass("item_detail item_detail_small");
            content.append("<img src='"+data.image+"' />");
        }
        
        // add item price/developer etc. in pinch boxes
        if (data.prices) {
            // TODO - fetch all prices properly
            content.append('<p class="alert"><i class="az4im flag_eu"></i> £'+data.prices.GBP+'</p>');
        }
        if (data.rating_id) {
            content.append($("<p class='alert'>"+data.rating+" / 5 ("+data.votes+" votes)</p>").append(
                stars.create(data.rating_id, data.rating, data.votes).css("float", "right")
            ));
        }
        if (data.dev) {
            // TODO - fetch nicenames from settings data
            content.append("<p class='alert'>Developer: "+data.dev+"</p>");
        }
        
        // add description/categories etc.
        content_box.append(content);
        content_box.append("<div style='clear:both'></div>");
        
        if (data.description) {
            content_box.append("<p class='alert'>"+data.description+"</p>");
        }
        if (data.tutorial) {
            content_box.append("<p class='alert'><i>How to get</i>: "+data.tutorial+"</p>");
        }
        if (data.categories) {
            var cats = $("<p>").addClass("alert");
            for(var ii=0; ii<data.categories.length; ii++) {
                cats.append(nav.link("<i class='az4im flag_"+data.categories[ii].zone.toLowerCase()+"'></i> "+data.categories[ii].name+"<br />", "cat/"+data.categories[ii].id));
            }
            content_box.append(cats);
        }
        
        popup.create(content_box, data.name, ":D");
        
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
            return false; //$m.popup.create(content, i.name, "yummy!");
        };
        
        return i;
    };
    
    return $t;
});