// global module store
var $m = {};

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

// load external resources and code
require([
    "jquery.imagesloaded",
	"bootstrap.min",
	"src/img"
	], function() {
	// save new modules in an object
	for(var ii in arguments) {
		if (arguments[ ii ]) $m[ arguments[ ii ].module ] = arguments[ ii ];
	}
	
	// initialise each module in turn (init order, NOT alphabetical)
	for(var ii in arguments) {
		if (arguments[ ii ] && arguments[ ii ].module && $m[ arguments[ ii ].module ] && $m[ arguments[ ii ].module ].init) {
			$m[ arguments[ ii ].module ].init();
		}
	}
    console.log(az4db_hooks);
});
