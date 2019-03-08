<link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">

@include('layouts.navbar')

<h3>Number of acres conquered</h3>
<div class="flex flex-col">
    @foreach($user_rankings as $user_ranking)
    <div>
    <div class="flex items-center">
      <img class="w-10 h-10 rounded-full mr-4" src="{{ $user_ranking->avatar }}" alt="Avatar of Jonathan Reinink">
      <div class="text-sm">
        <p class="text-black leading-none">{{ $user_ranking->nickname }}</p>
      </div>
      <p class="ml-8 text-black text-2xl">{{ $user_ranking->number_of_tiles }}</p>
    </div>
    </div>
    @endforeach
</div>
