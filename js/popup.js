define(["forms"], function(forms) {
    var $t = {};
    $t.module = "popup";
    
    // a small div with the az4db class applied to it for loading all popups
    $t.body = $("<div>").addClass("az4db").appendTo("body");
    
    $t.popup = null;
    
    $t.hide = function() {
        if ($t.popup) {
            $t.popup.modal('hide');
        }
    };
    
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
        
        $t.popup = $h;
        
        return $h;
    };
    
    // create a popup with a form! cb will be triggered with submitted form data
    $t.form = function(inputs, title, cb) {
        // build new form element
        var form = forms(inputs);
        
        // store reference to pop-up within scope of submit function (so it can close it)
        var pop;
        
        var submit = function() {
            // pass data and pointer to function to hide this form
            cb(form.serializeObject());
        };
        
        pop = $t.create(form, title, $("<button class='btn btn-primary'>Submit</button>").click(submit));
    };
    
    return $t;
});