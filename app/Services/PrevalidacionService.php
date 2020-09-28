<?php

namespace App\Services;

use App\Services\DeteccionService;
use App\Services\DeteccionSeguimientoService;
use App\Services\DeteccionDescarteService;
use App\Services\DetalleDescarteService;

use DB;

class PrevalidacionService
{
    protected $deteccionService;
    protected $deteccionSeguimientoService;
    protected $deteccionDescarteService;
    protected $detalleDescarteService;

    public function __construct(DeteccionService $deteccionService,
                                DeteccionSeguimientoService $deteccionSeguimientoService,
                                DeteccionDescarteService $deteccionDescarteService,
                                DetalleDescarteService $detalleDescarteService)
    {
        $this->deteccionService = $deteccionService;
        $this->deteccionSeguimientoService = $deteccionSeguimientoService;
        $this->deteccionDescarteService = $deteccionDescarteService;
        $this->detalleDescarteService = $detalleDescarteService;
    }

    public function validar($prevalidacion)
    {
        try
        {
            DB::beginTransaction();

            // Actualizar estado de la detección.
            $deteccion = array(
                'fecha' => $prevalidacion->fecha,
                'hora' => $prevalidacion->hora,
                'fuente' => $prevalidacion->fuente,
                'referencia_disp' => $prevalidacion->referencia_disp,
                'latitud' => $prevalidacion->latitud,
                'longitud' => $prevalidacion->longitud,
                'direccion' => $prevalidacion->direccion,
                'complemento_direccion' => $prevalidacion->complemento_direccion,
                'placa' => $prevalidacion->placa,
                'tipo_vehiculo' => $prevalidacion->tipo_vehiculo,
                'color' => $prevalidacion->color,
                'servicio' => $prevalidacion->servicio,
                'nivel' => $prevalidacion->nivel,
                'carril' => $prevalidacion->carril,
                'sentido' => $prevalidacion->sentido,
                'velocidad' => $prevalidacion->velocidad,
                'unidad_velocidad' => $prevalidacion->unidad_velocidad,
                'observaciones' => $prevalidacion->observaciones,
                'estado' => $prevalidacion->estado
            );
            
            if (!$this->deteccionService->update($deteccion, $prevalidacion->deteccion))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al actualizar el estado de la detección.', 'http_code' => 500);
            }

            // Insertar seguimiento de la detección.
            $deteccionSeguimiento = array(
                'deteccion' => $prevalidacion->deteccion,
                'usuario' => $prevalidacion->seguimiento->usuario,
                'estado' => $prevalidacion->seguimiento->estado,
                'observaciones' => $prevalidacion->seguimiento->observaciones
            );

            if (!$id = $this->deteccionSeguimientoService->insert($deteccionSeguimiento))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al registrar el seguimiento de la detección.', 'http_code' => 500);
            }

            DB::commit();
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return array('estado' => 'ERROR', 'mensaje' => 'Error al validar la detección.', 'http_code' => 500);
        }

        return array('estado' => 'OK', 'mensaje' => 'OK', 'http_code' => 200);
    }

    public function descartar($prevalidacion)
    {
        try
        {
            DB::beginTransaction();

            // Actualizar estado de la detección.
            $deteccion = array(
                'estado' => $prevalidacion->estado
            );
            
            if (!$this->deteccionService->update($deteccion, $prevalidacion->deteccion))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al actualizar el estado de la detección.', 'http_code' => 500);
            }

            // Insertar seguimiento de la detección.
            $deteccionSeguimiento = array(
                'deteccion' => $prevalidacion->deteccion,
                'usuario' => $prevalidacion->seguimiento->usuario,
                'estado' => $prevalidacion->seguimiento->estado,
                'observaciones' => $prevalidacion->seguimiento->observaciones
            );

            if (!$id = $this->deteccionSeguimientoService->insert($deteccionSeguimiento))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al registrar el seguimiento de la detección.', 'http_code' => 500);
            }

            // Insertar descarte de la detección.
            $deteccionDescarte = array(
                'deteccion' => $prevalidacion->deteccion,
                'tipo_descarte' => $prevalidacion->descarte->tipo_descarte,
                'motivo' => $prevalidacion->descarte->motivo,
                'usuario' => $prevalidacion->descarte->usuario,
                'estado' => $prevalidacion->descarte->estado,
                'observacion' => $prevalidacion->descarte->observacion
            );

            if (!$id = $this->deteccionDescarteService->insert($deteccionDescarte))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al registrar el descarte de la detección.', 'http_code' => 500);
            }

            DB::commit();
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return array('estado' => 'ERROR', 'mensaje' => 'Error al descartar la detección.', 'http_code' => 500);
        }

        return array('estado' => 'OK', 'mensaje' => 'OK', 'http_code' => 200);
    }
}