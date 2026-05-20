<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Experience extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'organization',
        'description',
        'skills',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'skills' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
