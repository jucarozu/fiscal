<?php

namespace App\Services;

use App\Models\DetalleDescarte;

class DetalleDescarteService
{
    public function __construct()
    {
        
    }

    public function insert($detalleDescarteArray)
    {
        try
        {
            // Insertar los datos del detalle del descarte de la infracción.
            $detalleDescarte = new DetalleDescarte();
            $detalleDescarte->deteccion = $detalleDescarteArray['deteccion'];
            $detalleDescarte->infra_deteccion = $detalleDescarteArray['infra_deteccion'];
            $detalleDescarte->motivo = $detalleDescarteArray['motivo'];
            $detalleDescarte->save();
        }
        catch(\Exception $e)
        {
            return false;
        }

        return $detalleDescarte->detalle;
    }
}