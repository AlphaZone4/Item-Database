define(function() {
    return {
        // on_resize minisnippet from https://github.com/louisremi/jquery-smartresize
        on_resize: function(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c},
        
        // jQuery-ised HTML encoding/decoding
        htmlEncode: function(value) {
          return $('<div/>').text(value).html();
        },
        
        htmlDecode: function(value) {
          return $('<div/>').html(value).text();
        }
    };
});