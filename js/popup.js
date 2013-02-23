define(function(){
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
        // create basic form item
        var form = $("<form>");
        
        // add inputs
        for(var ii=0; ii<inputs.length; ii++) {
            if (forms[ inputs[ii].type ]) {
                form.append(forms[ inputs[ii].type ](inputs[ii])).append("<br />");
            } else {
                // generic input if we don't know about it
                form.append("<input type='"+inputs[ii].type+"' name='"+inputs[ii].name+"' value='"+inputs[ii].value?inputs[ii]:''+"' />");
            }
        }
        
        // store reference to pop-up within scope of submit function (so it can close it)
        var pop;
        
        var submit = function() {
            // pass data and pointer to function to hide this form
            cb(form.serializeObject());
        };
        
        pop = $t.create(form, title, $("<button class='btn btn-primary'>Submit</button>").click(submit));
    };
    
    // configure form-able elements!
    var forms = {
        textarea: function(o) {
            return "<textarea name='"+o.name+"' rows=20></textarea>";
        },
        radio: function(o) {
            var h = [];
            for(var ii=0; ii<o.options.length; ii++) {
                h.push('<label class="radio"><input type="radio" name="'+o.name+'" value="'+o.options[ii].value+'" checked>'+o.options[ii].name+'</label>');
            }
            return h.join("");
        }
    };
    
    // extend jQuery to return a serialized object of a form
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    
    return $t;
});