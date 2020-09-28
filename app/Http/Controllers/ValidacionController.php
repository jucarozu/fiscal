<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\VTDeteccion;

use App\Services\ValidacionService;

class ValidacionController extends Controller
{
    protected $validacionService;

    public function __construct(ValidacionService $validacionService)
    {
        $this->validacionService = $validacionService;
    }

    /**
     * Display the specified resource by filters.
     *
     * @return \Illuminate\Http\Response
     */
    public function consultar($fuente)
    {
        // Obtener las detecciones en estado Prevalidada y con información actualizada de propietario y dirección.
        $detecciones = VTDeteccion::where("estado", 3)
                                  ->whereRaw("PROP_DIAS_REGISTRO <= ADMIN_VALOR_VARIABLE('VIGENCIA_INFO_VEHICULO')")
                                  ->whereRaw("DIR_DIAS_REGISTRO <= ADMIN_VALOR_VARIABLE('VIGENCIA_INFO_VEHICULO')")
                                  ->whereRaw("(FECHA BETWEEN PROP_DESDE AND PROP_HASTA OR FECHA >= PROP_DESDE AND PROP_HASTA IS NULL)")
                                  ->whereRaw("TIPO_VEHICULO IS NOT NULL")
                                  ->whereRaw("SERVICIO IS NOT NULL")
                                  ->whereRaw($fuente != 0 ? ('FUENTE = '.$fuente) : ('FUENTE = FUENTE'))
                                  ->orderBy("deteccion")
                                  ->get();

        return response()->json(['detecciones' => $detecciones]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function validar(Request $request)
    {
        try
        {
            // Decodificar el JSON a un array para obtener los datos de la validación.
            $validacion = json_decode(stripslashes($request->input('validacion')));

            // Llamar al servicio para la validación de la detección.
            $resultado = $this->validacionService->validar($validacion);
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al validar la detección.'], 500);
        }

        return response()->json(['estado' => $resultado['estado'], 'mensaje' => $resultado['mensaje']], $resultado['http_code']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function descartar(Request $request)
    {
        try
        {
            // Decodificar el JSON a un array para obtener los datos de la validación.
            $validacion = json_decode(stripslashes($request->input('validacion')));

            // Llamar al servicio para el descarte de la detección.
            $resultado = $this->validacionService->descartar($validacion);
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al descartar la detección.'], 500);
        }

        return response()->json(['estado' => $resultado['estado'], 'mensaje' => $resultado['mensaje']], $resultado['http_code']);
    }
}
