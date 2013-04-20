define(["frame", "config", "nav"], function(frame, _config, nav) {
    frame.add_page(/^\/?$/, function() {
        frame.clear();
        
        var special_pages = {
            eu: function(list) {
                list.append($("<li>").html(
                    nav.link(
                        "Free Store Items",
                        "freebies/EU"
                    )
                ));
                list.append($("<li>").html(
                    nav.link(
                        "Reward Items",
                        "cat/97"
                    )
                ));
                list.append($("<li>").html(
                    nav.link(
                        "Redeem Codes",
                        "codes"
                    )
                ));
            },
            us: function(list) {
                list.append($("<li>").html(
                    nav.link(
                        "Free Store Items",
                        "freebies/US"
                    )
                ));
                list.append($("<li>").html(
                    nav.link(
                        "Reward Items",
                        "cat/358"
                    )
                ));
                list.append($("<li>").html(
                    nav.link(
                        "Redeem Codes",
                        "codes"
                    )
                ));
            },
            jp: function(list) {
                list.append($("<li>").html(
                    nav.link(
                        "Free Store Items",
                        "freebies/JP"
                    )
                ));
            },
            hk: function(list) {
                list.append($("<li>").html(
                    nav.link(
                        "Free Store Items",
                        "freebies/HK"
                    )
                ));
            }
        };
        
        var region_box = function(region) {
            var h = $("<div>").addClass("span3 home_box thumbnail");
            
            // list latest region updates
            if (_config.settings[region+"updates"] && _config.settings[region+"updates"].length) {
                h.append("<p><strong><i class='az4im flag_"+_config.regions[ region ].flag+"'></i> "+_config.regions[ region ].name+"</strong></p><p><strong>Latest Updates</strong></p>");
                
                var list = $("<ul>");
                
                for(var ii=0; ii<_config.settings[region+"updates"].length; ii++) {
                    list.append($("<li>").html(
                        nav.link(
                            _config.settings[region+"updates"][ ii ].name,
                            "update/"+_config.settings[region+"updates"][ ii ].id
                        )
                    ));
                }
                
                h.append(list);
                
                // set up special pages list
                if (special_pages[ region ]) {
                    h.append("<p><strong>Special Pages</strong></p>");
                    var special = $("<ul>");
                    
                    special_pages[ region ](special);
                    
                    h.append(special);
                }
                
                // basic stats
                if (_config.settings[ region.toUpperCase() ]) {
                    var s = _config.settings[ region.toUpperCase() ];
                    
                    s.m = parseInt(s.m);
                    s.f = parseInt(s.f);
                    
                    var reg = $("<p>").css("clear", "both");
                
                    reg.append("<p><strong>Stats</strong></p>");
                    reg.append("<ul><li>"+s.tot+" live items</li></ul>");
                    
                    reg.append("<span style='float:left'><i class='az4im M'></i> "+s.m+" <strong>"+
                        (Math.round(1000*s.m/(s.m+s.f))/10)
                    +"%</strong></span>");
                    reg.append("<span style='float:right'><strong>"+
                        (Math.round(1000*s.f/(s.m+s.f))/10)
                    +"%</strong> "+s.f+" <i class='az4im F'></i></span>");
                    
                    h.append(reg);
                }
            }
            
            return h;
        };
        
        var page = $("<div>").addClass("row");
        
        // set up region overviews
        for (var ii in _config.regions) {
            page.append(region_box(ii));
        }
        
        // set up basic database stats etc.
        var stats = $("<div>").addClass("span3 home_box thumbnail");
        stats.append("<p><strong>Global Database Stats</strong></p>");
        
        stats.append("<p><strong>"+_config.settings.global.tot+"</strong> total logged items<br />");
        
        var count = 0;
        for(var ii in _config.settings.devs) count = count+1;
        
        stats.append("<p><strong>"+count+"</strong> Home developers/publishers<br />");
        
        page.append(stats);
        
        // push page to frame
        frame.page.html("<h2>AlphaZone4 Item Database</h2>");
        
        frame.page.append(page);
        
        return true;
    });
});