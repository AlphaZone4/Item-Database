var Builder = require('node-spritesheet').Builder;
require("fs").readdir("images", function(err, images) {
    for(var ii=0; ii<images.length; ii++) {
        images[ ii ] = "images/"+images[ ii ];
    }
    var b = new Builder({
        outputDirectory: __dirname+'/css/',
        outputImage: 'sprite.png',
        outputCss: 'sprite.css',
        selector: '.az4im',
        images: images
    });
    b.build(function(res) {
        // console.log(res);
    });
});
