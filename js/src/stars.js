define(function(){
    var $t = {};
    $t.module = "stars";
    
    // create new stars object! vote_id compulsory for interactive voting
    $t.create = function(vote_id, rating, votes){
        var ratingCSS = "";
        var actual = 0;
        if ( votes && votes > 0 ){
        	actual = rating;
    		rating = Math.round(Number(rating)*2)/2;
    		if (rating>5) rating = 5;
    		if (rating<0) rating = 0;
    		ratingCSS = rating*10;
    	}else{
    		actual = "?";
    		ratingCSS = "0";
    		rating = "?";
            votes = 0;
    	}
        
    	// create the dom object
    	var v = $("<ul>");
    	v.attr("title", "Rated "+actual+" / 5 ("+Number(votes)+" votes)");
    	v.addClass("az4_stars az4im az4im.stars az4_stars_"+ratingCSS);
    	if ( vote_id ) {
    		v.attr("name", vote_id);
    		var h = "";
    		for(var i=0; i<5; i++){
    			v.append(
                    $("<li name='"+(i+1)+"'>").hover(hoverin, hoverout).click(vote)
                );
    		}
    	}
        return v;
    };
    
    var vote = function(e){
        // stop click moving to item tile
    	e.stopPropagation();
    	// change CSS
    	$(this).parent().attr("class", "az4_stars az4im az4im.stars az4_stars_active_"+($(this).attr("name")*10));
    	// unregister hovers and clicks
    	$(this).parent().find("li").unbind("mouseenter mouseleave click");
    	// register the vote TODO
    	//fetch("vote", {id: Number($(this).parent().attr("name")), vote:Number($(this).attr("name"))}, function(d){console.log(d);});
    	// return false to stop returning to the main screen
    	return false;
    };
    
    // hover effect functions
    var hoverin = function(){
        var t = $(this);
    	t.parent().addClass("az4_stars_hover_"+(Number(t.attr("name")))*10);
    };
    
    var hoverout = function(){
    	var t = $(this);
    	t.parent().removeClass("az4_stars_hover_"+(Number(t.attr("name")))*10);
    };
    
    return $t;
});
