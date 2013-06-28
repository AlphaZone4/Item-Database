define(["config", "popup", "api", "msg", "items", "forms", "jquery", "jqueryui/sortable"], function(_config, popup, api, msg, items, forms) {
    // array of function pointers for various admin menus
    var menus = [
        admin_menu
    ];
    
    // div for storing menus
    var menu_div;
    
    // optional control panel area for admin functions
    var controls = $("<div>").addClass("admin_controls alert");
    
    // make generic drop down menu! (I want to have lots of these!)
    function generic_menu(name, icon, obj) {
        // don't return anything if there are no menu items
        if (obj.length === 0) return null;
        
        var m = $("<div>").addClass("btn-group").append('<a class="btn dropdown-toggle" data-toggle="dropdown" href="#"><i class="az4im '+icon+'"></i> '+name+' <span class="caret"></span></a>');
        
        var list = $("<ul>").addClass("dropdown-menu pull-right").appendTo(m);
        
        for(var ii=0; ii<obj.length; ii++) {
            list.append($("<li><a href='#'>"+obj[ii].name+"</a></li>").click(obj[ii].func));
        }
        
        return m;
    }
    
    // defines admin controls!
    function admin_menu(data, list) {
        // return if not admin!
        if (!_config.settings.database_scan) return;
        
        // return if we're not showing edit tools
        if (!_config.editTools) return;
        
        var menus = [];
        
        if (data && (data.cats || data.items) ) {
            // force page refresh
            menus.push(
                {
                    name: "Force Refresh",
                    func: function() {
                        list.reload();
                        return false;
                    }
                }
            );
        }
        
        // only allow item adding if there are no child categories
        if (_config.settings.database_edit && list.type == "cat" && data && data.cats && data.cats.length === 0) {
            menus.push(
                {
                    name: "Add Items",
                    func: function() {
                        popup.form([
                            {
                                type: "textarea",
                                name: "items"
                            },
                            {
                                type: "radio",
                                name: "inserttop",
                                options: [
                                    {value: "true", name: "Top"},
                                    {value: "false", name: "Bottom"}
                                ],
                                value: "true"
                            }
                        ], "Add Items to Category", function(form) {
                            api.post("admin/add/items/"+data.id, form, function(response) {
                                // show error/success message
                                if (response.error) {
                                    msg.error(response.error);
                                } else {
                                    msg.success(response.success);
                                    // reload list object
                                    if (list.reload) list.reload();
                                }
                                
                                popup.hide();
                            });
                        });
                        
                        return false;
                    }
                }
            );
        }
        
        // add new category to this category
        //  note that cats usually report one item as it's top-rated item
        if (_config.settings.database_admin && list.type == "cat" && data && data.items && !data.items[0]) {
            menus.push(
                {
                    name: "Add New Category",
                    func: function() {
                        popup.form([
                            {
                                type: "text",
                                name: "name",
                                label: "Category Name"
                            },
                            {
                                type: "text",
                                name: "icon",
                                label: "Icon"
                            }
                        ], "Add New Child Category", function(form) {
                            api.post("admin/add/cat/"+data.id, form, function(response) {
                                // show error/success message
                                if (response.error) {
                                    msg.error(response.error);
                                } else {
                                    msg.success(response.success);
                                    // reload list object
                                    if (list.reload) list.reload();
                                }
                                
                                popup.hide();
                            });
                        });
                        
                        return false;
                    }
                }
            );
        }
        
        // edit all items
        if (_config.settings.database_edit && data && data.items && data.items.length > 0) {
            menus.push(
                {
                    name: "Edit All Items",
                    func: function() {
                        if (!list.reload) return false;
                        
                        list.reload(function(){
                            // get refreshed item data
                            data.items = list.data;
                            
                            var h = $("<div>");
                            
                            var edit_item = function(new_data) {
                                // find image to save
                                var data_img;
                                for(var ii=0; ii<data.items.length; ii++) {
                                    if (data.items[ii].id == new_data.id)
                                        data_img = data.items[ii].image;
                                }
                                
                                api.post("edit/item/"+new_data.id, new_data, function(res) {
                                    if (res.item) {
                                        msg.success("Successfully edited item "+res.item.id);
                                        
                                        // restore item image
                                        res.item.image = data_img;
                                        
                                        // update this editor div
                                        update_editor(res.item);
                                    } else if (res.error) {
                                        msg.error(res.error);
                                    }
                                });
                            };
                            
                            var update_editor = function(item) {
                                $("#item_edit_"+item.id).html(
                                    items.editor(item, edit_item)
                                );
                            };
                            
                            for(var ii=0; ii<data.items.length; ii++) {
                                h.append($("<div>")
                                    .attr("id", "item_edit_"+data.items[ ii ].id)
                                    .html(
                                        items.editor(data.items[ ii ], edit_item)
                                    )
                                );
                                
                                h.append("<hr />");
                            }
                            
                            list.list.html(h);
                                
                            controls.html(
                                $("<button>").addClass("btn btn-warning")
                                .text("Stop Editing")
                                .click(function() {
                                    list.reload();
                                })
                            );
                            menu_div.append(controls);
                        });
                        
                        return false;
                    }
                }
            );
        }
        
        // edit page
        if (_config.settings.database_admin && list.type == "cat" && data) {
            menus.push(
                {
                    name: "Edit Page",
                    func: function() {
                        popup.form([
                            {
                                type: "textarea",
                                name: "page",
                                label: "Page Content",
                                value: data.page,
                                width: "600px"
                            }
                        ], "Edit Category Page", function(form) {
                            console.log(form);
                            api.post("edit/page/"+data.id, form, function(response) {
                                // show error/success message
                                if (response.error) {
                                    msg.error(response.error);
                                } else {
                                    msg.success(response.success);
                                    // reload list object
                                    if (list.reload) list.reload();
                                }
                                
                                popup.hide();
                            });
                        });
                        
                        return false;
                    }
                }
            );
        }
        
        // reorder items
        if (_config.settings.database_edit && list.type=="cat" && data && data.items && data.cats && (data.items.length || data.cats.length) ) {
            menus.push(
                {
                    name: "Organise Items",
                    func: function() {
                        // remember current list page setting
                        var mem = list.page_items;
                        list.page_items = 0;
                        
                        // reload the list without any pages on
                        list.reload(function(){
                            // grab actual list object
                            var l = $(list.body.find(".az4list")[0]);
                            
                            // make list sortable
                            l.sortable({
                                update : function () {
                                    // send new order to server automagically upon dropping an item
                                    api.post("admin/reorder/"+data.id, {
                                        order: $(this).sortable("toArray")
                                    }, function(response) {
                                        // show error/success message
                                        if (response.error) {
                                            msg.error(response.error);
                                        } else {
                                            msg.success(response.success);
                                        }
                                        
                                        // don't reload the list so we're able to sort multiple items quickly
                                    });
                                }
                            });
                            
                            // highlight that we're doing something by colouring all items
                            l.find("li").addClass("alert-info");
                            
                            // now that list is reloaded, restore item page number
                            list.page_items = mem;
                            
                            // cancel button
                            controls.html(
                                $("<button>").addClass("btn btn-warning")
                                .text("Stop Sorting")
                                .click(function() {
                                    list.reload();
                                })
                            );
                            
                            menu_div.append(controls);
                        });
                        
                        return false;
                    }
                }
            );
        }
        
        // mass editor
        if (_config.settings.database_edit && (list.type=="cat" || list.type=="update") && data && data.items && data.items.length ) {
            menus.push(
                {
                    name: "Mass Edit",
                    func: function() {
                        // remember current list page setting
                        var mem = list.page_items;
                        list.page_items = 0;
                        
                        // reload the list without any pages on
                        list.reload(function(){
                            // grab actual list object
                            var l = $(list.body.find(".az4list")[0]);
                            
                            var items2edit = [];
                            
                            // remove item click handlers and replace with item selector
                            l.find("a.thumbnail").each(function() {
                                $(this).off('click');
                                $(this).click(function() {
                                    var found = -1;
                                    for(var ii=0; ii<items2edit.length; ii++) {
                                        if (items2edit[ ii ] == $(this).parent().attr("id")) {
                                            found = ii;
                                        }
                                    }
                                    
                                    if (found >= 0) {
                                        $(this).removeClass("highlight");
                                        
                                        items2edit.splice(found, 1);
                                    } else {
                                        $(this).addClass("highlight");
                                        
                                        items2edit.push(parseInt($(this).parent().attr("id")));
                                    }
                                    
                                    return false;
                                });
                            });
                            
                            // now that list is reloaded, restore item page number
                            list.page_items = mem;
                            
                            controls.html("");
                            
                            // setup mass edit options
                            var options = [];
                            for(var ii in _config.settings.prices) {
                                options.push({
                                    name: _config.settings.prices[ ii ].name+" "+ii,
                                    value: _config.settings.prices[ ii ].field
                                });
                            }
                            options.push({
                                name: "Furniture Slots",
                                value: "slots"
                            });
                            
                            // work out if we have a default value for the dropdown
                            if (data.country) {
                                var default_func = "";
                                if (_config.regions[ data.country.toLowerCase() ]) {
                                    default_func = _config.settings.prices[ _config.regions[ data.country.toLowerCase() ].pricer ].field;
                                }
                            }
                            
                            var inputs = [
                                {
                                    type: "dropdown",
                                    name: "function",
                                    options: options,
                                    change: function() {
                                        // modify form if we have a special dropdown
                                        var new_type = $(this).attr("value");
                                        
                                        if (dropdowns[ new_type ]) {
                                            // we have a dropdown!
                                            $(".massedit_text").hide();
                                            $(".massedit_dropdown").show();
                                            
                                            // build new list of dropdowns
                                            var h = "";
                                            for(var ii=0; ii<dropdowns[ new_type ].length; ii++) {
                                                h += "<option value='"+dropdowns[ new_type ][ii].value+"'>"+dropdowns[ new_type ][ii].name+"</option>";
                                            }
                                            
                                            $(".massedit_dropdown").html(h);
                                        } else {
                                            // normal text entry
                                            $(".massedit_text").show();
                                            $(".massedit_dropdown").hide();
                                        }
                                    },
                                    value: default_func
                                },
                                {
                                    type: "text",
                                    name: "value_text",
                                    cssclass: "massedit_text"
                                },
                                {
                                    type: "dropdown",
                                    name: "value_dropdown",
                                    options: [],
                                    cssclass: "massedit_dropdown hide"
                                },
                                {
                                    type: "submit",
                                    value: "Make Changes"
                                }
                            ];
                            
                            // some editing functions can have dropdowns instead of text entry
                            var dropdown_devs = [];
                            for(var ii in _config.settings.devs) {
                                dropdown_devs.push({
                                    name: _config.settings.devs[ ii ],
                                    value: ii
                                });
                            }
                            
                            var dropdown_types = [];
                            for(var ii in _config.settings.item_types) {
                                dropdown_types.push({
                                    name: _config.settings.item_types[ ii ],
                                    value: ii
                                });
                            }
                            
                            var dropdowns = {
                                gender: [
                                    {
                                        name: "None",
                                        value: ""
                                    },
                                    {
                                        name: "Male",
                                        value: "M"
                                    },
                                    {
                                        name: "Female",
                                        value: "F"
                                    }
                                ],
                                dev: dropdown_devs,
                                type: dropdown_types
                            };
                            
                            var dropdown_names = {
                                gender: "Gender",
                                dev: "Developer",
                                type: "Item Type"
                            };
                            
                            // add dropdowns to inputs list
                            for(var ii in dropdowns) {
                                options.push({
                                    name: dropdown_names[ ii ],
                                    value: ii
                                });
                            }
                            
                            var form = forms(inputs, function(form_data, reset) {
                                if (!items2edit.length) return;
                                
                                var data = {
                                    ids: items2edit.join(",")
                                };
                                
                                // choose which data input to use
                                if (dropdowns[ form_data['function'] ]) {
                                    data[ form_data['function'] ] = form_data['value_dropdown'];
                                } else {
                                    data[ form_data['function'] ] = form_data['value_text'];
                                }
                                
                                api.post("edit/items", data, function(result) {
                                    if (result.success) {
                                        msg.success(result.success);
                                    } else if (result.error) {
                                        msg.error(result.error);
                                    }
                                });
                                
                                // allow form to be resubmitted
                                reset();
                            });
                            
                            controls.append(form);
                            
                            // select all button
                            controls.append(
                                $("<button>").addClass("btn btn-info")
                                .text("Select All")
                                .click(function() {
                                    l.find("a.thumbnail").each(function() {
                                        if (!$(this).hasClass("highlight")) {
                                            $(this).click();
                                        }
                                    });
                                    
                                    return false;
                                })
                            );
                            
                            // select none button
                            controls.append(
                                $("<button>").addClass("btn btn-info")
                                .text("Select None")
                                .click(function() {
                                    l.find("a.thumbnail").each(function() {
                                        if ($(this).hasClass("highlight")) {
                                            $(this).click();
                                        }
                                    });
                                    
                                    return false;
                                })
                            );
                            
                            // invert button
                            controls.append(
                                $("<button>").addClass("btn btn-info")
                                .text("Invert Selection")
                                .click(function() {
                                    l.find("a.thumbnail").each(function() {
                                        $(this).click();
                                    });
                                    
                                    return false;
                                })
                            );
                            
                            // cancel button
                            controls.append(
                                $("<button>").addClass("btn btn-warning")
                                .text("Stop Editing")
                                .click(function() {
                                    list.reload();
                                })
                            );
                            
                            menu_div.append(controls);
                        });
                        
                        return false;
                    }
                }
            );
        }
        
        return generic_menu("Admin Tools", "admin", menus);
    }
    
    function build_menus(list) {
        var data = list.fetch_data;
        
        if (!data) return "";
        
        menu_div = $("<div>").addClass("admin_menus");
        
        for(var ii=0; ii<menus.length; ii++) {
            var t = menus[ii](data, list);
            if (t) menu_div.append(t);
        }
        
        return menu_div;
    }
    
    return {
        build_menus: build_menus
    };
});