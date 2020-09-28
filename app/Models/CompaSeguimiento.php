<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompaSeguimiento extends Model
{
    protected $table = 'COMPARENDO_SEGUIMIENTO';
    protected $primaryKey = 'seguimiento';
    public $timestamps = false;
}
