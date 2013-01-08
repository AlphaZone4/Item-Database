// very basic HTML encode/decode module using jQuery
define(function() {
    return {
        // jQuery-ised HTML encoding/decoding
        encode: function(value) {
          return $('<div/>').text(value).html();
        },
        
        decode: function(value) {
          return $('<div/>').html(value).text();
        }
    };
});
