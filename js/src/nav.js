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
        //var n = $('<div class="navbar-inner"><div class="container"><a class="brand" href="#home"><img src="blank.gif" class="az4-images-minilogo"> PlayStation Home Database</a><ul class="nav"><li><a href="#home">Home</a></li><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Items <b class="caret"></b></a><ul class="dropdown-menu"><li><a href="#cat1"><img src="blank.gif" class="az4-images-eusml"> Europe</a></li><li><a href="#cat110"><img src="blank.gif" class="az4-images-ussml"> America</a></li><li><a href="#cat383"><img src="blank.gif" class="az4-images-jpsml"> Japan</a></li><li><a href="#cat286"><img src="blank.gif" class="az4-images-hksml"> Asia</a></li><li class="divider"></li><li><a href="#cat97"><img src="blank.gif" class="az4-images-eusml"> EU Rewards</a></li><li><a href="#cat358"><img src="blank.gif" class="az4-images-ussml"> US Rewards</a></li></ul></li><li><a href="#space">Spaces</a></li></ul><ul class="nav secondary-nav"><li><a href="#about">About</a></li></ul></div></div></div>');
        var n = createMenu();
        navs.push(n);
        return n;
    };
    
    // returns a jQuery object of a link to an item database page
    $t.link = function(name, page, config){
        // setup initial a object with jQuery
        var a = $("<a>");
        
        // set correct URL
        a.attr("href", $s.baseURL+"/"+page);
        
        // set link text
        a.text(name);
        
        // add CSS classes if desired
        if (config && config['class']) {
            if (typeof config['class'] === "string") {
                config['class'] = [ config['class'] ];
            }
            for(var ii=0; ii<config['class'].length; ii++) {
                a.addClass(config['class'][ ii ]);
            }
        }
        
        a.click($t.clicky);
        
        return a;
    };
	
    // initialise navigation module (set hooks etc.)
	$t.init = function() {
        // register hook on page change (so we can update menu items)
        az4db_when("pageChange", handlePageChange);
	};
	
	return $t;
});
