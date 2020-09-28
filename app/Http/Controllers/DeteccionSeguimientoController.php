<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\DeteccionSeguimientoAddForm;

use App\Models\DeteccionSeguimiento;

class DeteccionSeguimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $deteccionesSeguimiento = DeteccionSeguimiento::all();
        return response()->json(['deteccionesSeguimiento' => $deteccionesSeguimiento]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $deteccionSeguimiento = DeteccionSeguimiento::find($id);
        return response()->json(['deteccionSeguimiento' => $deteccionSeguimiento]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\DeteccionSeguimientoAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(DeteccionSeguimientoAddForm $request)
    {
        try
        {
            // Se guardan los datos del seguimiento de la detección.
            $deteccionSeguimiento = new DeteccionSeguimiento();
            $deteccionSeguimiento->deteccion = $request->input('deteccion');
            $deteccionSeguimiento->usuario = $request->input('usuario');
            $deteccionSeguimiento->estado = $request->input('estado');
            $deteccionSeguimiento->observaciones = $request->input('observaciones');
            $deteccionSeguimiento->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar el seguimiento de la detección.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Seguimiento de detección registrado', 'deteccion' => $deteccionSeguimiento->seguimiento]);
    }

    /**
     * Display the specified resource by filters.
     *
     * @param  int  $deteccion
     * @param  int  $estado
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($deteccion, $estado)
    {
        $deteccionSeguimiento = DeteccionSeguimiento::whereRaw($deteccion != 0 ? ('DETECCION = '.$deteccion) : ('DETECCION = DETECCION'))
                                                    ->whereRaw($estado != 0 ? ('ESTADO = '.$estado) : ('ESTADO = ESTADO'))
                                                    ->orderBy('seguimiento', 'desc')
                                                    ->get()
                                                    ->first();

        return response()->json(['deteccionSeguimiento' => $deteccionSeguimiento]);
    }
}
