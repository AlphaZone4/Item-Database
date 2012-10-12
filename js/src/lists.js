define(function() {
    // module header
    var $t = {};
    $t.module = "lists";
    // define item width, used for calculating number of complete rows
    var item_width = 154;
    
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
                    lists[ii].redraw();
                    lists[ii].page_items = lists[ii].cols * $t.config.rows;
                    lists[ii].prev_cols = lists[ii].cols;
                }
            }
        }
    };
    
    // this function is included with a list object so it can rebuild itself
    var redrawList = function() {
        // clean out list
        this.body.html("");
        
        var l = this.data;
        for(var ii=this.page_item; ii<this.page_item+this.page_items; ii++) {
            var i = $("<li><a href='#' class='thumbnail'><p>"+l[ii].name+"</p></a></li>");
            
            var h = i.find("a");
            
            // assign onclick handle
            if (l[ii].click) h.click(l[ii].click);
            
            // add image (using image loader)
            if ( $m.img ) {
                h.prepend($m.img.create(l[ii].img));
            } else {
                // no image loader?!
                h.prepend("<img src='"+l[ii].img+"' />");
            }
            
            // if we have the stars module loaded and have been given rating data
            if ( l[ii].rating && $m.stars ) {
                h.append($("<div>").addClass("footer").append($m.stars.create(l[ii].rating.vote_id, l[ii].rating.rating, l[ii].rating.votes)));
            }
            
            this.body.append(i);
        }
        
        // now we've pushed to DOM, fetch the images sexily
        if ( $m.img ) $m.img.go();
    };
    
    // create a new list and return the jQuery object
    $t.create = function(opts, _items) {
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
            body: $("<ul>").addClass("thumbnails").addClass("az4list"), // where list is actually held
            redraw: redrawList
        };
        
        // DEBUG
        for(var a=0; a<100; a++) l.data.push($m.items.list({
            img: "http://cdn.beta.alphazone4.com/i/54c39a6df4c2cda1e44693b7cd241d57.png",
            name: "Delirious Squid Skate Trainers Pack "+a,
            rating: {
                rating: 4.5,
                votes: 3,
                vote_id: 1
            }
        }));
        
        lists.push(l);
        
        // in 10 miliseconds, run resizer to ensure we list items correctly
        //  should be zero initially, so display none until we get cols
        // TODO: Don't do this if we're not deploying resizable pages
        setTimeout(function(){
            resizer();
            // once we've resized, draw the list
            l.redraw();
        },100);
        
        return l;
    };
    
    // provide a list of items to display in "az4Item" format
    //  must pass in jQuery object of list too
    $t.set = function(l, _items) {
        
    };
    
    $t.init = function() {
        // bind resizer to on_resize event
        on_resize(resizer);
        
        // DEBUG CODE
        $("#database").append($t.create().body);
    };
    
    return $t;
});