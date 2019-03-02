<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tile;
use Auth;

class TileController extends Controller
{
    public function index() {
        return Tile::all();
    }    

    public function store() {
        $id = request()->input('tile')["id"];

        return Tile::updateOrCreate(["id" => $id], [ 
            'id' => $id,
            'user_id' => Auth::user()->id
        ]);
    }
}
