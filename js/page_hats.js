define(["jquery", "frame", "api"], function($, frame, api) {
    frame.add_page(/^expo2013\/hats/, function() {
		frame.clear(); // empty current frame
		
		var h = "<h2>AlphaZone4 Hats</h2>";
        
        h += "<p>Share this page - http://psho.me/hat</p>";
        h += '<p><a href="https://twitter.com/share" class="twitter-share-button" data-url="http://psho.me/hat" data-text="[US] Free AlphaZone4 Cake Hat!" data-via="AlphaZone4" data-size="large">Tweet</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\'://platform.twitter.com/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');</script></p>';
        h += '<div id="fb-root"></div><script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=170199966382591";fjs.parentNode.insertBefore(js, fjs);}(document, "script", "facebook-jssdk"));</script>';
        h += '<div class="fb-like" data-href="http://alphazone4.com/store/expo2013/hats/" data-send="true" data-width="450" data-show-faces="false" data-font="verdana" data-action="recommend"></div>';
        
        h += "<p style='text-align:center'><img src='http://alphazone4.com/wp-content/uploads/2013/05/AZ4-cakehat-300x236.jpg' /></p>";
		
		h += "<p>To celebrate <strong>4 years of AlphaZone4</strong>, you can get your very own AlphaZone4 cake hat for PlayStation Home!</p>";
        
        h += "<p>Many thanks to <a href='http://www.atomrepublic.co.uk/' target='_blank'>Atom Republic</a> for creating these awesome cakes!</p>";
		
		h += "<h2>Europe</h2>";
        h += "Redeem Male and Female hats with code <strong>M64H-KKN2-GJR9</strong>";
        
        h += "<h2>America</h2>";
        h += "<p>Our US hat codes are <strong>one-time redeem</strong>. Each code will <strong>only work once</strong>. If other people which using your computer also need codes, they can login to AlphaZone4 to generate a new one.</p>";
        h += "<p>You will need cookies enabled to continue.</p>";
		frame.page.html(h);
        
        var loader = $("<div>Loading...</div>");
        frame.page.append(loader);
        
        // get hat message
        $(function() {
            api.call("expo2013/hatmsg", function(obj) {
                if (obj.error) {
                    loader.html(obj.error);
                } else if (obj.success) {
                    loader.html(obj.success);
                    
                    var button = $('<br /><br /><button type="button" class="btn btn-success">Get me some US cake hat codes!</button>').click(function() {
                        api.post("expo2013/hatget", {}, function(codes) {
                            if (codes.error) {
                                loader.html('<div class="alert alert-error">'+codes.error+'</div>');
                                return;
                            }
                            
                            if (codes.male && codes.female) {
                                loader.html("<div class='alert alert-info'><strong>Here are your codes!</strong> Thanks for being part of AlphaZone4! <3</div>");
                                
                                loader.append("<h3>Male Hat</h3><p>"+codes.male+"</p>");
                                loader.append("<h3>Female Hat</h3><p>"+codes.female+"</p>");
                            } else {
                                loader.html("O_O");
                                return;
                            }
                        });
                    });
                    
                    loader.append(button);
                }
            });
        });
        
        // return true to change URL
        return true;
	});
});