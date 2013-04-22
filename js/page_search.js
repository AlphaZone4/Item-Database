define(["frame", "encrypt", "api", "lists", "forms", "msg", "config"], function(frame, encrypt, api, lists, form, msg, _config) {
    // valid search parameters
    var valid = [
        "query"
    ];
    
    var item_list;
    
    var stats = $("<div>").css("clear", "both");
    
    var do_search = function(opt) {
        // load search results!
        api.call("search/items", opt, function(data) {
            if (data.error) {
                msg.error(data.error);
                item_list.loadPreload([]);
            } else {
                // show basic stats
                stats.html("<strong>"+data.results+"</strong> results in "+((data.data_time + data.search_time) / 1000) + " seconds");
                
                // interfere with data result to get neater prices
                //  do not fear! these items are hot loaded on popup anyway
                for(var ii=0; ii<data.items.length; ii++) {
                    data.items[ii].prices = {
                        GBP: data.items[ii].prices.GBP,
                        EUR: data.items[ii].prices.EUR,
                        USD: data.items[ii].prices.USD,
                        YEN: data.items[ii].prices.YEN,
                        HKD: data.items[ii].prices.HKD
                    };
                }
                
                item_list.loadPreload(data.items);
            }
        });
    };
    
    var search_options = function(opts) {
        if (!opts) opts = {};
        
        var holder = $("<div>");
        
        // load search form
        var f = form(
            [
                {
                    type: "text",
                    name: "query",
                    value: opts.query ? opts.query : "",
                    label: "Search Query"
                },
                {
                    type: "radio",
                    name: "gender",
                    options: [
                        {
                            value: "",
                            name: "All"
                        },
                        {
                            value: "M",
                            name: "Male"
                        },
                        {
                            value: "F",
                            name: "Female"
                        }
                    ],
                    value: (opts.gender == "" || !opts.gender) ? "" : ( opts.gender == "M" ? "M" : "F" )
                },
                {
                    type: "radio",
                    name: "regions",
                    options: [
                        {
                            value: "",
                            name: "Any"
                        },
                        {
                            value: "eu",
                            name: "Europe"
                        },
                        {
                            value: "us",
                            name: "America"
                        },
                        {
                            value: "hk",
                            name: "Asia"
                        },
                        {
                            value: "jp",
                            name: "Japan"
                        }
                    ]
                },
                {
                    type: "submit",
                    value: "Search",
                    cssclass: "btn btn-primary"
                }
            ]
        );
        
        // add some custom search parameters
        var opts = $("<div>").css("width", "400px").css("float", "left");
        
        // add developer filter
        var current_dev_filters = [];
        var dev_filter_box = $("<div>");
        var dev_choose = $("<select id='dev_filter_list'>");
        for(var ii in _config.settings.devs) {
            dev_choose.append("<option value='"+ii+"'>"+_config.settings.devs[ ii ]+"</option>");
        }
        var add_dev_filter = $("<button class='btn btn-primary'>Add</button>").click(function() {
            var dev = $("#dev_filter_list").val();
            
            for(var ii=0; ii<current_dev_filters.length; ii++) {
                if (current_dev_filters[ii] == dev) {
                    return;
                }
            }
            
            current_dev_filters.push(dev);
            var label = $("<span class='label label-info'>"+_config.settings.devs[dev]+"</span>");
            label.click(function() {
                for(var ii=0; ii<current_dev_filters.length; ii++) {
                    if (current_dev_filters[ii] == dev) {
                        current_dev_filters.splice(ii, 1);
                    }
                    
                    $(this).remove();
                }
            });
            dev_filter_box.append(label);
        });
        // disable for now
        //opts.append("Filter by Developer: ").append(dev_choose).append(add_dev_filter).append(dev_filter_box);
        
        // called when form is submitted
        f.submit(function() {
            var opts = f.serializeObject();
            
            // add developer filters
            //console.log(current_dev_filters);
            // TODO - do properly
            if (current_dev_filters[0]) {
                opts.dev = current_dev_filters[0];
            }
            
            // strip equals signs from URL, they're just padding anyway.
            var URL = encrypt.base64_encode(JSON.stringify(opts)).replace(/\=/g, '').replace(/\+/g, '_');
            
            console.log("New search URL: "+URL);
            
            az4db_do("pageChange", "search/"+URL);
            
            do_search(opts);
            
            return false;
        });
        
        f.css("width", "320px").css("float", "left");
        
        holder.append(f).append(opts);
        
        return holder;
    };
    
    frame.add_page(/^search\/?(?:$|([0-9a-zA-Z\_\+\=]+)\/?$)/, function(m) {
        var obj;
        
        // we have a stored search query!
        if (m[1]) {
            m[1] = m[1].replace(/\_/g, '+');
            
            // stored search result
            try {
                var data = encrypt.base64_decode(m[1]);
                
                // remove dodgy characters from base64 decode
                data = data.replace(/\}[^\}]*$/, '\}');
                
                obj = JSON.parse(data);
            } catch(e) {
                console.log("ERROR: "+e);
            }
        }
        
        frame.clear();
        
        frame.page.html("<h2>Item Database Search</h2>");
        
        frame.page.append(search_options(obj));
        
        stats.html("");
        frame.page.append(stats)
        
        item_list = lists.create(null, null);
        frame.page.append(item_list.body);
        
        // sort out search results (if any)
        if (obj) {
            // verify search query
            var call = {};
            for(var ii=0; ii<valid.length; ii++) {
                if (obj[ valid[ii] ]) {
                    call[ valid[ii] ] = obj[ valid[ii] ];
                }
            }
            
            // do search
            do_search(call);
        }
        
        return true;
    });
});