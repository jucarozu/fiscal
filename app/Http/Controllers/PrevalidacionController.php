<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\VTDeteccion;

use App\Services\PrevalidacionService;

class PrevalidacionController extends Controller
{
    protected $prevalidacionService;

    public function __construct(PrevalidacionService $prevalidacionService)
    {
        $this->prevalidacionService = $prevalidacionService;
    }

    /**
     * Display the specified resource by filters.
     *
     * @return \Illuminate\Http\Response
     */
    public function consultar($fuente)
    {
        // Obtener las detecciones en estado Pendiente.
        $detecciones = VTDeteccion::where("estado", 1)
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
            // Decodificar el JSON a un array para obtener los datos de la prevalidación.
            $prevalidacion = json_decode(stripslashes($request->input('prevalidacion')));

            // Llamar al servicio para la prevalidación de la detección.
            $resultado = $this->prevalidacionService->validar($prevalidacion);
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
            // Decodificar el JSON a un array para obtener los datos de la prevalidación.
            $prevalidacion = json_decode(stripslashes($request->input('prevalidacion')));

            // Llamar al servicio para el descarte de la detección.
            $resultado = $this->prevalidacionService->descartar($prevalidacion);
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al descartar la detección.'], 500);
        }

        return response()->json(['estado' => $resultado['estado'], 'mensaje' => $resultado['mensaje']], $resultado['http_code']);
    }
}
