<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroContent extends Model
{
    protected $fillable = [
        'headline',
        'subheadline',
        'photo_path',
        'available_for_work',
    ];

    protected $casts = [
        'available_for_work' => 'boolean',
    ];
}
