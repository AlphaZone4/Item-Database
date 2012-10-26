// This class defines the basic AZ4 "frame" for building an essential Item DB
define(function(){
    var $t = {};
    $t.module = "frame";
    
    $t.create = function(target, cb) {
        // hook for naviagation plugin
        var nav_hook = function(href) {
            // TODO - general href parser
        };
        
        // create frame object
        var frame = {
            nav: $m.nav.create(nav_hook),
            list: $m.lists.create(null, null),
            crumb: $("<ul>").addClass("breadcrumb")
        };
        
        // setup event hooks
        frame.list.hookWhen("loadCat_complete", function(data) {
            // when category has been loaded, we should update the breadcrumb
            frame.crumb.html("");
            if (data.breadcrumb) {
                // setup breadcrumb
                if (data.breadcrumb.length>1) {
                    for(var ii=0; ii<data.breadcrumb.length; ii++) {
                        frame.crumb.append("<li>"+
                            ((ii == 0)?"<i class='az4im "+$s.home2Dat[ data.breadcrumb[ii].id ].flag+"'></i> ":"")+
                            ((ii<(data.breadcrumb.length-1))?
                            "<a class='crumb_click' href='"+$s.baseURL+"cat/"+data.breadcrumb[ii].id+"'>"+
                                data.breadcrumb[ii].name+
                            "</a><span class='divider'>/</span>":data.breadcrumb[ii].name)+
                        "</li>");
                    }
                } else {
                    frame.crumb.append("<li><i class='az4im "+$s.home2Dat[ data.breadcrumb[0].id ].flag+"'></i> "+data.breadcrumb[0].name+"</li>");
                }
                
                // assign breadcrumb click handles
                $(".crumb_click").click(function() {
                    var cat = $(this).attr("href").match(/\d+$/);
                    if (cat) {
                        frame.list.loadCat(cat[0]);
                    }
                    return false;
                });
            } else {
                // no breadcrumb, hide!
                frame.crumb.hide();
            }
        });
        
        // append to target
        target.html("").append(frame.nav).append(frame.crumb).append(frame.list.body);
        
        // callback with frame object
        if (cb) cb(frame);
    }
    
    return $t;
});