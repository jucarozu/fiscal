<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\FuenteAddForm;
use App\Http\Requests\FuenteEditForm;

use App\Models\Fuente;
use App\Models\VTFuente;

class FuenteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $i=0;

        $fuentes = VTFuente::all();

        foreach ($fuentes as $fuente)
        {
            $fuentes[$i]['ws'] = $fuente->ws == 1 ? true : false;
            $fuentes[$i]['ftp'] = $fuente->ftp == 1 ? true : false;

            $i++;
        }

        return response()->json(['fuentes' => $fuentes]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $fuente = VTFuente::find($id);
        
        $fuente['ws'] = $fuente->ws == 1 ? true : false;
        $fuente['ftp'] = $fuente->ftp == 1 ? true : false;

        return response()->json(['fuente' => $fuente]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\FuenteAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(FuenteAddForm $request)
    {
        if ($request->ajax())
        {
            $fuente = new Fuente();
            $fuente->tipo = $request->input('tipo');
            $fuente->nombre = $request->input('nombre');
            $fuente->proveedor = $request->input('proveedor');
            $fuente->desde = $request->input('desde');
            $fuente->hasta = $request->input('hasta');
            $fuente->latitud = $request->input('latitud');
            $fuente->longitud = $request->input('longitud');
            $fuente->referencia_ubicacion = $request->input('referencia_ubicacion');
            $fuente->observaciones = $request->input('observaciones');
            $fuente->ws = $request->input('ws');
            $fuente->ftp = $request->input('ftp');
            $fuente->usuario = $request->input('usuario');
            
            if (!$fuente->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Fuente de evidencia registrada', 'fuente' => $fuente]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\FuenteEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(FuenteEditForm $request, $id)
    {
        if ($request->ajax())
        {
            $fuente = Fuente::find($id);
            $fuente->desde = $request->input('desde');
            $fuente->hasta = $request->input('hasta');
            $fuente->longitud = $request->input('longitud');
            $fuente->latitud = $request->input('latitud');
            $fuente->referencia_ubicacion = $request->input('referencia_ubicacion');
            $fuente->observaciones = $request->input('observaciones');
            $fuente->ws = $request->input('ws');
            $fuente->ftp = $request->input('ftp');
            
            if (!$fuente->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Fuente de evidencia actualizada', 'fuente' => $fuente]);
        }
    }

    /**
     * Display the specified resource by filters.
     *
     * @param  int  $tipo
     * @param  int  $nombre
     * @param  int  $prov_nombre
     * @param  int  $referencia_ubicacion
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($tipo, $nombre, $prov_nombre, $referencia_ubicacion)
    {
        $i=0;

        $fuentes = VTFuente::whereRaw($tipo != 0 ? ('TIPO = '.$tipo) : ('TIPO = TIPO'))
                           ->whereRaw($nombre != "0" ? ('LOWER(NOMBRE) LIKE \'%'.strtolower($nombre).'%\'') : ('NOMBRE = NOMBRE'))
                           ->whereRaw($prov_nombre != "0" ? ('LOWER(PROV_NOMBRE) LIKE \'%'.strtolower($prov_nombre).'%\'') : ('PROV_NOMBRE = PROV_NOMBRE'))
                           ->whereRaw($referencia_ubicacion != "0" ? ('LOWER(REFERENCIA_UBICACION) LIKE \'%'.strtolower($referencia_ubicacion).'%\'') : ('REFERENCIA_UBICACION = REFERENCIA_UBICACION'))
                           ->orderBy('nombre')
                           ->get();

        foreach ($fuentes as $fuente)
        {
            $fuentes[$i]['ws'] = $fuente->ws == 1 ? true : false;
            $fuentes[$i]['ftp'] = $fuente->ftp == 1 ? true : false;

            $i++;
        }

        return response()->json(['fuentes' => $fuentes]);
    }
}
