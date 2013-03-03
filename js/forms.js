// really basic module to create a form object in jQuery
define(["encode"], function(encoder) {
    // configure form-able elements!
    var forms = {
        textarea: function(o) {
            return "<textarea name='"+o.name+"' rows=20>"+o.value+"</textarea>";
        },
        radio: function(o) {
            var h = [];
            for(var ii=0; ii<o.options.length; ii++) {
                h.push('<label class="radio"><input type="radio" name="'+o.name+'" value="'+o.options[ii].value+'" checked>'+o.options[ii].name+'</label>');
            }
            return h.join("");
        },
        text: function(o) {
            var h = "";
            
            if (o.label) h += "<label>"+o.label+"</label>";
            
            h += "<input type='text' name='"+o.name+"' value='"+o.value+"' />";
            
            return h;
        }
    };
    
    // main create form function
    function create(inputs) {
        var form = $("<form>");
        
        // add inputs
        for(var ii=0; ii<inputs.length; ii++) {
            // ensure value parameter exists and is encoded nicely
            if (!inputs[ii].value) {
                inputs[ii].value = "";
            } else {
                inputs[ii].value = encoder.encode(inputs[ii].value);
            }
            
            if (forms[ inputs[ii].type ]) {
                form.append(forms[ inputs[ii].type ](inputs[ii])).append("<br />");
            } else {
                // generic input if we don't know about it
                form.append("<input type='"+inputs[ii].type+"' name='"+inputs[ii].name+"' value='"+inputs[ii].value+"' />");
            }
        }
        
        return form;
    }
    
        
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
    
    return create;
});