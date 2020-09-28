<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agente extends Model
{
    protected $table = 'AGENTE_TRANSITO';
    protected $primaryKey = 'agente';
    public $timestamps = false;
}
