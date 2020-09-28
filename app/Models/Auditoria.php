<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auditoria extends Model
{
    protected $table = 'AUDITORIA';
    protected $primaryKey = 'registro';
    public $timestamps = false;
}
