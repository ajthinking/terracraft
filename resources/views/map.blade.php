@extends('layouts.main')
@section('content')
	<div id="map"></div>
	<script>
		let user = {!! Auth::user()->toJson() !!};
	</script>

	<script src="js/app.js"></script>
@endsection