define(["config", "stars", "nav", "popup", "pricer"], function(_config, stars, nav, popup, pricer) {
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
            // fetch all prices properly
            var price_text = pricer.print_all(data.prices);
            if (price_text) content.append('<p class="alert">' + price_text + '</p>');
        }
        
        if (data.rating_id) {
            content.append($("<p class='alert'>"+data.rating+" / 5 ("+data.votes+" votes)</p>").append(
                stars.create(data.rating_id, data.rating, data.votes).css("float", "right")
            ));
        }
        
        if (data.gender) {
			content.append("<p class='alert'>" + ((data.gender == "M") ? 
				"<i class='az4im M'></i> Male"
				:
				"<i class='az4im F'></i> Female"
			) + "</p>");
		}
        
        if (data.dev) {
            for(var ii in _config.settings.devs) {
                if (ii == data.dev) content.append("<p class='alert'>Developer: "+_config.settings.devs[ii]+"</p>");
            }
        }
        
        if (data.type && data.type != "None") {
			for(var ii in _config.settings.item_types) {
				if (ii == data.type) content.append("<p class='alert'>"+_config.settings.item_types[ii]+"</p>");
			}
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
                if (!_config.regionLock || _config.regionLock == data.categories[ii].zone) {
                    var cat = "<i class='az4im flag_"+data.categories[ii].zone.toLowerCase()+"'></i> "+data.categories[ii].name+"<br />";
                    if (_config.categoryLinks) {
                        cat = nav.link(cat, "cat/"+data.categories[ii].id);
                    }
                    cats.append(cat);
                }
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
