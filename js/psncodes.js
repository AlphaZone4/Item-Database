define(["frame", "api", "config"], function(frame, api, config) {
	var codes;
	
	// code region listings
	frame.add_page(/^codes$/, function() {
		frame.clear(); // empty current frame
		
		get_codes(function(codes) {
			var h = '<h2>How to redeem SEN codes</h2>';
            h += "<a href='http://uk.playstation.com/redeemvouchercode/' target='_blank'>Please follow the guide on the official PlayStation Support Website (click here)</a>";
			
			for(var ii in codes) {
				// any codes here?
				if (!codes[ii].length) continue;
				
				// does this region exist?
				if (!config.regions[ ii ]) continue;
				
				h += '<h2>Active '+config.regions[ ii ].desc+' Redeem Codes</h2>';
				
				h += '<table class="table table-striped table-condensed">';
				h += '<tr><th>Name</th><th>Code</th><th>Last Checked</th></tr>';
				
				// list redeem codes
				for(var jj=0; jj<codes[ii].length; jj++) {
					var j = codes[ii][jj];
					h += '<tr>'+
						'<td>'+j.name+'</td>'+
						'<td>'+j.code+'</td>'+
						'<td>'+j.updated+'</td>'+
					'</tr>';
				}
				
				h += '</table>';
			}
			
			frame.page.html(h);
		});
        
        return true;
	});
	
	function get_codes(cb) {
		// if we haven't fetched the codes yet, fetch them now
		if (!codes) {
			api.call("get/codes", {}, function(data) {
				codes = data;
				
				return cb(codes);
			});
		} else {
			return cb(codes);
		}
	}
});
