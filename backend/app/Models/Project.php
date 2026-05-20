<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'tech_stacks',
        'github_url',
        'demo_url',
        'thumbnail_path',
        'order',
    ];

    protected $casts = [
        'tech_stacks' => 'array',
    ];
}
