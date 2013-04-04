define(["frame", "encrypt", "api", "lists", "forms", "msg"], function(frame, encrypt, api, lists, form, msg) {
    // valid search parameters
    var valid = [
        "query"
    ];
    
    var item_list;
    
    var do_search = function(opt) {
        // load search results!
        api.call("search/items", opt, function(data) {
            if (data.error) {
                msg.error(data.error);
                item_list.loadPreload([]);
            } else {
                item_list.loadPreload(data.items);
            }
        });
    };
    
    var search_options = function(opts) {
        if (!opts) opts = {};
        
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
                    ]
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
        
        f.submit(function() {
            var opts = f.serializeObject();
            
            var URL = encrypt.base64_encode(JSON.stringify(opts));
            az4db_do("pageChange", "search/"+URL);
            
            do_search(opts);
            
            return false;
        });
        
        return f;
    };
    
    frame.add_page(/^search(?:$|\/([0-9a-zA-Z+\/=]+)?$)/, function(m) {
        var obj;
        
        // we have a stored search query!
        if (m[1]) {
            // stored search result
            try {
                var data = encrypt.base64_decode(m[1]);
                
                if (data.charCodeAt(data.length-1) === 0) {
                    data = data.substring(0, data.length - 1);
                }
                
                obj = JSON.parse(data);
            } catch(e) {
                console.log("ERROR: "+e);
            }
        }
        
        frame.clear();
        
        frame.page.html("<h2>Item Database Search</h2>");
        
        frame.page.append(search_options(obj));
        
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