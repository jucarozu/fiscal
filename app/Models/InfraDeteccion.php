<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfraDeteccion extends Model
{
    protected $table = 'INFRACCION_DETECCION';
    protected $primaryKey = 'infra_deteccion';
    public $timestamps = false;
}
