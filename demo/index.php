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
<html><head><meta charset="UTF-8" />
<title>Slidrrr - DEMO</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="css/slidrrr.css" type="text/css" rel="stylesheet" media="all" />
<script src="js/jquery.min.js" type="text/javascript"></script>
<script src="js/jquery-ui.min.js"></script>
<script src="js/jquery.event.move.js"></script>
<script src="js/jquery.event.swipe.js"></script>
<script src="js/slidrrr.js" type="text/javascript"></script>
<script src="js/slideshow.js" type="text/javascript"></script>
<script src="js/tooltip.js" type="text/javascript"></script>
<script src="js/slides.js" type="text/javascript"></script>
<script src="js/controls.js" type="text/javascript"></script>
<script src="js/player.js" type="text/javascript"></script>
<script src="js/fullscreen.js" type="text/javascript"></script>
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
<body>
	<div id="header"><h1>Slidrrr</h1></div>
	<div id="container"></div>
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