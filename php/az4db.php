<?php
/**
 * @package PlayStation Home Item Database
 * @author James Holding
 * @version 1.0
 **/
/*
Plugin Name: PlayStation Home Item Database
Plugin URI: http://alphazone4.com
Description: The PlayStation Home Item Database
Author: James Holding (cubehouse)
Version: 1.0
Author URI: http://alphazone4.com
*/

$az4dbwp_page = "database";

// validate if this is a database URL
function az4db_isurl() {
    global $wp, $az4dbwp_detect, $az4dbwp_page;
	
	if (!$az4dbwp_detect && (
		strtolower($wp->request) == $az4dbwp_page
			||
		substr(strtolower($wp->request), 0, strlen($az4dbwp_page)+1) == $az4dbwp_page."/"
			||
		$wp->query_vars['page_id'] == $az4dbwp_page
	)) {
		// stop any dodgy content
		if (preg_match('/[^A-Za-z0-9\/\-_]/', az4db_strippage())) return false;
		
		return true;
	}
	
	return false;
}

// returns just the page part of the URL
function az4db_strippage() {
	global $wp, $az4dbwp_detect, $az4dbwp_page;

	return substr($wp->request, strlen($az4dbwp_page)+1);
}

// create fake page called "database"
add_filter('the_posts','az4dbwp_detect');
function az4dbwp_detect($posts){
	global $wp;
	global $wp_query;
	global $az4dbwp_detect;
	global $az4dbwp_page;
	
	if (az4db_isurl()) {
		// stop interferring with other $posts arrays on this page
		$az4dbwp_detect = true;
		
		// make sure we actually have this page first
		$content = az4dbwp_render();
		if ($content) {
			// create a fake virtual page
			$post = new stdClass;
			$post->post_author = 1;
			$post->post_name = $az4dbwp_page;
			$post->guid = get_bloginfo('wpurl') . '/' . $az4dbwp_page;
			$post->post_title = "PlayStation Home Item Database";
			$post->post_content = $content;
			$post->ID = -999;
			$post->post_type = 'page';
			$post->post_status = 'static';
			$post->comment_status = 'closed';
			$post->ping_status = 'open';
			$post->comment_count = 0;
			$post->post_date = current_time('mysql');
			$post->post_date_gmt = current_time('mysql', 1);
			$posts=NULL;
			$posts[]=$post;
			
			// make wpQuery believe this is a real page too
			$wp_query->is_page = true;
			$wp_query->is_singular = true;
			$wp_query->is_home = false;
			$wp_query->is_archive = false;
			$wp_query->is_category = false;
			unset($wp_query->query["error"]);
			$wp_query->query_vars["error"]="";
			$wp_query->is_404=false;
			
			// custom variable to disable header
			global $NOHEADERTITLE; $NOHEADERTITLE = true;
			
			// remove content filters so JS content is exactly the same as WordPress
			$filters = array(
				'wpautop',
				'wptexturize',
				'convert_chars',
				'convert_smilies'
			);
			foreach ( $filters as $filt ){
				remove_filter("the_content", $filt);
			}
		}
	}
	
	return $posts;
}

function az4dbwp_render(){
	global $wp, $az4dbwp_page;
	
	// remove start of request for page fetching and replace /
	$page = az4db_strippage();
	
	// remove trailing slash
	$page = rtrim($page, "/");
	
	$base = get_bloginfo('url')."/".$az4dbwp_page;

    $pushtest = "";
    
    // only include pushstate test if we're not at the root of the app
    if ($page != "" && $page != "/") {
        $pushtest = "
if (!history || !history.pushState) {
    do_load = false;
    setCookie('az4db_jump', '".$page."', 1);
    document.location.href = '/".$az4dbwp_page."#".$page."';
}
";
    }
	
	return <<< EOD
<script type='text/javascript'>
var do_load = true;
function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value + "; Path=/;";
}
function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}
{$pushtest}
</script>
<!--[if lte IE 8]>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>
<script type="text/javascript">
function update_browser() {
   CFInstall.check({
     mode: "overlay"
   });
}
window.attachEvent("onload", update_browser);
</script>
<div class='az4db'>
<div class='alert alert-error'>
<strong>You are using an out-of-date browser.</strong>
<p>Internet Explorer 8 and below are no longer supported and are considered 'out-of-date' browsers. Not only that, they also account for less than 2% of our users.</p>
<p>Please upgrade to a newer version of Internet Explorer, of if you can't, you can do one of the following:</p>
<ul>
<li><a href="http://www.google.com/chromeframe?quickenable=true" target="_blank">Add Google Frame to your browser (instantly makes Internet Explorer display more advanced websites) - even works in schools/offices!</a></li>
<li><a href="http://www.google.co.uk/chrome" target="_blank">Try Google Chrome</a></li>
<li><a href="http://www.mozilla.org/firefox/" target="_blank">Try Firefox</a></li>
</ul>
</div>
</div>
<![endif]-->
<div id='database' class='az4db'>Loading the AlphaZone4 PlayStation Home Item Database...</div>
<link rel='stylesheet' type='text/css' href='//api.alphazone4.com/build/style.css' />
<script src='//api.alphazone4.com/build/az4db-jquery.js'></script><script type='text/javascript'>
var hash_page = "";
if (location.hash != "" && location.hash != "#") {
    hash_page = location.hash.replace(/\#/g, '').replace(/\/$/g, '');
}
if (do_load) az4db_init({
	baseURL: "{$base}",
    basePath: "/{$az4dbwp_page}",
    apiBase: "https://api.alphazone4.com",
    linkType: "html5"
});az4db_frame($("#database"),function(frame) {
    if (getCookie("az4db_jump")) {
        frame.start(getCookie("az4db_jump"));
        setCookie("az4db_jump", '', -1);
    } else if (hash_page != "") {
    	frame.start(hash_page);
    } else {
    	frame.start("{$page}");
    }
});</script>
EOD;
}

// allow permalinks that end with a number
class Allow_Numeric_Stubs {

	function allow_numeric_stubs() {
		register_activation_hook( __FILE__, array( &$this, 'flush_rewrite_rules' ) );

		add_filter( 'page_rewrite_rules',   array( &$this, 'page_rewrite_rules' ) );

		add_action( 'save_post',            array( &$this, 'maybe_fix_stub' ), 2, 2 );
		add_filter( 'editable_slug',        array( &$this, 'maybe_fix_editable_slug' ) );
	}


	// Force a flush of the rewrite rules (for when this plugin is activated)
	function flush_rewrite_rules() {
		global $wp_rewrite;
		$wp_rewrite->flush_rules();
	}


	// Remove the rewrite rule that "breaks" it (paged content) and replace it with one that allows numeric stubs
	function page_rewrite_rules( $rules ) {
		unset( $rules['(.?.+?)(/[0-9]+)?/?$'] );

		$rules['(.?.+?)?/?$'] = 'index.php?pagename=$matches[1]';

		return $rules;
	}


	// WordPress will add "-2" to numeric stubs as they aren't normally allowed.
	// Undo that for numeric page slugs when the post is saved.
	function maybe_fix_stub( $post_ID, $post ) {

		// Pages only
		if ( 'page' != $post->post_type )
			return;

		// Only mess with numeric stubs or stubs that are 12345-2
		if ( ! is_numeric( $post->post_name ) && $post->post_name == $this->maybe_unsuffix_slug( $post->post_name ) )
			return;

		// Infinite loops are bad
		remove_action( 'save_post', array( &$this, 'maybe_fix_stub' ), 2, 2 );

		// Update the post with a filter active that'll fix the slug back to what it was supposed to be
		add_filter( 'wp_insert_post_data', array(&$this, 'slug_fixer'), 10, 2 );
		wp_update_post( $post );
		remove_filter( 'wp_insert_post_data', array(&$this, 'slug_fixer'), 10, 2 );

		// Put this filter back incase any other posts are updated on this pageload
		add_action( 'save_post', array( &$this, 'maybe_fix_stub' ), 2, 2 );
	}


	// Ensure that post_name stays as we pass it as wp_unique_post_slug() will try and add a "-2" to the end of it
	function slug_fixer( $data, $postarr ) {
		// $data['post_name'] = $postarr['post_name']; // Not sure why this isn't working

		$data['post_name'] = $this->maybe_unsuffix_slug( $postarr['post_name'] );

		return $data;
	}


	// Re-fix the page slug for the editable URL
	function maybe_fix_editable_slug( $slug ) {
		global $post;

		if ( empty( $post ) )
			$thispost = get_post( $_POST['post_id'] );
		else
			$thispost = $post;

		if ( empty( $thispost->post_type ) )
			return $slug;

		if ( 'page' == $thispost->post_type )
			$slug = $this->maybe_unsuffix_slug( $slug );

		return $slug;
	}


	// Checks to see if a string is numeric with "-2" on the end of it
	// If so, it returns the original numeric string
	function maybe_unsuffix_slug( $slug ) {
		if ( '-2' == substr( $slug, -2 ) ) {
			$nonsuffixslug = substr( $slug, 0, -2 );

			if ( is_numeric( $nonsuffixslug ) )
				$slug = $nonsuffixslug;
		}

		return $slug;
	}
}

$Allow_Numeric_Stubs = new Allow_Numeric_Stubs();

?>
