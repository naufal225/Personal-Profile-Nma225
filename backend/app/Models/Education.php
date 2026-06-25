<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Education extends Model
{
    use SoftDeletes;

    protected $table = 'educations';

    protected $fillable = [
        'institution',
        'icon',
        'major',
        'description',
        'start_year',
        'end_year',
    ];
}
