// This class defines the basic AZ4 "frame" for building an essential Item DB
define(["config", "nav", "lists"], function(_config, nav, lists){
    var $t = {};
    $t.module = "frame";
    
    var pages = [
        {
            match: /cat\/([0-9]+)/,
            func : function(m) {
                $t.list.loadCat(m[1]);
            }
        },
        {
            match: /update\/([0-9]+)/,
            func : function(m) {
                $t.list.loadUpdate(m[1]);
            }
        },
        {
            match: /freebies\/([A-Z]{2})/,
            func : function(m) {
                $t.list.loadFree(m[1]);
            }
        }
    ];
    
    $t.create = function(target, cb) {
        // hook for naviagation plugin
        var nav_hook = function(href) {
            for(var ii=0; ii<pages.length; ii++) {
                var m = pages[ii].match.exec(href);
                if (m) {
                    pages[ii].func(m);
                    return;
                }
            }
            
            // didn't return. er...
            console.log("Unknown page "+href);
        };
        
        // create frame object
        $t.nav = nav.create(nav_hook);
        $t.list = lists.create(null, null);
        $t.crumb = $("<ul>").addClass("breadcrumb");
        
        var setup_breadcrumb = function(data) {
            // when category has been loaded, we should update the breadcrumb
            $t.crumb.html("");
            if (data.breadcrumb) {
                // setup breadcrumb
                if (data.breadcrumb.length>1) {
                    for(var ii=0; ii<data.breadcrumb.length; ii++) {
                        $t.crumb.append("<li>"+
                            ((ii === 0)?"<i class='az4im "+_config.home2Dat[ data.breadcrumb[ii].id ].flag+"'></i> ":"")+
                            ((ii<(data.breadcrumb.length-1))?
                            "<a class='crumb_click' href='"+_config.baseURL+"cat/"+data.breadcrumb[ii].id+"'>"+
                                data.breadcrumb[ii].name+
                            "</a><span class='divider'>/</span>":data.breadcrumb[ii].name)+
                        "</li>");
                    }
                } else {
                    $t.crumb.append("<li><i class='az4im "+_config.home2Dat[ data.breadcrumb[0].id ].flag+"'></i> "+data.breadcrumb[0].name+"</li>");
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
                // no breadcrumb, hide!
                $t.crumb.hide();
            }
        };
        
        // setup event hooks
        $t.list.hookWhen("loadCat_complete", setup_breadcrumb);
        $t.list.hookWhen("loadUpdate_complete", setup_breadcrumb);
        $t.list.hookWhen("loadFree_complete", setup_breadcrumb);
        
        // append to target
        target.html("").append($t.nav).append($t.crumb).append($t.list.body);
        
        // callback with frame object
        if (cb) cb($t);
    };
    
    return $t;
});
