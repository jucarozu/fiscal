<?php

namespace App\Services;

use App\Services\DeteccionService;
use App\Services\DeteccionSeguimientoService;
use App\Services\RangoComparendoService;
use App\Services\ComparendoService;
use App\Services\DeteccionDescarteService;
use App\Services\DetalleDescarteService;

use DB;

class ValidacionService
{
    protected $deteccionService;
    protected $deteccionSeguimientoService;
    protected $rangoComparendoService;
    protected $comparendoService;
    protected $deteccionDescarteService;
    protected $detalleDescarteService;

    public function __construct(DeteccionService $deteccionService,
                                DeteccionSeguimientoService $deteccionSeguimientoService,
                                RangoComparendoService $rangoComparendoService,
                                ComparendoService $comparendoService,
                                DeteccionDescarteService $deteccionDescarteService,
                                DetalleDescarteService $detalleDescarteService)
    {
        $this->deteccionService = $deteccionService;
        $this->deteccionSeguimientoService = $deteccionSeguimientoService;
        $this->rangoComparendoService = $rangoComparendoService;
        $this->comparendoService = $comparendoService;
        $this->deteccionDescarteService = $deteccionDescarteService;
        $this->detalleDescarteService = $detalleDescarteService;
    }

    public function validar($validacion)
    {
        try
        {
            DB::beginTransaction();

            // Actualizar estado de la detección.
            $deteccion = array(
                'estado' => $validacion->estado
            );
            
            if (!$this->deteccionService->update($deteccion, $validacion->deteccion))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al actualizar el estado de la detección.', 'http_code' => 500);
            }

            // Insertar seguimiento de la detección.
            $deteccionSeguimiento = array(
                'deteccion' => $validacion->deteccion,
                'usuario' => $validacion->seguimiento->usuario,
                'estado' => $validacion->seguimiento->estado,
                'observaciones' => $validacion->seguimiento->observaciones
            );

            if (!$id = $this->deteccionSeguimientoService->insert($deteccionSeguimiento))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al registrar el seguimiento de la detección.', 'http_code' => 500);
            }

            // Generar un comparendo por cada infracción validada.
            $infracciones = $validacion->comparendo->infracciones;

            foreach ($infracciones as $infraccion)
            {
                // Obtener el consecutivo del rango más próximo de comparendos disponible.
                $numero = $this->rangoComparendoService->getConsecutivo();

                if (is_null($numero))
                {
                    DB::rollBack();
                    return array('estado' => 'ERROR', 'mensaje' => 'No existen rangos disponibles para generar el comparendo.', 'http_code' => 404);
                }

                $comparendo = array(
                    'deteccion' => $validacion->deteccion,
                    'numero' => $numero,
                    'infractor' => $validacion->comparendo->infractor,
                    'dir_direccion_infractor' => $validacion->comparendo->dir_direccion_infractor, 
                    'dir_divipo_infractor' => $validacion->comparendo->dir_divipo_infractor, 
                    'dir_descripcion_infractor' => $validacion->comparendo->dir_descripcion_infractor, 
                    'telefono_infractor' => $validacion->comparendo->telefono_infractor, 
                    'email_infractor' => $validacion->comparendo->email_infractor, 
                    'edad_infractor' => $validacion->comparendo->edad_infractor,
                    'lcond_numero' => $validacion->comparendo->lcond_numero, 
                    'lcond_categoria' => $validacion->comparendo->lcond_categoria, 
                    'lcond_expedicion' => $validacion->comparendo->lcond_expedicion, 
                    'lcond_vencimiento' => $validacion->comparendo->lcond_vencimiento, 
                    'lcond_organismo' => $validacion->comparendo->lcond_organismo,
                    'agente' => $validacion->comparendo->agente, 
                    'infraccion' => $infraccion->infraccion, 
                    'fecha_deteccion' => $validacion->comparendo->fecha_deteccion, 
                    'fecha_imposicion' => $validacion->comparendo->fecha_imposicion, 
                    'divipo' => $validacion->comparendo->divipo, 
                    'direccion' => $validacion->comparendo->direccion, 
                    'longitud' => $validacion->comparendo->longitud, 
                    'latitud' => $validacion->comparendo->latitud,
                    'placa_vehiculo' => $validacion->comparendo->placa_vehiculo, 
                    'clase_vehiculo' => $validacion->comparendo->clase_vehiculo, 
                    'servicio_vehiculo' => $validacion->comparendo->servicio_vehiculo, 
                    'organismo_vehiculo' => $validacion->comparendo->organismo_vehiculo, 
                    'licencia_vehiculo' => $validacion->comparendo->licencia_vehiculo, 
                    'propietario_vehiculo' => $validacion->comparendo->propietario_vehiculo,
                    'polca' => $validacion->comparendo->polca, 
                    'estado' => $validacion->comparendo->estado, 
                    'etapa_proceso' => $validacion->comparendo->etapa_proceso, 
                    'inmovilizado' => $validacion->comparendo->inmovilizado, 
                    'observaciones' => $validacion->comparendo->observaciones,
                    'nit_empresa_tte' => $validacion->comparendo->nit_empresa_tte, 
                    'nombre_empresa' => $validacion->comparendo->nombre_empresa, 
                    'tarjeta_operacion' => $validacion->comparendo->tarjeta_operacion, 
                    'modalidad' => $validacion->comparendo->modalidad, 
                    'radio_accion' => $validacion->comparendo->radio_accion, 
                    'tipo_pasajero' => $validacion->comparendo->tipo_pasajero, 
                    'usuario' => $validacion->comparendo->usuario
                );

                if (!$this->comparendoService->insert($comparendo))
                {
                    DB::rollBack();
                    return array('estado' => 'ERROR', 'mensaje' => 'Error al generar el comparendo para la infracción ' . $infraccion->codigo . '.', 'http_code' => 500);
                }
            }

            // Insertar los detalles de las infracciones descartadas.
            $detallesDescarte = $validacion->detallesDescarte;

            foreach ($detallesDescarte as $detalle)
            {
	            $detalleDescarte = array(
                    'deteccion' => $validacion->deteccion,
                    'infra_deteccion' => $detalle->infra_deteccion,
                    'motivo' => $detalle->motivo
                );

                if (!$id = $this->detalleDescarteService->insert($detalleDescarte))
                {
                    DB::rollBack();
                    return array('estado' => 'ERROR', 'mensaje' => 'Error al registrar el detalle del descarte de la infracción ' . $detalle->codigo . '.', 'http_code' => 500);
                }
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

    public function descartar($validacion)
    {
        try
        {
            DB::beginTransaction();

            // Actualizar estado de la detección.
            $deteccion = array(
                'estado' => $validacion->estado
            );
            
            if (!$this->deteccionService->update($deteccion, $validacion->deteccion))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al actualizar el estado de la detección.', 'http_code' => 500);
            }

            // Insertar seguimiento de la detección.
            $deteccionSeguimiento = array(
                'deteccion' => $validacion->deteccion,
                'usuario' => $validacion->seguimiento->usuario,
                'estado' => $validacion->seguimiento->estado,
                'observaciones' => $validacion->seguimiento->observaciones
            );

            if (!$id = $this->deteccionSeguimientoService->insert($deteccionSeguimiento))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al registrar el seguimiento de la detección.', 'http_code' => 500);
            }

            // Insertar descarte de la detección.
            $deteccionDescarte = array(
                'deteccion' => $validacion->deteccion,
                'tipo_descarte' => $validacion->descarte->tipo_descarte,
                'motivo' => $validacion->descarte->motivo,
                'usuario' => $validacion->descarte->usuario,
                'estado' => $validacion->descarte->estado,
                'observacion' => $validacion->descarte->observacion
            );

            if (!$id = $this->deteccionDescarteService->insert($deteccionDescarte))
            {
                DB::rollBack();
                return array('estado' => 'ERROR', 'mensaje' => 'Error al registrar el descarte de la detección.', 'http_code' => 500);
            }

            // Insertar los detalles de las infracciones descartadas.
            $detallesDescarte = $validacion->detallesDescarte;

            foreach ($detallesDescarte as $detalle)
            {
	            $detalleDescarte = array(
                    'deteccion' => $validacion->deteccion,
                    'infra_deteccion' => $detalle->infra_deteccion,
                    'motivo' => $detalle->motivo
                );

                if (!$id = $this->detalleDescarteService->insert($detalleDescarte))
                {
                    DB::rollBack();
                    return array('estado' => 'ERROR', 'mensaje' => 'Error al registrar el detalle del descarte de la infracción ' . $detalle->codigo . '.', 'http_code' => 500);
                }
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