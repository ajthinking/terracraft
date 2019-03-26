<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use App\Tile;
use DB;

class Explore extends Command
{
    protected $signature = 'terracraft:explore';

    public function handle()
    {
        User::all()->each(function($user) {
            $candidateId = $user->tiles()->random()->randomNeighbourId();
            if(!Tile::find($candidateId)) {
                return Tile::create([ 
                    'id' => $candidateId,
                    'user_id' => $user->id
                ]);
            }
        });
    }
}
