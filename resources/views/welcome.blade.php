<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>LaraCraft</title>

	<!-- libs -->
	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script src="js/leaflet-pip.min.js"></script>
	<script src="https:////cdnjs.cloudflare.com/ajax/libs/seedrandom/2.4.0/seedrandom.min.js"></script>
	<script src="js/rhill-voronoi-core.min.js"></script>
	
    <!-- css -->
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css"
	integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
	crossorigin=""/>
	<link rel="stylesheet" href="css/app.css" />
	
	<!-- leaflet js after css -->
	<script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js"
	integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw=="
	crossorigin=""></script>
</head>
<body>
	<div id="header">
		<span class="header-items">
			<span class="header-item">
				<img src="img/favicon.png" height="20" />
			</span>
			<span class="header-item">
				<i class="fas fa-dollar-sign"></i>
				<span id="cash">281337</span>
			</span>
			<span class="header-item">
				<i class="fas fa-users"></i>
				<span id="pop">1024</span>
			</span>
			<span class="header-item">
				<i class="fas fa-globe"></i>  
				28
			</span>
		</span>
	</div>
	<div id="map"></div>
	<div id="footer">
		<span class="header-item">
			<i class="fab fa-fort-awesome"></i>
			<span>City Hall</span>
		</span>
		<span class="header-item">
			<i class="fas fa-gavel"></i>
			<span>Council</span>
		</span>
		<span class="header-item">
			<i class="fas fa-crown"></i>
			<span>Hall of Fame</span>
		</span>
		<span class="header-item">
			<i class="fas fa-shield-alt"></i>
			<span>Defenses</span>
		</span>
		<span class="header-item">
			<i class="fas fa-skull"></i>
			<span>Death</span>
		</span>								
	</div>	    

	<script src="js/app.js"></script>

	<script>
		setInterval(function() {
			$("#cash").html(parseInt($("#cash").html())+1);
		}, 50)

		setInterval(function() {
			$("#pop").html(parseInt($("#pop").html())+1);
		}, 5000)		
	</script>
</body>
</html>
