<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotifSeguimiento extends Model
{
    protected $table = 'NOTIFICACION_SEGUIMIENTO';
    protected $primaryKey = 'seguimiento';
    public $timestamps = false;
}
