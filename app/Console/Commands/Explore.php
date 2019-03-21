<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use App\Tile;
use DB;

class Explore extends Command
{
    const EXPLORATION_COST = 1000;

    protected $signature = 'terracraft:explore';

    public function handle()
    {
        User::find(1)->tiles()->random()->id;
    }
}
