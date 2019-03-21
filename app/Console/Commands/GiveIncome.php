<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use App\Tile;
use DB;

class GiveIncome extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'terracraft:giveIncome';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Distribute income';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        DB::table('tiles')        
            ->groupBy('user_id')
            ->join('users', 'tiles.user_id', '=', 'users.id')
            ->select('user_id', 'nickname', 'avatar', DB::raw('count(*) as number_of_tiles'))
            ->get()->each(function($ranking) {
                $user = User::find( $ranking->user_id );
                $user->gold += $ranking->number_of_tiles;
                $user->save();
        });
    }
}
