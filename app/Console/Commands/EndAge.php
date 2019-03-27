<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Tile;
use App\Age;
use DB;

class EndAge extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'terracraft:endAge {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        $user_rankings = DB::table('tiles')        
            ->groupBy('user_id')
            ->join('users', 'tiles.user_id', '=', 'users.id')
            ->select('user_id', 'nickname', 'avatar', DB::raw('count(*) as number_of_tiles'))
            ->get()->sortBy('number_of_tiles')->reverse();

        return Age::updateOrCreate(["id" => $this->argument('id')], [ 
            'id' => $this->argument('id'),
            'data' => json_encode($user_rankings)
        ]);
    }
}
