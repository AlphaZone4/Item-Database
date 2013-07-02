// show developer page! :)

define(["frame", "config", "api", "nav"], function(frame, _config, api, nav) {
    frame.add_page(/^dev\/([a-z0-9]+)$/, function(m) {
        frame.clear();
        
        // check this developer slug exists
        var dev_slug = m[1];
        var dev = _config.settings.devs[ dev_slug ];
        if (!dev) return false;
        
        var h = $("<div>");
        
        h.append("<img src='"+_config.cdnBase+"/d/"+dev_slug+".png' style='float:right;' />")
        
        h.append("<h2 style='clear:none'>"+dev+" Developer Page</h2>");
        
        var devdata = $("<div>Loading developer data...</div>");
        
        h.append(devdata);
        
        api.call("get/dev/"+dev_slug, {}, function(data) {
            var h = "";
            
            h += dev+" has "+data.items+" items in the AlphaZone4 Item Database.";
            
            devdata.html(h);
        });
        
        var updates = $("<div>Loading developer release history...</div>");
        
        h.append(updates);
        
        // load developer update list
        api.call("get/releases/"+dev_slug, {}, function(data) {
            updates.html("<h2>Release History</h2>");
           
            for(var ii=0; ii<data.length; ii++) {
                if (data[ii].region == "EU") {
                    updates.append( $("<p>").html(nav.link(data[ii].name+" ("+data[ii].item_num+" items released)", "update/"+data[ii].update_id)) );
                }
            }
        });
        
        frame.page.html(h);
        
        return true;
    });
});
