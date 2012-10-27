define(function() {
    // file header
    var $t = {};
	$t.module = "nav";
    
    // basic nav structure
    var nav = {
        logo: {
            title: "PlayStation Home Item Database",
            page: "home"
        },
        links: [
            {
                name: 'Home',
                page: 'home',
                type: 'link'
            },
            {
                name: "About",
                page: "about",
                type: "rlink"
            }
        ]
    };
    
    // storage
    var navs = [];
    
    // link handler
    $t.clicky = function(p){
        // no page supplied, let's see if we can find a href
        if (!p) {
            p = $(this).attr("href");
        }
        
        console.log(p);
        
        return false;
    };
    
    var handlePageChange = function(args) {
        for(var ii=0; ii<navs.length; ii++) {
            // TODO: update each nav bar if needed
        }
    };
    
    var createMenu = function(opt){
        if (!opt) opt = nav;
        
        // basic navbar structure
        var h = $('<div class="navbar navbar-inverse">');
        
        var inner = $('<div class="navbar-inner">');
        h.append(inner);
        
        // add logo/brand
        inner.append( $t.link(opt.logo.title, opt.logo.page, {
            'class' :["brand"]
        }).prepend('<i class="az4im minilogo"></i> ') );
        
        // create list of nav items
        var list = $("<ul class='nav'>");
        for(var ii=0; ii<opt.links.length; ii++) {
            list.append( $("<li>").html($t.link(opt.links[ii].name, opt.links[ii].page)) );
        }
        inner.append(list);
        
        return h;
    };
    
    // returns a jQuery object of a navigation bar
    $t.create = function(config) {
        var n = createMenu();
        navs.push(n);
        return n;
    };
    
    // returns a jQuery object of a link to an item database page
    $t.link = function(content, page, config){
        // setup initial a object with jQuery
        var a = $("<a>");
        
        // set correct URL
        a.attr("href", $s.baseURL+page);
        
        // set link text
        a.html(content);
        
        // add CSS classes if desired
        if (config && config['class']) {
            if (typeof config['class'] === "string") {
                config['class'] = [ config['class'] ];
            }
            for(var ii=0; ii<config['class'].length; ii++) {
                a.addClass(config['class'][ ii ]);
            }
        }
        
        // add custom click function if specified
        if (config && config.click) {
            a.click(config.click);
        } else {
            // default click handler
            a.click($t.clicky);
        }
        
        return a;
    };
	
    // initialise navigation module (set hooks etc.)
	$t.init = function() {
        // register hook on page change (so we can update menu items)
        az4db_when("pageChange", handlePageChange);
	};
	
	return $t;
});
