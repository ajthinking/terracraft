<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>LaraCraft</title>

	<!-- libs -->
	<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
	<script src="js/leaflet-pip.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.4.0/seedrandom.min.js"></script>
	<script src="js/rhill-voronoi-core.min.js"></script>
	
    <!-- css -->
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <link rel="stylesheet" href="css/app.css" />
</head>
<body>
	<div id="header">
		<span class="header-item">
			<i class="fas fa-dollar-sign"></i>
			281337
		</span>
		<span class="header-item">
			<i class="fas fa-users"></i>
			1024
		</span>
		<span class="header-item">
			<i class="fas fa-globe"></i>  
			28
		</span>
	</div>
	<div id="map"></div>
	<div id="footer">
	</div>	    

	<script src="js/app.js"></script>
</body>
</html>
