<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\DireccionAddForm;
use App\Http\Requests\DireccionEditForm;

use App\Models\Direccion;
use App\Models\VTDireccion;

use App\Services\GeneralService;

class DireccionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $direcciones = VTDireccion::orderBy('direccion', 'desc')
                                  ->get();

        return response()->json(['direcciones' => $direcciones]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $direccion = VTDireccion::find($id);
        return response()->json(['direccion' => $direccion]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\DireccionAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(DireccionAddForm $request)
    {
        if ($request->ajax())
        {
            $direccion = new Direccion();
            $direccion->persona = $request->input('persona');
            $direccion->fuente = $request->input('fuente');
            $direccion->observaciones = $request->input('observaciones');
            $direccion->divipo = $request->input('divipo');
            $direccion->descripcion = strtoupper($request->input('descripcion'));
            $direccion->usuario = $request->input('usuario');
            
            if (!$direccion->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Dirección registrada', 'direccion' => $direccion]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\DireccionEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(DireccionEditForm $request, $id)
    {
        if ($request->ajax())
        {
            $direccion = Direccion::find($id);
            $direccion->fuente = $request->input('fuente');
            $direccion->observaciones = $request->input('observaciones');
            $direccion->divipo = $request->input('divipo');
            $direccion->descripcion = strtoupper($request->input('descripcion'));
            $direccion->fecha_registra = GeneralService::getFechaActual('Y-m-d h:i:s');
            
            if (!$direccion->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Dirección actualizada', 'direccion' => $direccion]);
        }
    }

    /**
     * Display the specified resource by filters.
     *
     * @param  int  $tipo_doc
     * @param  int  $numero_doc
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($tipo_doc, $numero_doc)
    {
        $direcciones = VTDireccion::whereRaw($tipo_doc != 0 ? ('TIPO_DOC = '.$tipo_doc) : ('TIPO_DOC = TIPO_DOC'))
                                  ->whereRaw($numero_doc != "0" ? ('NUMERO_DOC = '.$numero_doc) : ('NUMERO_DOC = NUMERO_DOC'))
                                  ->orderBy('nombres')
                                  ->orderBy('apellidos')
                                  ->orderBy('direccion', 'desc')
                                  ->get();

        return response()->json(['direcciones' => $direcciones]);
    }

    /**
     * Display the specified resource by persona.
     *
     * @param  int  $persona
     * @return \Illuminate\Http\Response
     */
    public function getByPersona($persona)
    {
        $direccion = VTDireccion::where('persona', $persona)
                                ->orderBy('direccion', 'desc')
                                ->get()
                                ->first();

        return response()->json(['direccion' => $direccion]);
    }

    public function getAllByPersona($persona)
    {
        $direcciones = VTDireccion::where('persona', $persona)
                                  ->orderBy('direccion', 'desc')
                                  ->get();

        return response()->json(['direcciones' => $direcciones]);
    }
}
