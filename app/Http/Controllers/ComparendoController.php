<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\VTComparendo;

use DB;

class ComparendoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $comparendos = VTComparendo::all();
        return response()->json(['comparendos' => $comparendos]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $comparendo = VTComparendo::find($id);
        return response()->json(['comparendo' => $comparendo]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try
        {
            // Obtener el consecutivo del rango más próximo de comparendos disponible.
            $numeroComparendo = $this->rangoComparendoService->getConsecutivo();

            if (is_null($numeroComparendo))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'No existen rangos disponibles para generar el comparendo.'], 500);
            }

            $parametros = array(
                $request->input('deteccion'),
                $numeroComparendo,
                $request->input('infractor'),
                $request->input('dir_direccion_infractor'),
                $request->input('dir_divipo_infractor'),
                $request->input('dir_descripcion_infractor'),
                $request->input('telefono_infractor'),
                $request->input('email_infractor'),
                $request->input('edad_infractor'),
                $request->input('lcond_numero'),
                $request->input('lcond_categoria'),
                $request->input('lcond_expedicion'),
                $request->input('lcond_vencimiento'),
                $request->input('lcond_organismo'),
                $request->input('agente'),
                $request->input('infraccion'),
                $request->input('fecha_deteccion'),
                $request->input('fecha_imposicion'),
                $request->input('divipo'),
                $request->input('direccion'),
                $request->input('longitud'),
                $request->input('latitud'),
                $request->input('placa_vehiculo'),
                $request->input('clase_vehiculo'),
                $request->input('servicio_vehiculo'),
                $request->input('organismo_vehiculo'),
                $request->input('licencia_vehiculo'),
                $request->input('propietario_vehiculo'),
                $request->input('polca'),
                $request->input('estado'),
                $request->input('etapa_proceso'),
                $request->input('inmovilizado'),
                $request->input('observaciones'),
                $request->input('nit_empresa_tte'),
                $request->input('nombre_empresa'),
                $request->input('tarjeta_operacion'),
                $request->input('modalidad'),
                $request->input('radio_accion'),
                $request->input('tipo_pasajero'),
                $request->input('usuario')
            );

            if (!DB::statement('CALL SP_INSERT_COMPARENDO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', $parametros))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al generar el comparendo para la infracción ' . $infraccion->codigo], 500);
            }
            
            return response()->json(['estado' => 'OK', 'mensaje' => 'Comparendo generado con éxito.']);
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al generar el comparendo.', 'excepcion' => $e->getMessage()], 500);
        }
    }

    public function sustituirConductor(Request $request)
    {
        try
        {
            $parametros = array(
                $request->input('comparendo'),
                $request->input('deteccion'),
                $request->input('numero_resolucion'),
                $request->input('fecha_resolucion'),
                $request->input('infractor'),
                $request->input('dir_divipo_infractor'),
                $request->input('dir_descripcion_infractor'),
                $request->input('telefono_infractor'),
                $request->input('email_infractor'),
                $request->input('edad_infractor'),
                $request->input('lcond_numero'),
                $request->input('lcond_categoria'),
                $request->input('lcond_expedicion'),
                $request->input('lcond_vencimiento'),
                $request->input('lcond_organismo'),
                $request->input('agente'),
                $request->input('infraccion'),
                $request->input('fecha_deteccion'),
                $request->input('fecha_imposicion'),
                $request->input('divipo'),
                $request->input('direccion'),
                $request->input('longitud'),
                $request->input('latitud'),
                $request->input('placa_vehiculo'),
                $request->input('clase_vehiculo'),
                $request->input('servicio_vehiculo'),
                $request->input('organismo_vehiculo'),
                $request->input('licencia_vehiculo'),
                $request->input('propietario_vehiculo'),
                $request->input('polca'),
                $request->input('estado'),
                $request->input('etapa_proceso'),
                $request->input('inmovilizado'),
                $request->input('observaciones'),
                $request->input('nit_empresa_tte'),
                $request->input('nombre_empresa'),
                $request->input('tarjeta_operacion'),
                $request->input('modalidad'),
                $request->input('radio_accion'),
                $request->input('tipo_pasajero'),
                $request->input('usuario'),
                $request->input('infractor_presente')
            );

            if (!DB::statement('CALL SP_SUSTITUIR_CONDUCTOR(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', $parametros))
            {
                return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al realizar la sustitución de conductor.'], 500);
            }
            
            return response()->json(['estado' => 'OK', 'mensaje' => 'Sustitución de conductor realizada con éxito.']);
        }
        catch(\Exception $e)
        {
            DB::rollBack();
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al realizar la sustitución de conductor.', 'excepcion' => $e->getMessage()], 500);
        }
    }

    public function getComparendosPorNotificar($infra_desde, $infra_hasta, $verifica_desde, $verifica_hasta, $detec_sitio, $detec_agente, $dir_divipo)
    {
        // Verificar si existen comparendos pendientes por notificar agrupados por agente de tránsito.
        $comparendosPorNotificar = VTComparendo::select('agente', 'agt_placa', 'agt_nombres_apellidos', 'agt_tiene_firma')
                                               ->whereRaw($infra_desde != '0' ? ('FECHA_DETECCION >= TO_DATE(\''.$infra_desde.' 00:00\')') : ('FECHA_DETECCION = FECHA_DETECCION'))
                                               ->whereRaw($infra_hasta != '0' ? ('FECHA_DETECCION <= TO_DATE(\''.$infra_hasta.' 23:59\')') : ('FECHA_DETECCION = FECHA_DETECCION'))
                                               ->whereRaw($verifica_desde != '0' ? ('FECHA_IMPOSICION >= TO_DATE(\''.$verifica_desde.' 00:00\')') : ('FECHA_IMPOSICION = FECHA_IMPOSICION'))
                                               ->whereRaw($verifica_hasta != '0' ? ('FECHA_IMPOSICION <= TO_DATE(\''.$verifica_hasta.' 23:59\')') : ('FECHA_IMPOSICION = FECHA_IMPOSICION'))
                                               ->where('estado', 1)
                                               ->where('impreso', 0)
                                               ->whereRaw($detec_sitio != '0' ? ('LOWER(DIRECCION) LIKE \'%'.strtolower($detec_sitio).'%\'') : ('DIRECCION = DIRECCION'))
                                               ->whereRaw($detec_agente != 0 ? ('AGENTE = '.$detec_agente) : ('AGENTE = AGENTE'))
                                               ->whereRaw($dir_divipo != 0 ? ('DIR_DIVIPO_INFRACTOR LIKE \''.$dir_divipo.'%\'') : ('DIR_DIVIPO_INFRACTOR = DIR_DIVIPO_INFRACTOR'))
                                               ->groupBy('agente', 'agt_placa', 'agt_nombres_apellidos', 'agt_tiene_firma')
                                               ->get();

        return response()->json(['comparendosPorNotificar' => $comparendosPorNotificar]);
    }

    public function getByFilters($numero, $infr_tipo_doc, $infr_numero_doc, $estado)
    {
        $comparendos = VTComparendo::whereRaw($numero != "0" ? ('NUMERO = '.$numero) : ('NUMERO = NUMERO'))
                                   ->whereRaw($infr_tipo_doc != 0 ? ('INFR_TIPO_DOC = '.$infr_tipo_doc) : ('INFR_TIPO_DOC = INFR_TIPO_DOC'))
                                   ->whereRaw($infr_numero_doc != "0" ? ('INFR_NUMERO_DOC = '.$infr_numero_doc) : ('INFR_NUMERO_DOC = INFR_NUMERO_DOC'))
                                   ->whereRaw($estado != 0 ? ('ESTADO = '.$estado) : ('ESTADO = ESTADO'))
                                   ->orderBy('numero', 'asc')
                                   ->get();

        return response()->json(['comparendos' => $comparendos]);
    }
}
