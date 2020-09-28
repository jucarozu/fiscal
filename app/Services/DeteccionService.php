<?php

namespace App\Services;

use App\Models\Deteccion;

class DeteccionService
{
    public function __construct()
    {
        
    }
    
    public function update($deteccionArray, $id)
    {
        try
        {
            // Actualizar los datos de la detección.
            $deteccion = Deteccion::find($id);
            $deteccion->fecha = isset($deteccionArray['fecha']) && isset($deteccionArray['hora']) ? $deteccionArray['fecha'] . ' ' . $deteccionArray['hora'] : $deteccion->fecha;
            $deteccion->estado = isset($deteccionArray['estado']) ? $deteccionArray['estado'] : $deteccion->estado;
            $deteccion->fuente = isset($deteccionArray['fuente']) ? $deteccionArray['fuente'] : $deteccion->fuente;
            $deteccion->referencia_disp = isset($deteccionArray['referencia_disp']) ? $deteccionArray['referencia_disp'] : $deteccion->referencia_disp;
            $deteccion->latitud = isset($deteccionArray['latitud']) ? $deteccionArray['latitud'] : $deteccion->latitud;
            $deteccion->longitud = isset($deteccionArray['longitud']) ? $deteccionArray['longitud'] : $deteccion->longitud;
            $deteccion->direccion = isset($deteccionArray['direccion']) ? $deteccionArray['direccion'] : $deteccion->direccion;
            $deteccion->complemento_direccion = isset($deteccionArray['complemento_direccion']) ? $deteccionArray['complemento_direccion'] : $deteccion->complemento_direccion;
            $deteccion->placa = isset($deteccionArray['placa']) ? $deteccionArray['placa'] : $deteccion->placa;
            $deteccion->tipo_vehiculo = isset($deteccionArray['tipo_vehiculo']) ? $deteccionArray['tipo_vehiculo'] : $deteccion->tipo_vehiculo;
            $deteccion->color = isset($deteccionArray['color']) ? $deteccionArray['color'] : $deteccion->color;
            $deteccion->servicio = isset($deteccionArray['servicio']) ? $deteccionArray['servicio'] : $deteccion->servicio;
            $deteccion->nivel = isset($deteccionArray['nivel']) ? $deteccionArray['nivel'] : $deteccion->nivel;
            $deteccion->carril = isset($deteccionArray['carril']) ? $deteccionArray['carril'] : $deteccion->carril;
            $deteccion->sentido = isset($deteccionArray['sentido']) ? $deteccionArray['sentido'] : $deteccion->sentido;
            $deteccion->velocidad = isset($deteccionArray['velocidad']) ? $deteccionArray['velocidad'] : $deteccion->velocidad;
            $deteccion->unidad_velocidad = isset($deteccionArray['unidad_velocidad']) ? $deteccionArray['unidad_velocidad'] : $deteccion->unidad_velocidad;
            $deteccion->observaciones = isset($deteccionArray['observaciones']) ? $deteccionArray['observaciones'] : $deteccion->observaciones;
            $deteccion->save();
        }
        catch(\Exception $e)
        {
            return false;
        }

        return true;
    }
}