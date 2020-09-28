<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'USUARIO';
    protected $primaryKey = 'usuario';
    public $timestamps = false;
}
