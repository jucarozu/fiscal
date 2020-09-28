<?php

namespace App\Services;

use App\Models\Evidencia;

use DB;

class EvidenciaService
{
    public function __construct()
    {
        
    }

    public function getByDeteccion($deteccion)
    {
        $evidencias = Evidencia::where('deteccion', $deteccion)
                               ->orderBy('evidencia')
                               ->get();

        $i=0;

        foreach ($evidencias as $evidencia)
        {
            $archivo = explode('.', $evidencia->nombre_archivo);
            $extension = end($archivo);
            $evidencia->extension = $extension;

            $array_bytes = rawurlencode(base64_encode(file_get_contents($evidencia->ruta . str_pad($evidencia->evidencia, 10, '0', STR_PAD_LEFT) . '.' . $extension)));
            $evidencia->array_bytes = $array_bytes;

            $i++;
        }

        return $evidencias;
    }
}