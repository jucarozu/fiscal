<?php

namespace App\Services;

use App\Models\VTResponsable;

use DB;

class ResponsableService
{
    public function __construct()
    {
        
    }

    public function getByTipoActo($tipo_acto)
    {
        $responsable = VTResponsable::where('tipo_acto', $tipo_acto)
                                    ->get()
                                    ->first();

        return $responsable;
    }
}