// This class defines the basic AZ4 "frame" for building an essential Item DB
define(["config", "nav", "lists", "version", "msg"], function(_config, nav, lists, version, msg){
    var $t = {};
    $t.module = "frame";
    
    var pages = [
        {
            match: /cat\/([0-9]+)/,
            func : function(m) {
                $t.list.loadCat(m[1]);
                return true;
            }
        },
        {
            match: /update\/([0-9]+)/,
            func : function(m) {
                $t.list.loadUpdate(m[1]);
                return true;
            }
        },
        {
            match: /freebies\/([A-Z]{2})/,
            func : function(m) {
                $t.list.loadFree(m[1]);
                return true;
            }
        }
    ];
    
    // allow the API to create new pages in the frame
    $t.add_page = function(regex, func) {
		pages.push({
			match: regex,
			func : func
		});
	};
	
	// create the breadcrumb
	$t.breadcrumb = function(data) {
		if (data) {
			$t.crumb.html("").show();
			// setup breadcrumb
			if (data.length>1) {
				for(var ii=0; ii<data.length; ii++) {
					$t.crumb.append("<li>"+
						((ii === 0)?"<i class='az4im "+_config.home2Dat[ data[ii].id ].flag+"'></i> ":"")+
						((ii<(data.length-1))?
						"<a class='crumb_click' href='"+_config.baseURL+"/cat/"+data[ii].id+"'>"+
							data[ii].name+
						"</a><span class='divider'>/</span>":data[ii].name)+
					"</li>");
				}
			} else {
				$t.crumb.append("<li><i class='az4im "+_config.home2Dat[ data[0].id ].flag+"'></i> "+data[0].name+"</li>");
			}
			
			// assign breadcrumb click handles
			$(".crumb_click").click(function() {
				var cat = $(this).attr("href").match(/\d+$/);
				if (cat) {
					$t.list.loadCat(cat[0]);
				}
				return false;
			});
		} else {
			$t.crumb.html("").hide();
		}
	};
	
	// clear out frame (except essentials, like the nav)
	$t.clear = function() {
		$t.crumb.html("").hide(); // empty breadcrumb
        $t.list.loadPreload([]); // stop list regenerating itself!!!
		$t.list.body.html(""); // empty list
		$t.page.html("");
	};
    
    $t.create = function(target, cb) {
        // hook for naviagation plugin
        $t.go = function(href, hide_move) {
            // remove query string
            href = href.split("?")[0];
            
            // remove trailing slashes
            if (href.substr(-1) == '/') {
                href = href.substr(0, href.length - 1);
            }
            
            for(var ii=0; ii<pages.length; ii++) {
                var m = pages[ii].match.exec(href);
                if (m) {
					// clear the generic page
					$t.page.html("");
					
					// call page function for rendering
                    if (pages[ii].func(m)) {
                        // trigger pageChange hook
                        if (!hide_move) az4db_do("pageChange", href);
                    }
                    return;
                }
            }
            
            // didn't return. er...
            console.log("Unknown page "+href);
        };

        $t.start = function(href) {
            // only use for starting a frame
            $t.nav.cur_page = href;

            $t.go(href, true);
        };
        
        // create frame object
        $t.nav = nav.create($t.go);
        $t.list = lists.create(null, null);
        $t.crumb = $("<ul>").addClass("breadcrumb");
        $t.page = $("<div>").addClass("page"); // generic page element
        
        // footer (version number etc.)
        $t.footer = $("<div>").html("AlphaZone4 Item Database - version "+version.version+" (Built: "+version.time+")");
        
        var setup_breadcrumb = function(data) {
            // when category has been loaded, we should update the breadcrumb
            $t.breadcrumb(data.breadcrumb);
        };
        
        // setup event hooks
        $t.list.hookWhen("loadCat_complete", setup_breadcrumb);
        $t.list.hookWhen("loadUpdate_complete", setup_breadcrumb);
        $t.list.hookWhen("loadFree_complete", setup_breadcrumb);
        
        // append to target
        target.html("").append($t.nav).append($t.crumb).append($t.page).append($t.list.body).append($t.footer).append(msg.body);
        
        // callback with frame object
        if (cb) cb($t);
    };
    
    return $t;
});
