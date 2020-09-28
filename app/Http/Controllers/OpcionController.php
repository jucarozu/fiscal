<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\Opcion;
use App\Models\VTModuloOpcion;

class OpcionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $opciones = VTModuloOpcion::select("modulo", "modulo_nombre", "opcion", "opcion_nombre")
                                  ->orderBy("modulo_nombre")
                                  ->orderBy("opcion_nombre")
                                  ->get();
		
		for ($i=0; $i < count($opciones); $i++)
        {
            $opciones[$i]['consulta'] = false;
            $opciones[$i]['adiciona'] = false;
            $opciones[$i]['edita'] = false;
            $opciones[$i]['elimina'] = false;
            $opciones[$i]['ejecuta'] = false;
        }

		return response()->json(['opciones' => $opciones]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $opcion = VTModuloOpcion::find($id);
        return response()->json(['opcion' => $opcion]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\UserForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // return response()->json(['request' => $request->input()]);

        $opcion = new Opcion();
        $opcion->opcion = $request->input('opcion');
        $opcion->modulo = $request->input('modulo');
        $opcion->nombre = $request->input('nombre');
        $opcion->enlace = $request->input('enlace');
        $opcion->tipo = $request->input('tipo');
        $opcion->estado = $request->input('estado');
        
        if (!$opcion->save())
        {
            return response()->json(['error' => 'internal_error'], 500);
        }

        return response()->json(['mensaje' => 'Opción registrada', 'opcion' => $opcion]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UserForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if ($request->ajax())
        {
            return response()->json(['message' => 'Opción actualizada']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $opcion = Opcion::find($id);
        $opcion->delete();

        return response()->json(['message' => 'Opción eliminada']);
    }
}
