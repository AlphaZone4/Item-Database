// show developer page! :)

define(["frame", "config", "api"], function(frame, _config, api) {
    frame.add_page(/^dev\/([a-z0-9]+)$/, function(m) {
        // check this developer slug exists
        var dev_slug = m[1];
        var dev = _config.settings.devs[ dev_slug ];
        if (!dev) return false;
        
        var h = $("<div>");
        
        h.append("<h2>"+dev+" Developer Page</h2>");
        
        var updates = $("<div>Loading developer release history...</div>");
        
        h.append(updates);
        
        // load developer update list
        api.call("get/releases/"+dev_slug, {}, function(data) {
            var list = "";
            for(var ii=0; ii<data.length; ii++) {
                if (data[ii].region == "EU") {
                    list += "<p>"+data[ii].name+" ("+data[ii].item_num+" items released)</p>";
                }
            }
            updates.html(list);
        });
        
        frame.page.html(h);
        
        return true;
    });
});