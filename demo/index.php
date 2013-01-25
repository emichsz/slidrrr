<?php
header('Content-Type: text/html; charset=UTF-8');
$movie = 'SzZ_Symfony2_1_PHPMeetup';
$dir = dirname(__FILE__) . DIRECTORY_SEPARATOR;
if (isset($_SERVER{'QUERY_STRING'})) {
	$configFile = $dir . $_SERVER{'QUERY_STRING'} . DIRECTORY_SEPARATOR . 'config.json';
	// realpath: az ugyeskedesek kivedesere:
	if (is_file($configFile) and $configFile === realpath($configFile)) {
		$movie = $_SERVER{'QUERY_STRING'};
	}
}
$configFile = $dir . $movie . DIRECTORY_SEPARATOR . 'config.json';
?>
<!DOCTYPE HTML>
<html>
<head>
<title>Slidrrr - DEMO</title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="en" />
<meta name="keywords" lang="hu" content="~" />
<meta name="description" lang="hu" content="~" />
<meta name="rating" content="general" />
<meta name="doc-type" content="web page" />
<meta name="copyright" lang="hu" content="Copyright (C) Slidrrr 2013" />
<meta name="Author" lang="hu" content="mrdesing" />
<meta name="email" content="info@slidrrr.hu" />
<meta name="Revisit-after" content="1 Days" />

<meta property="fb:app_id" content="384594068263227"/>

<link href="css/reset.css" type="text/css" rel="stylesheet" media="all" />
<link href="css/slidrrr.css" type="text/css" rel="stylesheet" media="all" />
<script src="js/jquery.min.js" type="text/javascript"></script>
<script src="js/jquery-ui.min.js"></script>
<script src="js/jquery.ui.touch-punch.js"></script>
<script src="js/slidrrr.js" type="text/javascript"></script>
<script src="js/slideshow.js" type="text/javascript"></script>
<script src="js/tooltip.js" type="text/javascript"></script>
<script src="js/slides.js" type="text/javascript"></script>
<script src="js/controls.js" type="text/javascript"></script>
<script src="js/player.js" type="text/javascript"></script>
<script src="js/fullscreen.js" type="text/javascript"></script>

<!-- FACEBOOK JS SDK -->
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=384594068263227";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>    

<script type="text/javascript">
//Feedback
if (document.location.hostname !== 'localhost') {
	jQuery.ajax({
		url: "https://jira.arkon.hu/s/hu_HU-s2zus3/773/108/1.2.5/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=b50e8fd5",
		type: "get",
		cache: true,
		dataType: "script"
	});
}
</script>
<script type="text/javascript">
$(function () {
	Slidrrr.init(<?php readfile($configFile);?>);
});
</script>
</head>
<pre>
<?php

    // ez a controllerből jön majd $data változóban

    $data = json_decode(file_get_contents($configFile));
    
    function implode_extended(array $subjects, array $links, $delimiter=", ", $tag="a", $attr="href")
    {
        if(sizeof($subjects)==sizeof($links))
        {
            $output = "<".$tag." ".$attr."=".$links[0].">\n";
            for($i=0; $i<sizeof($subjects); $i++)
            {
                $output .= "<".$tag." ".$attr."=".$links[$i].">".$subjects[$i]."</".$tag."> ";
                if($i!=sizeof($subjects)-1) $output .= $delimiter;
            }
            return $output;
        }
        else return null;
    }
    
?>
</pre>

<body>
	
    <div id="container">
	
		<div id="header_container">
			<h1>Slidrrr</h1>
			
			<div id="header_menu">
				<div id="header_login_btn" class="primary_btn">Log in</div>
				<ul>
					<li><a href="#">New &amp; Hot</a></li>
					<li><a href="#">Most popular</a></li>
				</ul>
			</div>
			<div class="clear"></div>
		</div>
		
		<div id="playrrr_container">
                    <!--div id="slidrrr_container"></div-->
			<!--img src="img/sample.jpg" /-->
		</div>
		
		<div id="playrrr_info">
			<div class="left_side">
				<h2 class="textshadow_black">How not to start a mobile app development?</h2>
                                <h3>Presented at <?php echo date('Y.m.d',strtotime($data->presentation_date)); ?> by <?php echo implode_extended($data->performer_name, $data->performer_id, ' &amp; ', 'a', 'href'); ?></span> at <span><?php echo $data->conference_name; ?></span>
				- Uploaded at <?php echo date('Y.m.d',strtotime($data->upload_date)); ?> by <a href="userlink"><?php echo $data->uploader_name; ?></a></h3>
				<p>This presentation is a really awsome one, so I thought I'd share it with all you.</p>
				<p class="tags">Tags: <span> <?php echo implode('</span>, <span>', $data->tags); ?></span></p>
			</div>
			<div class="right_side">
				<div id="views" class="textshadow_black">
                                   5 498 views
				</div>
				<div id="likes">
                                    <h3>235</h3> <p>Appreciate this</p>
				</div>
			</div>
                    <div class="clear"></div>
		</div>
		
		<div id="under_video">
			<div class="left_side">
                            <div class="fb-comments" data-href="http://kapinbogi.hu/2013/01/15/o-o-atvertek/" data-num-posts="20" data-width="580" data-colorscheme="dark"></div>
			</div>
			<div class="right_side">
                            <a class="one_related" href="#">
                                <img class="related_img" src="img/related_sample.png" />
                                <big>One does not simply sitebuild</big>
                                <small>5 498 views</small>
                                <small>235 appreciated</small>
                                <div class="clear"></div>
                            </a>
                             <a class="one_related" href="#">
                                <img class="related_img" src="img/related_sample.png" />
                                <big>One does not simply sitebuild</big>
                                <small>5 498 views</small>
                                <small>235 appreciated</small>
                                <div class="clear"></div>
                            </a>
                             <a class="one_related" href="#">
                                <img class="related_img" src="img/related_sample.png" />
                                <big>One does not simply sitebuild</big>
                                <small>5 498 views</small>
                                <small>235 appreciated</small>
                                <div class="clear"></div>
                            </a>
                             <a class="one_related" href="#">
                                <img class="related_img" src="img/related_sample.png" />
                                <big>One does not simply sitebuild</big>
                                <small>5 498 views</small>
                                <small>235 appreciated</small>
                                <div class="clear"></div>
                            </a>
                            
                           
			</div>
                        <div class="clear"></div>
		</div>
		
	</div>

<br>
<br>
<br>
<br>
<br>
<br>
<br>
	
    
<script type="text/javascript">
if (document.location.hostname !== 'localhost') {
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-37492416-1']);
	_gaq.push(['_trackPageview']);
	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
}
</script>
</body>
</html>