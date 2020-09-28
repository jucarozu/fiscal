<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $table = 'VIEW_USUARIO';
    protected $primaryKey = 'usuario';
    public $timestamps = false;
}
