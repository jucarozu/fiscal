<?php

namespace App\Services;

use App\Models\DeteccionSeguimiento;

class DeteccionSeguimientoService
{
    public function __construct()
    {
        
    }

    public function insert($deteccionSeguimientoArray)
    {
        try
        {
            // Insertar los datos del seguimiento de la detección.
            $deteccionSeguimiento = new DeteccionSeguimiento();
            $deteccionSeguimiento->deteccion = $deteccionSeguimientoArray['deteccion'];
            $deteccionSeguimiento->usuario = $deteccionSeguimientoArray['usuario'];
            $deteccionSeguimiento->estado = $deteccionSeguimientoArray['estado'];
            $deteccionSeguimiento->observaciones = $deteccionSeguimientoArray['observaciones'];
            $deteccionSeguimiento->save();
        }
        catch(\Exception $e)
        {
            return false;
        }

        return $deteccionSeguimiento->seguimiento;
    }
}