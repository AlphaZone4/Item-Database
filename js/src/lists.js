define(function() {
    // module header
    var $t = {};
    $t.module = "lists";
    // define item width, used for calculating number of complete rows
    var item_width = 138;
    
    var lists = [];
    
    // store global list configurations (grab these from config?!)
    $t.config = {
        rows: 4
    };
    
    // handle window resize, work out correct number of items to show
    var resizer = function() {
        for(var ii=0; ii<lists.length; ii++) {
            // if we have zero or less rows (i.e, disabled) then skip this
            if ($t.config.rows >= 1) {
                // find width of list
                lists[ii].cols = Math.floor( lists[ ii ].body.innerWidth() / item_width );
                
                // only redraw if the number of colums has changed
                if (lists[ii].cols != lists[ii].prev_cols) {
                    lists[ii].page_items = lists[ii].cols * $t.config.rows;
                    lists[ii].prev_cols = lists[ii].cols;
                    lists[ii].redraw();
                }
            }
        }
    };
    
    var makePageLink = function(page) {
        var that = this;
        return $("<li>").append(
            $m.nav.link(page+1, "#", {
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
        
        // if we have a page, append it
        if (this.datapage) {
            this.body.append($("<div class='page'>").html($t.az4Markup(this.datapage)));
        }
        
        // create list object
        var list = $("<ul>").addClass("thumbnails").addClass("az4list");
        
        var l = this.data;
        for(var ii=this.page_item; ii<Math.min(this.data.length, this.page_item+this.page_items); ii++) {
            var i = $("<li></li>");
            
            // add link to list element
            var h = $m.nav.link("<p>"+l[ii].name+"</p>", (l[ii].page) ? l[ii].page : "#", {
                click: (l[ii].click) ? l[ii].click : function(){return false;}
            }).addClass("thumbnail");
            
            i.append(h);
            
            // add this item's data to the DOM object
            l[ii].list = this; // also store a reference to the list object
            i.data("item", l[ii]);
            
            // add image (using image loader)
            if ( $m.img ) {
                h.prepend($m.img.create(l[ii].image));
            } else {
                // no image loader?!
                h.prepend("<img src='"+l[ii].img+"' />");
            }
            
            // if we have the stars module loaded and have been given rating data
            if ( l[ii].rating_id && $m.stars ) {
                h.append($("<div>").addClass("footer").append($m.stars.create(l[ii].rating_id, l[ii].rating, l[ii].votes)));
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
            pag_list.append($("<li>").append(
                $m.nav.link("«", "#", {
                    click: function() {
                        return that.pageLink( Math.max(0, Math.floor( that.page_item / that.page_items ) - 1) );
                    }
                })
            ));
            
            for(var ii=0; ii<pages; ii++) {
                pag_list.append(this.makePageLink(ii));
            }
            
            // add next page link
            pag_list.append($("<li>").append(
                $m.nav.link("»", "#", {
                    click: function() {
                        if (that.page_item + that.page_items < that.data.length) {
                            return that.pageLink( Math.floor( that.page_item / that.page_items ) + 1 );
                        } else {
                            return false;
                        }
                    }
                })
            ));
            
            pag.append(pag_list);
            
            // prepend pagnation to body
            this.body.prepend(pag);
        }
        
        // now we've pushed to DOM, fetch the images sexily
        if ( $m.img ) $m.img.go();
    };
    
    $t.az4Markup = function(page, navhook) {
        if (page) {
            
        	// render category links
    		page = page.replace(/\[cat=([^\]]+)\]([0-9]+)\[\/cat\]/g, "<a href='"+$s.baseURL+"cat/$2' class='loader'>$1</a>");
            
    		// render recent update links
    		page = page.replace(/\[updates\]([A-Z]{2})\[\/updates\]/g, function(t, $1){
                // check if this region exists
                var u = $1.toLowerCase() + "updates";
    			if (!$s.settings[ u ]) return "";
                
                // build a single upload list, to be passed again momentarily
    			var h = "<ul>";
    			for(var i=0; i<5; i++){
    				h += "<li>[update="+$s.settings[ u ][i].name+"]"+$s.settings[ u ][i].id+"[/update]</li>";
    			}
    			h += "</ul>";
                
    			return h;
    		});
            
            // render individual update links
    		page = page.replace(/\[update=([^\]]+)\]([0-9]+)\[\/update\]/g, "<a href='"+$s.baseURL+"update/$2' class='loader'>$1</a>");
            
    		// render freebie links
    		page = page.replace(/\[free=([^\]]+)\]([A-Z]+)\[\/free\]/g, "<a href='"+$s.baseURL+"freebies/$2' class='loader'>$1</a>");
            
            // jQueryify
            page = $(page);
            
            // add category loaders
            page.find(".loader").replaceWith(function() {
                return $m.nav.link($(this).html(), $(this).attr("href"));
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
            $m.api.call("get/cat/"+id, {}, function(data) {
                // save page (should be bundled with lists)
                me.datapage = data.page;
                
                // check if we're a leaf node or not
                if (data.cats.length > 0) {
                    // load categories
                    me.setItems(data.cats, $s.cdnBase+"/c/", "cat", $m.items.catClick);
                } else {
                    // load items
                    me.setItems(data.items, $s.cdnBase+"/i/", "item", $m.items.itemClick);
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
            $m.api.call("get/update/"+id, {}, function(data) {
                me.datapage = ""; // these never have pages 
                
                // load items
                me.setItems(data.items, $s.cdnBase+"/i/", "item", $m.items.itemClick);
                
                me.hookDo("loadUpdate_complete", data);
                
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
        
        if (page) {
            for(var ii=0; ii<items.length; ii++) {
                items[ii].page = page + "/" + items[ii].id;
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
    
    $t.init = function() {
        // bind resizer to on_resize event
        on_resize(resizer);
        
        // DEBUG CODE
        //$("#database").append($t.create().body);
    };
    
    return $t;
});