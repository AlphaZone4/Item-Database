define(function(){
    // file header
    var exports = {};
	exports.module = "nav";
    
    var handlePageChange = function(args){
        console.log(args);
    };
	
	exports.init = function(){
        console.log(":D");
        // register hook on page change (so we can update menu items)
        az4db_when("pageChange", handlePageChange);
	};
	
	return exports;
});
