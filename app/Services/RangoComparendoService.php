<?php

namespace App\Services;

use DB;

class RangoComparendoService
{
    public function __construct()
    {
        
    }

    public function getConsecutivo()
    {
        $rango = DB::select('SELECT MIN(D.NUMERO) AS NUMERO FROM DETALLE_RANGO D INNER JOIN RANGO_COMPARENDO R ON R.RANGO = D.RANGO WHERE R.ESTADO = 1 AND D.ESTADO = 1');
        return $rango[0]->numero;
    }
}