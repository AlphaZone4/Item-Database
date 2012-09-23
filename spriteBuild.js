var Builder = require('node-spritesheet').Builder;
var res = [];
require("fs").readdir("images", function(err, images) {
    for(var ii=0; ii<images.length; ii++) {
        images[ ii ] = "images/"+images[ ii ];
    }
    var b = new Builder( images, res, {
        outputImage: __dirname+'/css/sprite.png',
        outputCss: __dirname+'/css/sprite.css',
        selector: '.az4im'
    });
    b.build();
});