define(function(){
    var proto = "";

    if (location.protocol == "file:") proto = "http:";
    
    var regions = {
		eu: {
			name: "Europe",
			desc: "European",
			home: 1,
			flag: "eu"
		},
		us: {
			name: "North America",
			desc: "North American",
			home: 110,
			flag: "us"
		},
		jp: {
			name: "Japan",
			desc: "Japanese",
			home: 383,
			flag: "jp"
		},
		hk: {
			name: "Asia",
			desc: "Asian",
			home: 286,
			flag: "hk"
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

    // basic application settings go here (can be overridden)!
    return {
        // baseURL, where all URLs are created. No trailing slash please
        baseURL: "http://alphazone4.com/store",
        
        apiBase: proto+"//dev.alphazone4.com",
        
        cdnBase: proto+"//cdn.alphazone4.com",
        
        home2Dat: h2d,
        
        regions: regions,
        
        regionLock: false, // only show specified region
        
        categoryLinks: true, // don't enable cat links
        
        maxRows: 5, // number of rows of items to show
    };
});
