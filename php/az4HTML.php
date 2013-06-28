<?php
$az4HTML_css_done = false;
$az4HTML_memcache = false;

function az4HTML_cache() {
    global $az4HTML_memcache;
    
    if (class_exists("Memcached")){
        $az4HTML_memcache = new Memcached;
        if (!$az4HTML_memcache->addServer('localhost', 11211)) $az4HTML_memcache = false;
    }else{
        $az4HTML_memcache = false;
    }
    return $az4HTML_memcache;
}

function az4HTML_getCache($key) {
    $c = az4HTML_cache();
    if ($c!=false) {
        $dat = $c->get($key);
        if (($dat)||($dat!="")) return json_decode($dat);
    }
    return false;
}

function az4HTML_getSettings() {
    global $az4HTML_config;
    
    if (isset($az4HTML_config)) return $az4HTML_config;
    
    $az4HTML_config = az4HTML_getCache("db_settings");
    
    if ($az4HTML_getCache != false) return $az4HTML_getCache;
    
    $az4HTML_config = az4HTML_loadJSON("http://api.alphazone4.com/settings");
    
    $c = az4HTML_cache();
    if ($c) $c->set("db_settings", json_encode($az4HTML_config), 1800);
    
    return $az4HTML_config;
}

function az4HTML_devname($dev) {
    $settings = az4HTML_getSettings();
    
    //return "";
    
    if (!isset($settings->devs->{$dev})) return $dev;
    
    return $settings->devs->{$dev};
}

function az4HTML_cat($cat) {
	$data = az4HTML_loadJSON("http://api.alphazone4.com/get/cat/".$cat);

	$h = az4HTML_css();

	// TODO - az4Markup in PHP
	if ($data->page) $h .= $data->page;

	// breadcrumb
	if (sizeof($data->breadcrumb) > 0) {
		$cs = array();
		foreach($data->breadcrumb as $crumb) {
			$cs[] = "<a href='http://alphazone4.com/store/cat/".$crumb->id."'>".$crumb->name."</a>";
		}
		$h .= implode(" >>> ", $cs);
	}

	if ($data->cats && sizeof($data->cats) > 0) {
		// list cats
		$h .= "<ul class='thumbnails az4list'>";

		foreach($data->cats as $cat) {
			$h .= "<li>
			<a href='http://alphazone4.com/store/cat/".$cat->id."' class='thumbnail'>
                <div class='imgsml' style='width: 128px; height: 128px;'>
				    <img width='128' height='128' src='http://cdn.alphazone4.com/c/".$cat->image."' alt='".az4HTML_strip($cat->name)."' />
                </div>
				<p>".$cat->name."</p>
			</a>
			</li>";
		}

		$h .= "</ul>";
	} else {
		// list items
		$h .= az4HTML_ListItems($data->items);
	}

	return $h;
}

function az4HTML_home() {
    $h = "";
    
    $config = az4HTML_getSettings();
    
    $h .= az4HTML_updatelist("EU", "European", $config->euupdates);
    $h .= az4HTML_updatelist("US", "American", $config->usupdates);
    $h .= az4HTML_updatelist("JP", "Japanese", $config->jpupdates);
    $h .= az4HTML_updatelist("HK", "Asian", $config->hkupdates);
    
    $h .= "
    <p>
        <a href='http://alphazone4.com/store/cat/1'>European PlayStation Home Item Database</a><br />
        <a href='http://alphazone4.com/store/cat/97'>European PlayStation Home Rewards and Free Items</a>
    </p>
    <p>
        <a href='http://alphazone4.com/store/cat/110'>American PlayStation Home Item Database</a><br />
        <a href='http://alphazone4.com/store/cat/358'>American PlayStation Home Rewards and Free Items</a>
    </p>
    <p>
        <a href='http://alphazone4.com/store/cat/383'>Japanese PlayStation Home Item Database</a>
    </p>
    <p>
        <a href='http://alphazone4.com/store/cat/286'>Asian PlayStation Home Item Database</a>
    </p>
    ";
    
    return $h;
}

function az4HTML_updatelist($code, $name, $updates) {
    $h = "Latest ".$name." (".$code.") PlayStation Home Updates";
    
    $h .= "<ul>";
    foreach($updates as $u) {
        $h .= "<li><a href='http://alphazone4.com/store/update/".$u->id."'>European PlayStation Home Update ".$u->name."</a></li>";
    }
    $h .= "</ul>";
    
    return $h;
}

function az4HTML_update($update) {
    $data = az4HTML_loadJSON("http://api.alphazone4.com/get/update/".$update);
    
    $h = "";
    
    // breadcrumb
    if (sizeof($data->breadcrumb) > 0) {
		$cs = array();
		foreach($data->breadcrumb as $crumb) {
			$cs[] = "<a href='http://alphazone4.com/store/cat/".$crumb->id."'>".$crumb->name."</a>";
		}
		$h .= implode(" >>> ", $cs);
	}
    
    $h .= az4HTML_ListItems($data->items);
    
    return $h;
}

function az4HTML_ListItems($items) {
	if (sizeof($items) == 0) return "";

	$h = "";

	foreach($items as $i) {
		$cats = "";
		if (sizeof($i->categories) > 0) {
			foreach($i->categories as $cat) {
				$cats .= "[[" . $cat->zone . "]] - <a href='http://alphazone4.com/store/cat/".$cat->id."'>".$cat->name."</a><br />";
			}
		}

		$updates = "";
		if (sizeof($i->updates) > 0) {
			foreach($i->updates as $region => $update) {
				$updates .= "[[" . $region . "]] - <a href='http://alphazone4.com/store/update/".$update->id."'>".$update->name."</a><br />";
			}
		}

		$h .= "<div style='clear:both'>
        <ul class='thumbnails az4list' style='float: left'><li><a class='thumbnail'>
            <div class='imgsml' style='width: 128px; height: 128px;'>
    			<img width='128' height='128' alt='PlayStation Home Item: ".az4HTML_strip($i->name)."' src='http://cdn.alphazone4.com/i/".$i->image."' />
            </div>
		    <p>".$i->name."</p>
            <p>Rating: ".$i->rating." out of 5 (".$i->votes." votes)</p>
         </a></li></ul>
         <strong>".$i->name.(($i->gender!="")?" (".(($i->gender == "M")?"M":"Fem")."ale)":"")."</strong>
		 <p>".$i->description."</p>
		 ".(($i->tutorial != "") ? "<p>Guide/Tutorial/Walkthrough: ".$i->tutorial."</p>" : "").
		 (($i->dev!="")? "<p>Developed by ".az4HTML_devname($i->dev)."</p>" :"")."
		 <p><strong>Available in</strong>:<br />".$cats."</p>
		 <p><strong>Released on</strong>:<br />".$updates."</p>
		</div>";
	}

	return $h;
}

function az4HTML_strip($in) {
	return str_replace("'", "\'", $in);
}

function az4HTML_css() {
	global $az4HTML_css_done;

	if ($az4HTML_css_done) return "";

	$az4HTML_css_done = true;

	return "<style type='text/css'>.az4HTML_list {list-style: none;} .az4HTML_list li {float: left}</style>";
}

function az4HTML_loadJSON($url) {
	return json_decode(file_get_contents($url));
}

?>