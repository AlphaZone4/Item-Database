// on_resize minisnippet from https://github.com/louisremi/jquery-smartresize
function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c};