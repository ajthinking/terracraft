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
}
