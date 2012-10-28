// global module store
window.$m = {};
// global configuration object
window.$s = {};

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
    // store configuration
    window.$s = config;
    
    if (cb) window.az4db_when("init", cb);
}

window.az4db_frame = function(target, cb) {
    // build basic ItemDB frame
    window.az4db_when("init", function() {
        window.$m.frame.create(target, cb);
    });
};

// load external resources and code
require([
    "jquery.imagesloaded",
	"bootstrap.min",
    "snippets",
    "encrypt",
    "src/api",
    "src/config",
	"src/img",
    "src/nav",
    "src/lists",
    "src/stars",
    "src/popup",
    "src/items",
    "src/frame",
    "pages/cat"
	], function() {
	// save new modules in an object
	for(var ii in arguments) {
		if (arguments[ ii ] && arguments[ ii ].module) {
            window.$m[ arguments[ ii ].module ] = arguments[ ii ];
            
            // if this is the config object, store it globally too
            if (arguments[ ii ].module == "configuration") {
                // override any default configurations with user-supplied, if they exist
                //  (overriding configurations supplied to az4db_init function)
                if (window.$s) {
                    window.$s = $.extend(arguments[ ii ], window.$s);
                } else {
                    window.$s = arguments[ ii ];
                }
            }
		}
	}
	
	// initialise each module in turn (init order, NOT alphabetical)
	for(var ii in arguments) {
		if (arguments[ ii ] && arguments[ ii ].module && window.$m[ arguments[ ii ].module ] && window.$m[ arguments[ ii ].module ].init) {
			window.$m[ arguments[ ii ].module ].init();
		}
	}
    
    // trigger init functions if they exist
    if (window.az4db_ifhooks("init")) {
        // init hooks have been created, fetch database settings and then load
        window.$m.api.call("settings", null, function(data) {
            // store server supplied settings/data
            window.$s.settings = data;
            
            // now actually call init functions to load database
            window.az4db_do("init");
        });
        
    }
});
