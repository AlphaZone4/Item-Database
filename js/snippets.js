define(function() {
    return {
        // jQuery-ised HTML encoding/decoding
        htmlEncode: function(value) {
          return $('<div/>').text(value).html();
        },
        
        htmlDecode: function(value) {
          return $('<div/>').html(value).text();
        }
    };
});