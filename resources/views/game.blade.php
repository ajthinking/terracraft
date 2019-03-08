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

	<script src="https://cdn.jsdelivr.net/npm/leaflet-pulse-icon@0.1.0/src/L.Icon.Pulse.min.js"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-pulse-icon@0.1.0/src/L.Icon.Pulse.css" />

	<link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
	@include('layouts.navbar')

	<div id="map"></div>
	<script>
		let user = {!! Auth::user()->toJson() !!};
	</script>
	<script src="js/app.js"></script>
</body>
</html>
