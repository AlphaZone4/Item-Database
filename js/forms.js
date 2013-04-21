// really basic module to create a form object in jQuery
define(["encode"], function(encoder) {
    // configure form-able elements!
    var forms = {
        textarea: function(o) {
            var h = $("<textarea name='"+o.name+"' rows=20>"+o.value+"</textarea>");
            
            if (o.width) h.css("width", o.width);
            
            return h;
        },
        radio: function(o) {
            var h = $("<div>").css("margin-bottom", "5px");
            
            // optional limit of buttons per row
            if (!o.row_limit) o.row_limit = 1000;
            
            if (o.label) h.append("<label>"+o.label+"</label>");
            
            var buttons = $("<div class='btn-group' data-toggle='buttons-radio'>");
            
            // add hidden input element to store result of buttons
            var hidden = $("<input type='hidden' name='"+o.name+"' value='"+o.value+"' />");
            
            for(var ii=0; ii<o.options.length; ii++) {
                var butt = $('<button type="button" class="btn btn-primary'+((o.value==o.options[ii].value)?" active btn-warning":"")+'" name="'+o.options[ii].value+'">'+o.options[ii].name+'</button>');
                
                // change value of hidden input when clicked
                butt.click(function(){
                    h.find("button").removeClass("active btn-warning");
                    
                    $(this).addClass("active btn-warning");
                    
                    hidden.val($(this).attr("name"));
                });
                
                if (ii % o.row_limit === 0) {
                    if (buttons) {
                        h.append(buttons);
                    }
                    buttons = $("<div class='btn-group' data-toggle='buttons-radio'>");
                }
                
                buttons.append(butt);
            }
            
            // make sure last list of buttons were appended
            if (ii % o.row_limit !== 0) h.append(buttons);
            
            // enable radio buttons
            buttons.button();
            
            h.append(hidden);
            
            return h;
        },
        checkbox: function(o) {
            var h = $("<div>").css("margin-bottom", "5px");
            for(var ii=0; ii<o.options.length; ii++) {
                h.append("<input type='checkbox' class='btn btn-primary' name='"+o.name+"' value='"+o.options[ii].value+"'> "+o.options[ii].name);
            }
            
            return h;
        },
        text: function(o) {
            var h = $("<div>");
            
            if (o.label) {
                var l = $("<label>"+o.label+"</label>");
                
                if (o.labelcss) l.css(o.labelcss);
                
                h.append(l);
            }
            
            var i = $("<input type='text' name='"+o.name+"' value='"+encoder.encode(o.value)+"' />");
            
            if (o.disable) i.attr("disabled", true);
            
            if (o.inputcss) i.css(o.inputcss);
            
            h.append(i);
            
            return h;
        },
        dropdown: function(o) {
            var h = "";
            
            if (o.label) h += "<label style='float:left'>"+o.label+"</label>";
            
            h += "<select name='"+o.name+"'>";
            
            for(var ii=0; ii<o.options.length; ii++) {
                h += "<option value='"+o.options[ii].value+"'"+((o.value==o.options[ii].value)?" selected":"")+">"+o.options[ii].name+"</option>";
            }
            
            h += "</select>";
            
            return $(h);
        },
        clear: function() {
            return $("<div style='clear:both'></div>");
        },
        info: function(o) {
            return $("<div>").html(o.text);
        },
        submit: function(o) {
            return $("<input type='submit' class='btn btn-success' />").attr("value", o.value);
        }
    };
    
    // main create form function
    function create(inputs, cb) {
        var form = $("<form>");
        
        var called = false;
        
        if (cb) form.submit(function() {
            // make sure the form is never sent twice (cross-browser chaos)
            if (!called) {
                called = true;
                // callback with form data
                cb(form.serializeObject(), function() {
                    called = false;
                });
            }
            
            return false;
        });
        
        // add inputs
        for(var ii=0; ii<inputs.length; ii++) {
            // ensure value parameter exists and is encoded nicely
            if (!inputs[ii].value) {
                inputs[ii].value = "";
            } else {
                inputs[ii].value = encoder.encode(inputs[ii].value);
            }
            
            var gen;
            if (forms[ inputs[ii].type ]) {
                gen = forms[ inputs[ii].type ](inputs[ii]);
            } else {
                // generic input if we don't know about it
                gen = $("<input type='"+inputs[ii].type+"' name='"+inputs[ii].name+"' value='"+inputs[ii].value+"' />");
            }
            
            if (inputs[ii].css) gen.css(inputs[ii].css);
            
            if (inputs[ii].cssclass) gen.addClass(inputs[ii].cssclass);
            
            // optional on change callback
            if (inputs[ ii ].change) {
                gen.change(inputs[ii].change);
            }
            
            // assign enter keypress to each form element to make sure it gets sent
            if (cb && inputs[ii].type != "textarea") {
                gen.keypress(function(e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        form.submit();
                    }
                });
            }

            
            form.append(gen);
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