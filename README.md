AlphaZone4 Item Database Client
=========

The core implementation of the AlphaZone4 Item Database Client.

Server-side technologies remain closed-source.

Building
-

Ensure you have Node.JS installed before building.

```
    git clone git@github.com:AlphaZone4/Item-Database.git
    cd Item-Database
    make
```

Packaging
-

You can also package the code into a simple compressed JS file with no extra real effort.

```
make package
```

The minified compiled JS file, CSS etc. will all be in `az4db/`

Development
-

### Modules

New features should be implemented as a new module where it's sane to do so. This helps to abstract and separate code without it becoming a mess.

New modules created should be added to the `js/src` folder and a reference added to `js/az4db.js`. This will allow the test.html file to load the module correctly and the compiler will also automatically detect the reference in `js/az4db.js` and add it to the minified packaged script.

All modules intending to be utilized by other areas of the code (core modules) should export a variable called `modules` that gives the module a name.

For example, if I make a module called `foo`:

```
    define(function(){
        var exports = {
            module: "foo",
            publicFunction: function(){
                return "bar";
            }
        };
        
        return exports;
    });
```

This will now be available to all other modules like so:
```
    $m.foo.bar();
```

Not including the `module` will make the entire module private, which in some cases is ideal.

### Module Initialisation

After loading all modules, the client will go through each one and try to find a function called `init` to call.

You can assume that all other modules have been loaded, but cannot rely on their `init` functions being called yet.

### Action Hooks

The API offers access to two global functions, `az4db_when` and `az4db_do`.

Any module can access these functions for event hooks. Use `az4db_when` to register and `az4db_when` to perform.

(non-functional, purely demonstrative) Example:

```
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
        
        return exports;
    });
```
