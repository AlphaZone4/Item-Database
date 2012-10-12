define(function(){
    var $t = {};
    $t.module = "popup";
    
    // a small div with the az4db class applied to it for loading all popups
    $t.body = $("<div>").addClass("az4db").appendTo("body");
    
    $t.create = function(content, header, footer) {
        // basic modal framework
        var $h = $("<div>").addClass("modal");
        
        // add modal header
        if (header) {
            $h.append(
                $("<div>").addClass("modal-header").append('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>').append("<h3>"+header+"</h3>")
            );
        }
        
        // add content
        $h.append(
            $("<div>").addClass("modal-body").html(content)
        );
        
        // add footer
        if (footer) {
            $h.append(
                $("<div>").addClass("modal-footer").html(footer)
            );
        }
        
        // make sure we remove this element when it's closed
        $h.on("hidden", function() {
            $h.remove();
        });
        
        // launch!
        $h.appendTo($t.body).modal();
        
        // euch! the backdrop appends to the body, let's move it to our special controlled area
        $(".modal-backdrop").detach().prependTo($t.body);
        
        return false;
    };
    
    return $t;
});