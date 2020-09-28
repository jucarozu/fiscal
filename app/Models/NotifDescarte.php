<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotifDescarte extends Model
{
    protected $table = 'NOTIFICACION_DESCARTE';
    protected $primaryKey = 'descarte';
    public $timestamps = false;
}
