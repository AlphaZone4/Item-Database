// handle requests to api.alphazone4.com conveniently using easyXDM
define(["config", "msg"], function(_config, msg) {
    var funcs = {};
    
    // create XDM socket
    var socket = new easyXDM.Socket({
        remote: _config.apiBase + "/XDM.html",
        onMessage: function(message) {
            // try to parse JSON
            var result;
            try {
                result = JSON.parse(message);
                
                if (result.XDMFunc && funcs[ result.XDMFunc ]) {
                    funcs[ result.XDMFunc ](result, function() {
                        funcs.splice(funcs.indexOf(funcs[ result.XDMFunc ]), 1);
                    });
                }
                
            } catch(e) {
                // show error on bad JSON response
                msg.error("Invalid Result Syntax: "+message);
            }
        }
    });
    
    // send message to the AlphaZone4 API
    //  message - required
    //  data - optional (POST data object)
    //  callback - optional
    function send(method, data, cb) {
        if (typeof data == "function") {
            cb = data;
            data = null;
        }
        
        var send_data = {method: method};
        
        // send data if we're making a POST request
        if (data !== null) send_data.data = data;
        
        var func_name = create_method();
        
        send_data.XDMFunc = func_name;
        
        funcs[ func_name ] = function(data, callback) {
            // callback to code which called this send request
            if (cb) cb(data);
            
            // internal callback to remove this function from function array
            if (callback) callback();
        };
        
        // stringify object and send message
        socket.postMessage(JSON.stringify(send_data));
    }
    
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    function create_method() {
        var func = 'XDMFunc_';
        for (var i=0; i<16; i++){
        var rnum = Math.floor(Math.random()*chars.length);
            func += chars.substring(rnum,rnum+1);
        }
        return func;
    }
    
    // just return our send function
    return send;
});