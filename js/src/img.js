define(function(){
	var $t = {};
    $t.module = "img";
    
    var queue = [];
    
    var process = function(img) {
        // create basic image 
        var $i = $("<img>").attr("width", img.width).attr("height", img.height).attr("src", img.url);
        
        var md5 = hex_md5(img.url);
        
        // use jQuery imagesloaded plugin for stupid IE
        $i.imagesLoaded(function() {
            $(".iload_"+md5).html($i).removeClass("iload iload_"+md5);
            $i.unbind("load");
        });
    };
    
    $t.go = function() {
        if (!queue) return;
        
        for(var ii=0; ii<queue.length; ii++) {
            // create image and set off imageloader
            process(queue[ii]);
        }
        
        queue = [];
    };
    
    $t.create = function(url, width, height) {
        // make sure we aren't already fetching this image!
        for(var ii=0; ii<queue.length; ii++) {
            if (queue[ ii ].url == url) queue[ ii ].body;
        }
        
        // standard width/height
        if (!width) {
            width = 128;
            height = 128;
        }
        
        // create image holder
        var md5 = hex_md5(url);
        var $ih = $("<div>").addClass("iload").addClass("iload_"+md5).css("width", width+"px").css("height", height+"px");
        if (width == 128) $ih.addClass("imgsml");
        
        // push to queue
        queue.push({
            url: url,
            width: width,
            height: height,
            body: $ih
        });
        
        return $ih;
    };
	
	return $t;
});
