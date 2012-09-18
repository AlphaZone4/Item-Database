define(function() {
    // file header
    var exports = {};
	exports.module = "nav";
    
    // storage
    var navs = [];
    
    var handlePageChange = function(args) {
        for(var ii=0; ii<navs.length; ii++) {
            // TODO: update each nav bar if needed
        }
    };
    
    // returns a jQuery object of a navigation bar
    exports.new = function(config) {
        var n = $('<div class="navbar" style="z-index: 5;"><div class="navbar-inner"><div class="container"><a class="brand" href="#home"><img src="blank.gif" class="az4-images-minilogo"> PlayStation Home Database</a><ul class="nav"><li><a href="#home">Home</a></li><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Items <b class="caret"></b></a><ul class="dropdown-menu"><li><a href="#cat1"><img src="blank.gif" class="az4-images-eusml"> Europe</a></li><li><a href="#cat110"><img src="blank.gif" class="az4-images-ussml"> America</a></li><li><a href="#cat383"><img src="blank.gif" class="az4-images-jpsml"> Japan</a></li><li><a href="#cat286"><img src="blank.gif" class="az4-images-hksml"> Asia</a></li><li class="divider"></li><li><a href="#cat97"><img src="blank.gif" class="az4-images-eusml"> EU Rewards</a></li><li><a href="#cat358"><img src="blank.gif" class="az4-images-ussml"> US Rewards</a></li></ul></li><li><a href="#space">Spaces</a></li></ul><ul class="nav secondary-nav"><li><a href="#about">About</a></li></ul></div></div></div>');
        navs.push(n);
        return n;
    };
	
    // initialise navigation module (set hooks etc.)
	exports.init = function() {
        // register hook on page change (so we can update menu items)
        az4db_when("pageChange", handlePageChange);
	};
	
	return exports;
});
