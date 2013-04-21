define(["frame"], function(frame) {
	frame.add_page(/^about/, function() {
		frame.clear(); // empty current frame
		
		var h = "<h2>AlphaZone4 Item Database</h2>";
		
		h += "<p>The AlphaZone4 Item Database is a collection of the items available in PlayStation Home. It is created entirely by fans of Home in order to improve the knowledge of Home items</p>";
		
		// list the techs
		var techs = [
			"jQuery",
			"Node.JS",
			"Redis",
			"MySQL",
			"PHP",
			"Bootstrap",
			"Require.JS",
            "easyXDM"
		];
		
		h += "<strong>Developed Using:</strong><ul>";
		for(var ii=0; ii<techs.length; ii++) {
			h += "<li>"+techs[ii]+"</li>";
		}
		h += "</ul>";
        
        h += "<p>Developed by Jamie Holding (AKA Cubehouse) of AlphaZone4. <a href='https://twitter.com/cube' target='_blank'>@cube</a></p>";
        
        h += "<p>Source code available on GitHub at <a target='_blank' href='https://github.com/AlphaZone4/Item-Database'>https://github.com/AlphaZone4/Item-Database</a></p>";
		
		frame.page.html(h);
        
        // return true to change URL
        return true;
	});
});
