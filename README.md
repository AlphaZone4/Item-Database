AlphaZone4 Item Database Client
=========

![https://build.alphazone4.com/projects/2/status?ref=master](https://build.alphazone4.com/projects/2/status?ref=master)

The core implementation of the AlphaZone4 Item Database Client.

Server-side technologies remain closed-source.

Building
-

Ensure you have Node.JS installed before building.

```bash
git clone git@github.com:AlphaZone4/Item-Database.git
cd Item-Database
make
```

The test.html file will now show a basic test environment for the Item Database client.

Packaging
-

You can also package the code into a simple compressed JS file with no extra real effort.

```bash
make package
```

The minified compiled JS file, CSS etc. will all be in `build/`

You can test out the built version using the index.html file in the `build/` folder after packaging.

Development
-

### Action Hooks

The API offers access to two global functions, `az4db_when` and `az4db_do`.

Any module can access these functions for event hooks. Use `az4db_when` to register and `az4db_do` to perform.

(non-functional, purely demonstrative) Example:

```javascript
define(function(){
    var exports = {
        module: "example"
    };
    az4db_when("loudnoise_loaded", function(){
        $m.loudnoise.play();
    });
    
    return exports;
});

define(function(){
    var exports = {
        module: "loudnoise"
    };
    
    exports.init = function(){
        az4db_do("loudnoise_loaded");
    };
    
    exports.play = function(){
        alert("ARRRRRRRRRRRGH");
    }
    
    return exports;
});
```
