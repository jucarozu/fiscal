<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\InfraccionAddForm;
use App\Http\Requests\InfraccionEditForm;

use App\Models\Infraccion;
use App\Models\VTInfraccion;

class InfraccionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $i=0;

        $infracciones = VTInfraccion::orderBy('codigo')
                                    ->get();

        foreach ($infracciones as $infraccion)
        {
            $infracciones[$i]['reporta_simit'] = $infraccion->reporta_simit == 1 ? true : false;
            $infracciones[$i]['sancion_auto'] = $infraccion->sancion_auto == 1 ? true : false;

            $infracciones[$i]['tiene_infraccion'] = false;
            $infracciones[$i]['observacion'] = "";

            $i++;
        }

        return response()->json(['infracciones' => $infracciones]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $infraccion = VTInfraccion::find($id);

        $infraccion['reporta_simit'] = $infraccion->reporta_simit == 1 ? true : false;
        $infraccion['sancion_auto'] = $infraccion->sancion_auto == 1 ? true : false;

        return response()->json(['infraccion' => $infraccion]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\InfraccionAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(InfraccionAddForm $request)
    {
        if ($request->ajax())
        {
            $infraccion = new Infraccion();
            $infraccion->codigo = $request->input('codigo');
            $infraccion->nombre_corto = $request->input('nombre_corto');
            $infraccion->descripcion = $request->input('descripcion');
            $infraccion->salarios_dia = $request->input('salarios_dia');
            $infraccion->reporta_simit = $request->input('reporta_simit');
            $infraccion->sancion_auto = $request->input('sancion_auto');
            $infraccion->usuario = $request->input('usuario');
            
            if (!$infraccion->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Infracción registrada', 'infraccion' => $infraccion]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\InfraccionEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(InfraccionEditForm $request, $id)
    {
        if ($request->ajax())
        {
            $infraccion = Infraccion::find($id);
            $infraccion->descripcion = $request->input('descripcion');
            $infraccion->salarios_dia = $request->input('salarios_dia');
            $infraccion->reporta_simit = $request->input('reporta_simit');
            $infraccion->sancion_auto = $request->input('sancion_auto');
            
            if (!$infraccion->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Infracción actualizada', 'infraccion' => $infraccion]);
        }
    }

    /**
     * Display the specified resource by filters.
     *
     * @param  int  $codigo
     * @param  int  $nombre
     * @param  int  $descripcion
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($codigo, $nombre_corto, $descripcion)
    {
        $i=0;

        $infracciones = VTInfraccion::whereRaw($codigo != 0 ? ('CODIGO = '.$codigo) : ('CODIGO = CODIGO'))
                                    ->whereRaw($nombre_corto != "0" ? ('LOWER(NOMBRE_CORTO) LIKE \'%'.strtolower($nombre_corto).'%\'') : ('NOMBRE_CORTO = NOMBRE_CORTO'))
                                    ->whereRaw($descripcion != "0" ? ('LOWER(DESCRIPCION) LIKE \'%'.strtolower($descripcion).'%\'') : ('DESCRIPCION = DESCRIPCION'))
                                    ->orderBy('codigo')
                                    ->get();

        foreach ($infracciones as $infraccion)
        {
            $infracciones[$i]['reporta_simit'] = $infraccion->reporta_simit == 1 ? true : false;
            $infracciones[$i]['sancion_auto'] = $infraccion->sancion_auto == 1 ? true : false;
            $i++;
        }

        return response()->json(['infracciones' => $infracciones]);
    }

    /**
     * Display the specified resource by codigo.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function getByCodigo($codigo)
    {
        $infraccion = VTInfraccion::where('codigo', $codigo)
                                  ->get()
                                  ->first();

        $infraccion['reporta_simit'] = $infraccion->reporta_simit == 1 ? true : false;
        $infraccion['sancion_auto'] = $infraccion->sancion_auto == 1 ? true : false;

        return $infraccion;
    }
}
