// global module store
var $m = {};
// global configuration object
var $s = {};

// AZ4 plugin hooks
//  when, register function for plugin hook
var az4db_hooks = {};
var az4db_when = function(hook, func){
    // add function to hook array
    if (!az4db_hooks[ hook ]) {
        az4db_hooks[ hook ] = [];
    }
    az4db_hooks[ hook ].push(func);
};
var az4db_do = function(hook, args) {
    // if hook exists, trigger all actions with passed arguments
    if (az4db_hooks[ hook ]) {
        for(var ii=0; ii<az4db_hooks[ hook ].length; ii++) {
            az4db_hooks[ hook ][ ii ](args);
        }
    }
};
// shortcut function for az4db_when("init", function(){...});
var az4db_init = function(config, func){
    // store configuration
    $s = config;
    
    // call init hook
    az4db_when("init", func);
};

// load external resources and code
require([
    "jquery.imagesloaded",
	"bootstrap.min",
    "snippets",
    "encrypt",
    "src/config",
	"src/img",
    "src/nav",
    "src/lists",
    "src/stars"
	], function() {
	// save new modules in an object
	for(var ii in arguments) {
		if (arguments[ ii ] && arguments[ ii ].module) {
            $m[ arguments[ ii ].module ] = arguments[ ii ];
            
            // if this is the config object, store it globally too
            if (arguments[ ii ].module == "configuration") {
                // override any default configurations with user-supplied, if they exist
                //  (overriding configurations supplied to az4db_init function)
                $s = $.extend(arguments[ ii ], $s);
            }
		}
	}
	
	// initialise each module in turn (init order, NOT alphabetical)
	for(var ii in arguments) {
		if (arguments[ ii ] && arguments[ ii ].module && $m[ arguments[ ii ].module ] && $m[ arguments[ ii ].module ].init) {
			$m[ arguments[ ii ].module ].init();
		}
	}
    
    // trigger init functions
    az4db_do("init");
});
