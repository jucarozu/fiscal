<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeteccionSeguimiento extends Model
{
    protected $table = 'DETECCION_SEGUIMIENTO';
    protected $primaryKey = 'seguimiento';
    public $timestamps = false;
}
