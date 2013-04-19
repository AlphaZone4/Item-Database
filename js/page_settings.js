// configuration page

define(["frame", "forms", "config", "cookies", "resize", "msg"], function(frame, forms, _config, cookies, resizer, msg) {
    frame.add_page(/^settings$/, function(m) {
        // check this developer slug exists
        var h = $("<div>");
        
        h.append("<h2>Item Database Settings</h2>");
        
        h.append("<p>You can configure some basic database settings on this page to change your browsing experience.</p>");
        h.append("<p>These settings are stored in your browser's cookies and do not require an AlphaZone4 account.</p>");
        
        h.append("<h3>Display Settings</h3>");
        
        var save_settings = function() {
            var settings = form.serializeObject();
            
            // save settings
            for(var ii in settings) {
                cookies.set("az4config_"+ii, settings[ ii ]);
                _config[ ii ] = settings[ ii ];
            }
            
            // make list resize itself to get latest configuration
            resizer.run();
            
            msg.success("Updated settings!");
        };
        
        var form = forms([{
            type: "dropdown",
            name: "maxRows",
            label: "<h4>Rows of tiles</h4>",
            value: _config.maxRows,
            options: [
                {
                    value: 100,
                    name: "No pages"
                },
                {
                    value: 3,
                    name: "3 Rows"
                },
                {
                    value: 4,
                    name: "4 Rows"
                },
                {
                    value: 5,
                    name: "5 Rows"
                },
                {
                    value: 6,
                    name: "6 Rows"
                }
            ]
        },
        {
            type: "clear"
        },
        {
            type: "dropdown",
            name: "itemTitle",
            label: "<h4>Item tile title</h4>",
            value: _config.itemTitle,
            options: [
                {
                    value: "name",
                    name: "Item Name"
                },
                {
                    value: "price",
                    name: "Item Price"
                }
            ]
        }
        ], save_settings);
        
        h.append(form);
        
        // add settings save button
        var save = $("<button>")
        .addClass("btn btn-success")
        .html("<i class='icon-pencil icon-white'></i> Edit")
        .click(save_settings);
        
        h.append(save);
        
        frame.clear();
        
        frame.page.html(h);
        
        return true;
    });
});