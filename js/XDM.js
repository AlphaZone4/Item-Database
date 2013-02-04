// handle requests to api.alphazone4.com conveniently using easyXDM
define(["config"], function(_config) {
    // send message to the AlphaZone4 API
    //  message - required
    //  data - optional (POST data object)
    //  callback - optional
    function send(method, data, cb) {
        if (typeof data == "function") {
            cb = data;
            data = null;
        }
        
        // create socket to receive replies
        var socket = new easyXDM.Socket({
            remote: _config.apiBase + "/XDM.html",
            onMessage: function(message, origin){
                // try to parse JSON
                var result;
                try {
                    result = JSON.parse(message);
                } catch(e) {
                    // fall back on original message
                    result = message;
                }
                
                if (cb) cb(result);
            },
            onReady: function() {
                var send = {method: method};
                
                // send data if we're making a POST request
                if (data !== null) send.data = data;
                
                // stringify object and send message
                socket.postMessage(JSON.stringify(send));
            }
        });
    }
    
    // just return our send function
    return send;
});