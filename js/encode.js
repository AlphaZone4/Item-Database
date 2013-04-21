// very basic HTML encode/decode module using jQuery
define(function() {
    return {
        // jQuery-ised HTML encoding/decoding
        encode: function(value) {
            // only allow <br /> tags through
            return $('<div/>').text(value).html().replace(/\&lt\;br \/\&gt\;/g, "<br />");
        },
        
        decode: function(value) {
          return $('<div/>').html(value).text();
        }
    };
});
