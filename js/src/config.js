define(function(){
    // basic application settings go here (can be overridden)!
    return {
        // baseURL, where all URLs are created. No trailing slash please
        baseURL: "http://alphazone4.com/store",
        
        apiBase: "//dev.alphazone4.com",
        
        cdnBase: "//cdnbeta.alphazone4.com",
        
        home2Dat: {
            1: {
                "region": "Europe",
                "flag"  : "flag_eu"
            },
            110: {
                "region": "North America",
                "flag"  : "flag_us"
            },
            383: {
                "region": "Japan",
                "flag"  : "flag_jp"
            },
            286: {
                "region": "Asia",
                "flag"  : "flag_hk"
            }
        },
        
        // module header
        module: "configuration"
    };
});