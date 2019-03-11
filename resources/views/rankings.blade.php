@extends('layouts.main')
@section('content')
  <div class="flex items-center flex-col">
  <h3 class="mb-8 mt-4">Number of acres conquered</h3>
      @foreach($user_rankings as $user_ranking)
      <div class="flex items-center justify-between w-full max-w-sm">
        <div class="flex items-center">
          <img class="w-10 h-10 rounded-full mr-4" src="{{ $user_ranking->avatar }}" alt="Avatar of Jonathan Reinink">
          <div class="text-sm">
            <p class="text-black leading-none">{{ $user_ranking->nickname }}</p>
          </div>
        </div>
        <p class="ml-8 text-black text-4xl">{{ $user_ranking->number_of_tiles }}</p>
      </div>
      @endforeach
      <!--
      <div class="mt-12 flex text-xs items-center">
          <p class="mr-4 text-black">uncharted territory </p>
        
          <p class="text-black">395640301</p>
      </div>    
      -->
      <a href="/map">
          <button class="mt-12 bg-indigo  text-white border rounded p-2">Back to Map!</button>
      </a>
  </div>
@endsection