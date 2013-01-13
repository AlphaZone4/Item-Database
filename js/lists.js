define(["config", "nav", "img", "stars", "api", "items", "resize", "pricer"], function(_config, nav, img, stars, api, items, resize, pricer) {
    // module header
    var $t = {};
    $t.module = "lists";
    // define item width, used for calculating number of complete rows
    var item_width = 138;
    
    var lists = [];
    
    // handle window resize, work out correct number of items to show
    var resizer = function() {
        for(var ii=0; ii<lists.length; ii++) {
            // if we have zero or less rows (i.e, disabled) then skip this
            if (_config.maxRows >= 1) {
                // find width of list
                lists[ii].cols = Math.floor( lists[ ii ].body.innerWidth() / item_width );
                
                // only redraw if the number of colums has changed
                if (lists[ii].cols != lists[ii].prev_cols) {
                    lists[ii].page_items = lists[ii].cols * _config.maxRows;
                    lists[ii].prev_cols = lists[ii].cols;
                    lists[ii].redraw();
                }
            }
        }
    };
    
    var makePageLink = function(page) {
        var that = this;
        return $("<li>").append(
            nav.link(page+1, "#", {
                click: function() {
                    return that.pageLink(page);
                }
            })
        );
    };
    
    var pageLink = function(page) {
        this.page_item = page * this.page_items;
        this.redraw();
        return false;
    }
    
    // this function is included with a list object so it can rebuild itself
    var redrawList = function() {
        // clean out list
        this.body.html("");
        
        // create list object
        var list = $("<ul>").addClass("thumbnails").addClass("az4list");
        
        var l = this.data;
        for(var ii=this.page_item; ii<Math.min(this.data.length, this.page_item+this.page_items); ii++) {
            var i = $("<li></li>");
            
            // add link to list element
            var h = nav.link("<p>"+l[ii].name+"</p>", (l[ii].page) ? l[ii].page : "#", {
                click: (l[ii].click) ? l[ii].click : function(){return false;}
            }).addClass("thumbnail");
            
            i.append(h);
            
            // add this item's data to the DOM object
            l[ii].list = this; // also store a reference to the list object
            i.data("item", l[ii]);
            
            // add image (using image loader)
            h.prepend(img.create(l[ii].image));
            
            // if we have the stars module loaded and have been given rating data
            if ( l[ii].rating_id ) {
                h.append($("<div>").addClass("footer").append(stars.create(l[ii].rating_id, l[ii].rating, l[ii].votes)));
            }
            
            if ( l[ii].icons ) {
                // force to array
                l[ii].icons = [].concat(l[ii].icons);
                
                for(var jj=0; jj<l[ii].icons.length; jj++) {
                    var j = l[ii].icons[jj];
                    
                    // check this is an object
                    if (!j.image) {
                        j = {
                            place: 1,
                            image: j
                        };
                    }
                    
                    h.append("<i class='az4im "+j.image+" icon"+(parseInt(j.place, 10))+"'></i>");
                }
            }
            
            // add hover element
            if ( l[ii].hover ) {
				h.append($("<div>").addClass("hover").html($("<p>").html(l[ii].hover)));
			}
            
            list.append(i);
        }
        
        // append list to body
        this.body.append(list);
        
        // create pagination controls
        if (this.page_items > 0 && this.data.length > this.page_items) {
            // create page numbers
            var pag = $("<div>").addClass("pagination pagination-centered");
            var pag_list = $("<ul>");
            
            var pages = Math.ceil(this.data.length / this.page_items);
            
            var that = this;
            
            // add previous page link
            var prev = $("<li>").append(
                nav.link("«", "#", {
                    click: function() {
                        return that.pageLink( Math.max(0, Math.floor( that.page_item / that.page_items ) - 1) );
                    }
                })
            );
            if (this.page_item === 0) prev.addClass("disabled");
            pag_list.append(prev);
            
            for(var ii=0; ii<pages; ii++) {
                var l = this.makePageLink(ii);
                if (ii == this.page_item / this.page_items) l.addClass("disabled");
                pag_list.append(l);
            }
            
            // add next page link
            var next = $("<li>").append(
                nav.link("»", "#", {
                    click: function() {
                        if (that.page_item + that.page_items < that.data.length) {
                            return that.pageLink( Math.floor( that.page_item / that.page_items ) + 1 );
                        } else {
                            return false;
                        }
                    }
                })
            );
            if (this.page_item + this.page_items > this.data.length) next.addClass("disabled");
            pag_list.append(next);
            
            pag.append(pag_list);
            
            // prepend pagnation to body
            this.body.prepend(pag);
        }
        
        // if we have a page, prepend it (do this here to render before the page controls)
        if (this.datapage) {
            this.body.prepend($("<div class='page'>").html($t.az4Markup(this.datapage)));
        }
        
        // now we've pushed to DOM, fetch the images sexily
        img.go();
    };
    
    $t.az4Markup = function(page, navhook) {
        if (page) {
            
        	// render category links
    		page = page.replace(/\[cat=([^\]]+)\]([0-9]+)\[\/cat\]/g, "<a href='"+_config.baseURL+"cat/$2' class='loader'>$1</a>");
            
    		// render recent update links
    		page = page.replace(/\[updates\]([A-Z]{2})\[\/updates\]/g, function(t, $1){
                // check if this region exists
                var u = $1.toLowerCase() + "updates";
    			if (!_config.settings[ u ]) return "";
                
                // build a single upload list, to be passed again momentarily
    			var h = "<ul>";
    			for(var i=0; i<5; i++){
    				h += "<li>[update="+_config.settings[ u ][i].name+"]"+_config.settings[ u ][i].id+"[/update]</li>";
    			}
    			h += "</ul>";
                
    			return h;
    		});
            
            // render individual update links
    		page = page.replace(/\[update=([^\]]+)\]([0-9]+)\[\/update\]/g, "<a href='"+_config.baseURL+"update/$2' class='loader'>$1</a>");
            
    		// render freebie links
    		page = page.replace(/\[free=([^\]]+)\]([A-Z]+)\[\/free\]/g, "<a href='"+_config.baseURL+"freebies/$2' class='loader'>$1</a>");
            
            // jQueryify
            page = $(page);
            
            // add category loaders
            page.find(".loader").replaceWith(function() {
                return nav.link($(this).html(), $(this).attr("href"));
            });
            
    		return page;
    	} else {
    		return "";
    	}
    };
    
    // define list loaders here
    var load = {
        Cat: function(id, cb) {
            // store reference to this
            var me = this;
            
            me.hookDo("loadCat_start");
            
            // load API call
            api.call("get/cat/"+id, {}, function(data) {
                // save page (should be bundled with lists)
                me.datapage = data.page;
                
                // check if we're a leaf node or not
                if (data.cats.length > 0) {
                    // load categories
                    me.setItems(data.cats, _config.cdnBase+"/c/", "cat", items.catClick);
                } else {
                    // load items
                    me.setItems(data.items, _config.cdnBase+"/i/", "item", items.itemClick);
                }
                
                me.hookDo("loadCat_complete", data);
                
                if (cb) cb();
            });
        },
        Update: function(id, cb) {
            // store reference to this
            var me = this;
            
            me.hookDo("loadUpdate_start");
            
            // load API call
            api.call("get/update/"+id, {}, function(data) {
                me.datapage = ""; // these never have pages 
                
                // load items
                me.setItems(data.items, _config.cdnBase+"/i/", "item", items.itemClick);
                
                me.hookDo("loadUpdate_complete", data);
                
                if (cb) cb();
            });
        },
        Free: function(id, cb) {
            // store reference to this
            var me = this;
            
            me.hookDo("loadFree_start");
            
            // load API call
            api.call("get/free/"+id, {}, function(data) {
                me.datapage = ""; // these never have pages 
                
                // load items
                me.setItems(data.items, _config.cdnBase+"/i/", "item", items.itemClick);
                
                me.hookDo("loadFree_complete", data);
                
                if (cb) cb();
            });
        }
    };
    
    // provide a list of items to display in "az4Item" format
    var setItems = function(items, imgpre, page, clickhandle) {
        // prepend URL to all images if presented
        if (imgpre) {
            for(var ii=0; ii<items.length; ii++) {
                items[ii].image = imgpre+items[ii].image;
            }
        }
        
        // add click handles
        if (clickhandle) {
            for(var ii=0; ii<items.length; ii++) {
                items[ii].click = clickhandle;
            }
        }
        
        // add standard additions
        for(var ii=0; ii<items.length; ii++) {
			// check for custom link on this item
			if (items[ii].link) {
				items[ii].page = items[ii].link;
				
				// overwrite clickhandle
				items[ii].click = nav.clicky;
			} else if (page) {
				items[ii].page = page + "/" + items[ii].id;
			}
			
            if (!items[ii].icons) items[ii].icons = [];
            
            // TODO - base this on the current active region pricer
            
            // check for gender
            if (items[ii].gender) {
                items[ii].icons.push({
                    place: 1,
                    image: items[ii].gender
                });
            }
            
            // item gone? :(
            // TODO - check the current region!
            if (items[ii].prices && (items[ii].prices.GBP == -3 || items[ii].prices.USD == -3) ) {
                items[ii].icons.push({
                    place: 0,
                    image: "label_gone"
                });
            }
            
            // item free? :D
            if (items[ii].prices && (items[ii].prices.GBP == -1 || items[ii].prices.USD == -1) ) {
                items[ii].icons.push({
                    place: 0,
                    image: "label_free"
                });
            }
            
            // add price hovers to items
            if (items[ii].prices) {
				items[ii].hover = pricer.print_all(items[ii].prices);
			}
        }
        
        // save items in object
        this.data = items;
        
        // reset pages
        this.page = 0;
        this.page_item = 0;
        
        // redraw list
        this.redraw();
    };
    
    // hook handlers
    var hookDo = function(hook, args) {
        if (this.hooks[hook]) {
            for(var ii=0; ii<this.hooks[hook].length; ii++) {
                this.hooks[hook][ii](args);
            }
        }
    };
    var hookWhen = function(hook, func) {
        // add function to hook array
        if (!this.hooks[ hook ]) {
            this.hooks[ hook ] = [];
        }
        this.hooks[ hook ].push(func);
    };
    
    // create a new list and return the jQuery object
    $t.create = function(opts, _items, target) {
        if (!opts) opts = $t.config;
        
        if (!_items) _items = [];
        
        var l = {
            data: _items,
            filter: {},
            cols: 0, // number of columns, needs to be generated
            prev_cols: 0,
            page: 0,
            page_item: 0, // store first item on page, useful for resizing
            page_items: 0,
            body: $("<div>"), // where list is actually held
            redraw: redrawList,
            setItems: setItems,
            hooks: {},
            hookDo: hookDo,
            hookWhen: hookWhen,
            makePageLink: makePageLink,
            pageLink: pageLink
        };
        
        // add loaders
        for(var ii in load) {
            l['load'+ii] = load[ii];
        }
        
        lists.push(l);
        
        // in 10 miliseconds, run resizer to ensure we list items correctly
        //  should be zero initially, so display none until we get cols
        // TODO: Don't do this if we're not deploying resizable pages
        setTimeout(function(){
            resizer();
            // once we've resized, draw the list
            l.redraw();
        },100);
        
        // if target, populate!
        if (target) {
            target.html(l.body);
        }
        
        return l;
    };
    
    resize.add(resizer);
    
    return $t;
});
