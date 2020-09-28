<?php

namespace App\Services;

use App\Models\DeteccionDescarte;

class DeteccionDescarteService
{
    public function __construct()
    {
        
    }

    public function insert($deteccionDescarteArray)
    {
        try
        {
            // Insertar los datos del descarte de la detección.
            $deteccionDescarte = new DeteccionDescarte();
            $deteccionDescarte->deteccion = $deteccionDescarteArray['deteccion'];
            $deteccionDescarte->tipo_descarte = $deteccionDescarteArray['tipo_descarte'];
            $deteccionDescarte->motivo = $deteccionDescarteArray['motivo'];
            $deteccionDescarte->usuario = $deteccionDescarteArray['usuario'];
            $deteccionDescarte->observacion = $deteccionDescarteArray['observacion'];
            $deteccionDescarte->estado = $deteccionDescarteArray['estado'];
            $deteccionDescarte->save();
        }
        catch(\Exception $e)
        {
            return false;
        }

        return $deteccionDescarte->descarte;
    }
}