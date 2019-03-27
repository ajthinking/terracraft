@if($user)
	<script>
		let user = {!! Auth::user()->toJson() !!};
	</script>
@endif

<ul class="list-reset flex pl-6 bg-black p-2">
  <li class="mr-6">
    <a class="text-white hover:text-blue-darker" href="/map">Map</a>
  </li>
  <li class="mr-6">
    <a class="text-white hover:text-blue-darker" href="/rankings">Rankings</a>
  </li>

  @if($user)
  <li class="mr-6">
    <a id="gold-count" class="text-white hover:text-blue-darker text-xs">gold: {{ $user->gold }} </a>
  </li>    
  @endif  
  
</ul>
