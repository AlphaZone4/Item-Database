define(["config", "stars", "nav", "popup", "pricer", "forms", "api"], function(_config, stars, nav, popup, pricer, forms, api) {
    var $t = {};
    $t.module = "items";
    
    // click handler for items
    $t.itemClick = function() {
        var data = $(this).parent().data("item");
        
        // list module will have set full correct image URL, so store it
        var data_img = data.image;
        
        var button_edit_click = function() {
            api.call("get/item/"+data.id, function(data) {
                popup.hide();
                
                // restore full item image URL
                data.image = data_img;
                
                // create item editor
                var form = item_editor(data);
                
                // new popup
                popup.create(form, data.name, $("<button>")
                    .addClass("btn btn-warning")
                    .html("<i class='icon-remove-circle icon-white'></i> Cancel")
                    .click(button_cancel_click)
                );
            });
            
            return false;
        };
        
        // cancel button clicker
        var button_cancel_click = function() {
            // reload item data
            api.call("get/item/"+data.id, function(data) {
                // remove current popup
                popup.hide();
                
                // restore full item image URL
                data.image = data_img;
                
                load_item_popup(data, button_edit_click);
            });
            
            return false;
        };
        
        load_item_popup(data, button_edit_click);
        
        return false;
    };
    
    function load_item_popup(data, edit_cb) {
        var content_box = $("<div>").addClass("item_detail");
        
        // populate content box with item data
        item_info(data, content_box);
        
        // create edit button
        var button_edit = $("<button>")
        .addClass("btn btn-success")
        .html("<i class='icon-pencil icon-white'></i> Edit")
        .click(edit_cb);
        
        // create footer element for popup
        var footer = $("<div>").append(button_edit);
        
        // finally, create and display popup box
        popup.create(content_box, data.name, footer);
        
        return false;
    }
    
    function item_info(data, content_box) {
        var ii;
        
        // clear out content box
        content_box.html("");
        
        var content = $("<div>");
        
        content_box.append(content);
        content_box.append("<div style='clear:both'></div>");
        
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
        
        var typebox = "";
        
        if (data.gender) {
            typebox += ((data.gender == "M") ? 
				"<i class='az4im M'></i> Male"
				:
				"<i class='az4im F'></i> Female"
			);
		}
        
        if (data.type && data.type != "None") {
            for(ii in _config.settings.item_types) {
				if (ii == data.type) {
                    typebox += ((typebox)?" / ":"") + _config.settings.item_types[ii];
                    continue;
				}
			}
		}
        
        // display furniture slots
        if (data.slots) {
            typebox += " (" + data.slots + " furniture slot" + (data.slots > 1 ? "s" : "") + ")";
        }
        
        if (typebox) {
            content.append("<p class='alert'>"+typebox+"</p>");
        }
        
        if (data.dev) {
            for(ii in _config.settings.devs) {
                if (ii == data.dev) content.append("<p class='alert'>Developer: "+_config.settings.devs[ii]+"</p>");
            }
        }
        
        // add description/categories etc.
        if (data.description) {
            content_box.append("<p class='alert'>"+data.description+"</p>");
        }
        if (data.tutorial) {
            content_box.append("<p class='alert'><i>How to get</i>: "+data.tutorial+"</p>");
        }
        if (data.categories) {
            var cats = $("<p>").addClass("alert");
            for(ii=0; ii<data.categories.length; ii++) {
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
    }
    
    function item_editor(data) {
        var ii;
        
        // get list of developers
        var devs = [{name: "[none]", value: ''}];
        
        for(ii in _config.settings.devs) {
            devs.push({
                name: _config.settings.devs[ii],
                value: ii
            });
        }
        
        // get list of item types
        var types = [];
        
        for(ii in _config.settings.item_types) {
            types.push({
                name: _config.settings.item_types[ii],
                value: ii
            });
        }
        
        // build item editor form
        var inputs = [
        {
            type: "text",
            name: "name",
            label: "Item Name",
            value: data.name,
            inputcss: {width: "450px"}
        },
        {
            type: "text",
            name: "description",
            label: "Description",
            value: data.description,
            inputcss: {width: "450px"}
        },
        {
            type: "text",
            name: "tutorial",
            label: "Tutorial",
            value: data.tutorial,
            inputcss: {width: "450px"}
        },
        {
            type: "radio",
            name: "gender",
            value: data.gender,
            options: [
                {name: "None", value: ""},
                {name: "Male", value: "M"},
                {name: "Female", value: "F"}
            ],
            css: {"float": "right"}
        },
        {
            type: "dropdown",
            name: "dev",
            label: "<p style='margin:8px'>Developer</p>",
            value: data.dev,
            options: devs
        },
        {
            type: "clear"
        }
        ];
        
        inputs.push({
            type: "info",
            text: "<strong>0</strong>: unknown / <strong>-1</strong>: free / <strong>-2</strong>: reward / <strong>-3</strong>: no longer available / <strong>-4</strong>: PS3 game reward"
        });
        
        for(ii in _config.settings.prices) {
            inputs.push({
                type: "text",
                name: ii,
                value: (data.prices[ ii ]) ? data.prices[ ii ] : "",
                label: _config.settings.prices[ ii ].name,
                inputcss: {width: "40px"},
                labelcss: {float: "left", padding: "4px"},
                css: {float: "left"}
            });
        }
        
        inputs.push({
            type: "clear"
        });
        
        inputs.push({
            type: "radio",
            name: "type",
            value: data.type,
            options: types,
            row_limit: 9
        });
        
        inputs.push({
            type: "text",
            name: "slots",
            value: data.slots,
            label: "Furniture Slots",
            inputcss: {width: "40px"}
        });
        
        var form = forms(inputs);
        
        var div = $("<div>").append("<img src='"+data.image+"' style='float:left;margin:3px;' />").append(form);
        
        return div;
    }
    
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
            return false;
        };
        
        return i;
    };
    
    return $t;
});
