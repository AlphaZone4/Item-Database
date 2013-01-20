define([], function() {
	// module for displaying prices etc.
	
	// === Configuration ===
	// these prices over-ride any other set prices
	var special_prices = [
		"LKWD", // Lockwood Tokens
		"MDP",  // Heavy Water Modpoints
		"JNG",	// Juggernaut Games Prices
	];
	// currency symbols
	var price_currencies = {
		// special currencies
		LKWD: "LKWD Tokens",
		MDP	: "ModPoints",
		JNG : "JNG",
		// standard currencies
		GBP: "&pound;",
		EUR: "&euro;",
		USD: "&dollar;",
		YEN: "&yen;",
		HKD: "HK&dollar;",
		AUD: "A&dollar;"
	};
	
	var region_prices = {
		// no EUR, this is handled by a manual function
		us: "USD",
		jp: "YEN",
		hk: "HKD"
	};
	// to avoid copying images, some currencies map to region flags
	var currency_flags = {
		EUR: "eu",
		USD: "us",
		YEN: "jp",
		HKD: "hk"
	};
	// list of special prices to text or labels
	var price_texts = {
		"-4":	{
			text: "PSN/PS3 Game Reward",
			label: "gamereward",
		},
		"-3":	{
			text: "No Longer Available",
			label: "gone",
		},
		"-2": {
			text: "Reward Item",
		},
		"-1": {
			text: "Free",
			label: "free",
		},
		"0": {
			text: "<i>unknown</i>",
		},
	};
	
	// given a price object, return all prices formatting and with imgs
	function print_all(prices, force) {
		var todo = ["eu", "us", "jp", "hk"];
		
		var h = [];
		
		for(var ii=0; ii<todo.length; ii++) {
			var t = print(prices, todo[ii]);
			if (t) {
				h.push(t);
			}
		}
		
		if (!h.length && force) return price_texts['0'].text;
		if (!h.length) return false;
		
		return h.join("<br />");
	}
	
	// given a price object and a region, print price (with imgs)
	//  force forces the display, even if unknown
	function print(prices, region, force) {
		// check for special prices and return them instead!
		for(var ii=0; ii<special_prices.length; ii++) {
			if (prices[ special_prices[ii] ] && prices[ special_prices[ii] ] != 0) {
				return print_standard(prices, special_prices[ii]);
			}
		}
		
		if (prints[ region ]) {
			// custom price printing function
			return prints[ region ](prices, force);
		} else {
			// normal price, just print it!
			if (!region_prices[ region ]) return "";
			return print_standard(prices, region_prices[ region ], force);
		}
	}
	
	// prints flag, currency then price
	function print_standard(prices, currency, force) {
		var h = print_flag(currency);
		
		// unknown price
		if (prices[ currency ] === 0) {
			if (!force) return false;
			
			return h + price_texts['0'].text;
		}
		
		if (!price_currencies[ currency ])
			price_currencies[ currency ] = currency + " ";
		
		// don't return currency symbol for reward/free items etc.
		if (prices[ currency ] < 0) {
			return h + format_number(prices[ currency ]);
		} else {
			return h + price_currencies[ currency ] + format_number(prices[ currency ]);
		}
	}
	
	// turns number into potential text
	function format_number(price) {
		// no text alternative? ensure this number has 2 decimal places
		if (!price_texts[ price ] || !price_texts[ price ].text) return price.toFixed(2);
		
		return price_texts[ price ].text;
	}
	
	// does this price result in a list label?
	function price_label(price) {
		if (!price_texts[ price ] || !price_texts[ price ].label)
			return false;
		
		return price_texts[ price ].label;
	}
	
	// given a region, return flag image
	function print_flag(pricer) {
		// some flags get overwritten
		if (currency_flags[ pricer ]) pricer = currency_flags[ pricer ];
		
		return '<i class="az4im flag_'+pricer+'"></i> ';
	}
	
	// region specific printing
	var prints = {
		eu: function(prices, force) {
			if (prices.GBP === 0) {
				if (!force) return false;
				
				return price_texts['0'].text;
			}
			
			// non-shop item, use EUR flag
			if (prices.GBP < 0) {
				prices.EUR = prices.GBP; // ensure EUR price is same as GBP
				return print_standard(prices, "EUR");
			}
			
			// standard GBP pricing
			var h = print_standard(prices, "GBP");
			
			// add EUR pricing
			if (prices.EUR > 0) {
				h += " / " + print_standard(prices, "EUR");
			}
			
			// add AUD pricing
			if (prices.AUD > 0) {
				h += " / " + print_standard(prices, "AUD");
			}
			
			return h;
		},
	};
	
	// === Exports ===
	return {
		print: 		print,
		print_all: 	print_all,
	};
});
