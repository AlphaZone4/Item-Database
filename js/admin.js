define(["config", "popup", "api", "msg", "items", "jquery", "jqueryui/sortable"], function(_config, popup, api, msg, items) {
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
        if (!_config.settings.database_edit) return;
        
        var menus = [];
        
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