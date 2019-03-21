<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tile extends Model
{
    protected $fillable = [
        'id', 'user_id'
    ];

    protected $casts = [
        'user_id' => 'integer',
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function x() {
        return $this->id; // 10000000
    }

    public function y() {
        return $this->id; // 10000000
    }

    /*
        10000000
        2529369980772
    */
}
