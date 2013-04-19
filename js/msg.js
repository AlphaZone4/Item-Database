define(function() {
    // module to show error/success messages to users
    
    var body = $("<div>").addClass("messages");
    
    var show_message = function(header, message, type) {
        console.log("[msg] "+type+": "+message);
        
        var msg = $("<div>").addClass("alert alert-"+type).
        html("<strong>"+header+"</strong>").append(
            $("<p>").text(message)
        );
        
        // hide on click
        msg.click(function(e) {
            e.stopPropagation();
            msg.remove();
        });
        
        // append to page
        body.prepend(msg);
        
        // remove after 6 seconds
        msg.fadeIn(500).delay(5000).fadeOut(500, function() {
            msg.remove();
        });
    };
    
    var success = function(msg) {
        show_message("Success!", msg, "success");
    };
    
    var error = function(msg) {
        show_message("Error", msg, "error");
    };
    
    return {
        success: success,
        error: error,
        body: body
    }
});