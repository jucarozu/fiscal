<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\DetalleDescarteAddForm;

use App\Models\DetalleDescarte;

class DetalleDescarteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $detalleDescarte = DetalleDescarte::all();
        return response()->json(['detallesDescarte' => $detallesDescarte]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $detalleDescarte = DetalleDescarte::find($id);
        return response()->json(['detalleDescarte' => $detalleDescarte]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\DeteccionSeguimientoAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(DetalleDescarteAddForm $request)
    {
        try
        {
        	// Se decodifica el JSON a un array con los datos de los registros de detalle del descarte de la detección.
            $detalles = json_decode(stripslashes($request->input('detalles')));

            foreach ($detalles as $detalle)
            {
	            // Se guardan los datos del detalle del descarte de la detección.
	            $detalleDescarte = new DetalleDescarte();
	            $detalleDescarte->deteccion = $detalle->deteccion;
	            $detalleDescarte->infra_deteccion = $detalle->infra_deteccion;
	            $detalleDescarte->motivo = $detalle->motivo;
	            $detalleDescarte->save();
	        }
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al registrar el detalle del descarte de la detección.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Detalle de descarte de detección registrado', 'detalleDescarte' => $detalleDescarte->detalle]);
    }
}
