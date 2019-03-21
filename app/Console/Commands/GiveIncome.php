<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use App\Tile;
use DB;

class GiveIncome extends Command
{
    const INCOME_PER_TILE = 100;

    protected $signature = 'terracraft:giveIncome';

    public function handle()
    {
        DB::table('tiles')        
            ->groupBy('user_id')
            ->join('users', 'tiles.user_id', '=', 'users.id')
            ->select('user_id', 'nickname', 'avatar', DB::raw('count(*) as number_of_tiles'))
            ->get()->each(function($ranking) {
                $user = User::find( $ranking->user_id );
                $user->gold += $ranking->number_of_tiles * $this::INCOME_PER_TILE;
                $user->save();
        });
    }
}
