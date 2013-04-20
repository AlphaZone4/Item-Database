define(["cookies"], function(cookies){
    var ret = {};
    
    var proto = location.protocol;
    
    if (location.protocol == "file:") proto = "http:";
    
    var regions = {
		eu: {
			name: "Europe",
			desc: "European",
			home: 1,
			flag: "eu",
			pricer: "GBP"
		},
		us: {
			name: "North America",
			desc: "North American",
			home: 110,
			flag: "us",
			pricer: "USD"
		},
		jp: {
			name: "Japan",
			desc: "Japanese",
			home: 383,
			flag: "jp",
			pricer: "YEN"
		},
		hk: {
			name: "Asia",
			desc: "Asian",
			home: 286,
			flag: "hk",
			pricer: "HKD"
		}
	};
	
	// home2dat gen
	var h2d = {};
	for(var ii in regions) {
		h2d[ regions[ ii ].home ] = {
			region: regions[ ii ].name,
			flag: "flag_"+regions[ ii ].flag
		};
	}
    
    // look for saved settings
    var maxRows = cookies.get("az4config_maxRows") || 5;
    var itemTitle = cookies.get("az4config_itemTitle") || "name";

    // basic application settings go here (can be overridden)!
    // baseURL, where all URLs are created. No trailing slash please
    ret.baseURL = "http://alphazone4.com/store";
    
    ret.apiBase = proto+"//dev.alphazone4.com";
    
    ret.cdnBase = proto+"//cdn.alphazone4.com";
    
    ret.home2Dat = h2d;
    
    ret.regions = regions;
    
    ret.regionLock = false; // only show specified region
    
    ret.categoryLinks = true; // don't enable cat links
    
    ret.maxRows = maxRows; // number of rows of items to show
    
    ret.itemTitle = itemTitle; // what to display on tile list
    
    ret.linkType = "none";
    
    return ret;
});
