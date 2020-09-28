<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Firma extends Model
{
    protected $table = 'FIRMA_FUNCIONARIO';
    protected $primaryKey = 'persona';
    public $timestamps = false;
}
