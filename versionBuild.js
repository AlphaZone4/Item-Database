// load package file
var package = require('./package.json');

// make version class object
var obj = {
	version: package.version,
	time: new Date().toUTCString()
};

// push object to string
var a = "define(function(){return "+JSON.stringify(obj)+"});";

// write class to file
require("fs").writeFile("js/version.js", a, function(err) {
    if(err) {
        console.log("ERROR writing version.js file: "+err);
    }
});
