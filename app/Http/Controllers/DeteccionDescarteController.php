<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\DeteccionDescarteAddForm;

use App\Models\DeteccionDescarte;

class DeteccionDescarteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $deteccionesDescarte = DeteccionDescarte::all();
        return response()->json(['deteccionesDescarte' => $deteccionesDescarte]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $deteccionDescarte = DeteccionDescarte::find($id);
        return response()->json(['deteccionDescarte' => $deteccionDescarte]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\DeteccionSeguimientoAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(DeteccionDescarteAddForm $request)
    {
        try
        {
            // Se guardan los datos del descarte de la detección.
            $deteccionDescarte = new DeteccionDescarte();
            $deteccionDescarte->deteccion = $request->input('deteccion');
            $deteccionDescarte->tipo_descarte = $request->input('tipo_descarte');
            $deteccionDescarte->motivo = $request->input('motivo');
            $deteccionDescarte->usuario = $request->input('usuario');
            $deteccionDescarte->observacion = $request->input('observacion');
            $deteccionDescarte->estado = $request->input('estado');
            $deteccionDescarte->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar el descarte de la detección.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Descarte de detección registrado', 'descarte' => $deteccionDescarte->descarte]);
    }
}
