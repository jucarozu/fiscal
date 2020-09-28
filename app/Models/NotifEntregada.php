<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotifEntregada extends Model
{
    protected $table = 'NOTIFICACION_ENTREGADA';
    protected $primaryKey = 'entregada';
    public $timestamps = false;
}
