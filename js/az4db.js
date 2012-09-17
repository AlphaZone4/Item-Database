var $m = {};
require([
	"jquery.min",
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
});
