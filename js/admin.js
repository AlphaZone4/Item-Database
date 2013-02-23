define(["config", "popup", "api"], function(_config, popup, api) {
    // array of function pointers for various admin menus
    var menus = [
        admin_menu
    ];
    
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
    function admin_menu(data) {
        // return if not admin!
        if (!_config.settings.database_admin) return;
        
        var menus = [];
        
        // only allow item adding if there are no child categories
        if (data && data.cats && data.cats.length === 0) {
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
                                ]
                            }
                        ], "Add Items to Category", function(form) {
                            api.post("admin/add/items/"+data.id, form, function(response) {
                                console.log(response);
                                popup.hide();
                            });
                        });
                        
                        return false;
                    }
                }
            );
        }
        
        return generic_menu("Admin Tools", "admin", menus);
    }
    
    function build_menus(data) {
        if (!data) return "";
        
        var menu_div = $("<div>").addClass("admin_menus");
        
        for(var ii=0; ii<menus.length; ii++) {
            var t = menus[ii](data);
            if (t) menu_div.append(t);
        }
        
        return menu_div;
    }
    
    return {
        build_menus: build_menus
    };
});