<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tile;
use Auth;
use DB;

class RankingsController extends Controller
{
    public function index() {
        $user_rankings = DB::table('tiles')
        
        ->groupBy('user_id')
        ->join('users', 'tiles.user_id', '=', 'users.id')
        ->select('user_id', 'nickname', 'avatar', DB::raw('count(*) as number_of_tiles'))
        ->get()->sortBy('number_of_tiles')->reverse();

        return view('rankings')->with([
            'user_rankings' => $user_rankings
        ]);
    }
}
