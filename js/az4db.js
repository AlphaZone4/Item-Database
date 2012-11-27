// AZ4 plugin hooks
//  when, register function for plugin hook
window.az4db_hooks = {};
window.az4db_when = function(hook, func){
    if (!func) return;
    
    // add function to hook array
    if (!window.az4db_hooks[ hook ]) {
        window.az4db_hooks[ hook ] = [];
    }
    window.az4db_hooks[ hook ].push(func);
};
window.az4db_do = function(hook, args) {
    // if hook exists, trigger all actions with passed arguments
    if (window.az4db_hooks[ hook ]) {
        for(var ii=0; ii<window.az4db_hooks[ hook ].length; ii++) {
            window.az4db_hooks[ hook ][ ii ](args);
        }
    }
};
// tests if a given hook has functions attached
window.az4db_ifhooks = function(hook) {
    return window.az4db_hooks[ hook ].length;
};

// shortcut function for az4db_when("init", function(){...});
window.az4db_init = function(config, cb){
    if (cb) window.az4db_when("init", cb);
}

window.az4db_frame = function(target, cb) {
    // build basic ItemDB frame
    window.az4db_when("init", function() {
        require("src/frame").create(target, cb);
    });
};

// load external resources and code
require([
    "jquery.imagesloaded",
	"bootstrap.min",
    "src/api",
    "config",
    "src/nav",
    "src/frame",
], function() {
	
	// initialise each module in turn (init order, NOT alphabetical)
	for(var ii in arguments) {
		if (arguments[ ii ] && arguments[ ii ].init) arguments[ ii ].init();
	}
    
    // trigger init functions if they exist
    if (window.az4db_ifhooks("init")) {
        var api = require("src/api");
        var _config = require("config");
        // init hooks have been created, fetch database settings and then load
        api.call("settings", null, function(data) {
            // store server supplied settings/data
            _config.settings = data;
            
            // now actually call init functions to load database
            window.az4db_do("init");
        });
        
    }
});
