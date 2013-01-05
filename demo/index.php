<?php
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE HTML>
<html><head><meta charset="UTF-8" />
<title>Slidrrr - DEMO - Symfony 2</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="css/slidrrr.css" type="text/css" rel="stylesheet" media="all" />
<script src="js/jquery.min.js" type="text/javascript"></script>
<script src="js/jquery-ui.min.js"></script>
<script src="js/slidrrr.js" type="text/javascript"></script>
<script src="js/slideshow.js" type="text/javascript"></script>
<script src="js/tooltip.js" type="text/javascript"></script>
<script src="js/slides.js" type="text/javascript"></script>
<script src="js/controls.js" type="text/javascript"></script>
<script src="js/player.js" type="text/javascript"></script>
<script src="js/fullscreen.js" type="text/javascript"></script>
<script type="text/javascript">
$(function () {
	Slidrrr.init({
		renderTo: 'container',
		//backgroundColor: '#cdd',
		video: {
			id: 'Ud9OluPSKEk',
			duration: 1144
		},
		slides: [
			{time:   0, src: 'SzZ_Symfony2_1_PHPMeetup/01.jpg', title: 'Symfony 2'},
			{time:  15, src: 'SzZ_Symfony2_1_PHPMeetup/02.jpg'},
			{time:  40, src: 'SzZ_Symfony2_1_PHPMeetup/03.jpg', title: 'Symfony 2 - múlt'},
			{time:  55, src: 'SzZ_Symfony2_1_PHPMeetup/04.jpg', title: 'Symfony 2 - jövő'},
			{time:  86, src: 'SzZ_Symfony2_1_PHPMeetup/05.jpg', title: 'Symfony 2 - mint framework'},
			{time: 114, src: 'SzZ_Symfony2_1_PHPMeetup/06.jpg'},
			{time: 192, src: 'SzZ_Symfony2_1_PHPMeetup/07.jpg', title: 'Symfony 2 - ORM'},
			{time: 273, src: 'SzZ_Symfony2_1_PHPMeetup/08.jpg'},
			{time: 306, src: 'SzZ_Symfony2_1_PHPMeetup/09.jpg', title: 'Symfony 2 - Controller'},
			{time: 386, src: 'SzZ_Symfony2_1_PHPMeetup/10.jpg'},
			{time: 426, src: 'SzZ_Symfony2_1_PHPMeetup/11.jpg', title: 'Symfony 2 - View'},
			{time: 475, src: 'SzZ_Symfony2_1_PHPMeetup/12.jpg'},
			{time: 523, src: 'SzZ_Symfony2_1_PHPMeetup/13.jpg'},
			{time: 542, src: 'SzZ_Symfony2_1_PHPMeetup/14.jpg', title: 'Symfony 2 - Form'},
			{time: 574, src: 'SzZ_Symfony2_1_PHPMeetup/15.jpg', title: 'Symfony 2 - Validátió'},
			{time: 606, src: 'SzZ_Symfony2_1_PHPMeetup/16.jpg', title: 'Symfony 2 - Tesztelés'},
			{time: 685, src: 'SzZ_Symfony2_1_PHPMeetup/17.jpg', title: 'Symfony 2 - Linkek'},
			{time: 701, src: 'SzZ_Symfony2_1_PHPMeetup/18.jpg', title: 'Symfony 2 - Kérdések?'}
		]
	});
});
</script>
</head>
<body>
	<div id="header"><h1>Slidrrr</h1></div>
	<div id="container"></div>
</body>
</html>