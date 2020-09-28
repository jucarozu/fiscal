<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\InfraDeteccionAddForm;

use App\Models\InfraDeteccion;
use App\Models\VTInfraDeteccion;

use App\Http\Controllers\InfraccionController;

use Storage;

class InfraDeteccionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $infraccionController = new InfraccionController();
        $infraccion = $infraccionController->getByCodigo("A08")->infraccion;
        return $infraccion;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $infra_deteccion = InfraDeteccion::find($id);
        return response()->json(['infraccion' => $infra_deteccion]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\InfraDeteccionAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try
        {
            $infraccionController = new InfraccionController();
            $infraccion = $infraccionController->getByCodigo($request->input('codigo'))->infraccion;

            $infraDeteccion = InfraDeteccion::where('deteccion', $request->input('deteccion'))
                                            ->where('infraccion', $infraccion)
                                            ->first();

            if (!is_null($infraDeteccion))
            {
                return response()->json(['La infracción ya se encuentra asociada a la detección.'], 422);
            }

            $infraDeteccion = new InfraDeteccion();
            $infraDeteccion->deteccion = $request->input('deteccion');
            $infraDeteccion->infraccion = $infraccion;            
            $infraDeteccion->observacion = $request->input('observacion');
            $infraDeteccion->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar infracción asociada a la detección ' . $request->input('deteccion')], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Infracción registrada', 'infraDeteccion' => $infraDeteccion->infra_deteccion]);
    }

    /**
     * Delete the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!InfraDeteccion::find($id)->delete())
        {
            return response()->json(['error' => 'Error al eliminar la infracción'], 500);
        }

        return response()->json(['mensaje' => 'Infracción eliminada']);
    }

    /**
     * Display a listing of the parameters by resource.
     *
     * @param  int  $deteccion
     * @return \Illuminate\Http\Response
     */
    public function getByDeteccion($deteccion)
    {
        $infraDetecciones = VTInfraDeteccion::where('deteccion', $deteccion)
                                            ->orderBy('infraccion')
                                            ->get();

        return response()->json(['infraDetecciones' => $infraDetecciones]);
    }

    public function rollback($infra_deteccion)
    {
        InfraDeteccion::find($infra_deteccion->infra_deteccion)->delete();
    }
}