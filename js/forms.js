// really basic module to create a form object in jQuery
define(["encode"], function(encoder) {
    // configure form-able elements!
    var forms = {
        textarea: function(o) {
            return "<textarea name='"+o.name+"' rows=20>"+o.value+"</textarea>";
        },
        radio: function(o) {
            var h = $("<div>")
            
            var buttons = $("<div class='btn-group' data-toggle='buttons-radio'>");
            
            // add hidden input element to store result of buttons
            var hidden = $("<input type='hidden' name='"+o.name+"' value='"+o.value+"' />");
            
            for(var ii=0; ii<o.options.length; ii++) {
                var butt = $('<button type="button" class="btn btn-primary'+((o.value==o.options[ii].value)?" active":"")+'" name="'+o.options[ii].value+'">'+o.options[ii].name+'</button>');
                
                // change value of hidden input when clicked
                butt.click(function(){
                    hidden.val($(this).attr("name"));
                });
                
                buttons.append(butt);
            }
            
            // enable radio buttons
            buttons.button();
            
            h.append(buttons).append(hidden);
            
            return h;
        },
        text: function(o) {
            var h = "";
            
            if (o.label) h += "<label>"+o.label+"</label>";
            
            h += "<input type='text' name='"+o.name+"' value='"+o.value+"' "+(o.width?"style='width:"+o.width+"px' ":"")+"/>";
            
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