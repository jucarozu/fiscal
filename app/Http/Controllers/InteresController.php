<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\InteresAddForm;

use App\Models\Interes;
use App\Models\VTInteres;

class InteresController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $intereses = VTInteres::all();
        return response()->json(['intereses' => $intereses]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $interes = VTInteres::find($id);
        return response()->json(['interes' => $interes]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\InteresAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(InteresAddForm $request)
    {
        if ($request->ajax())
        {
            $desde = $request->input('desde');
            $hasta = $request->input('hasta');

            $validaFechas = Interes::whereRaw("DESDE BETWEEN TO_DATE('".$desde."','YYYY-MM-DD') AND TO_DATE('".$hasta."','YYYY-MM-DD') OR 
                                               HASTA BETWEEN TO_DATE('".$desde."','YYYY-MM-DD') AND TO_DATE('".$hasta."','YYYY-MM-DD')")
                                   ->get();

            if (count($validaFechas) > 0)
            {
                return response()->json(['error' => 'Ya existe una tasa de interés definida para este rango de fechas.'], 422);
            }

            $interes = new Interes();
            $interes->resolucion = $request->input('resolucion');
            $interes->fecha_resolucion = $request->input('fecha_resolucion');
            $interes->entidad = $request->input('entidad');
            $interes->desde = $request->input('desde');
            $interes->hasta = $request->input('hasta');
            $interes->tasa = $request->input('tasa');
            $interes->usuario = $request->input('usuario');
            
            if (!$interes->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Interés de mora registrado', 'interes' => $interes]);
        }
    }

    /**
     * Display the specified resource by filters.
     *
     * @param  int  $fecha_inicio
     * @param  int  $fecha_fin
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($fecha_inicio, $fecha_fin)
    {
        if ($fecha_inicio != "0" && $fecha_fin != "0")
        {
            $condicion = "DESDE BETWEEN TO_DATE('".$fecha_inicio."','YYYY-MM-DD') AND TO_DATE('".$fecha_fin."','YYYY-MM-DD') OR 
                          HASTA BETWEEN TO_DATE('".$fecha_inicio."','YYYY-MM-DD') AND TO_DATE('".$fecha_fin."','YYYY-MM-DD')";
        }
        else if ($fecha_inicio != "0" && $fecha_fin == "0")
        {
            $condicion = "DESDE >= TO_DATE('".$fecha_inicio."','YYYY-MM-DD') OR
                          HASTA >= TO_DATE('".$fecha_inicio."','YYYY-MM-DD')";
        }
        else if ($fecha_inicio == "0" && $fecha_fin != "0")
        {
            $condicion = "DESDE <= TO_DATE('".$fecha_fin."','YYYY-MM-DD') OR
                          HASTA <= TO_DATE('".$fecha_fin."','YYYY-MM-DD')";
        }
        else
        {
            $condicion = "INTERES = INTERES";
        }

        $intereses = VTInteres::whereRaw($condicion)
                              ->orderBy('fecha_resolucion')
                              ->get();

        return response()->json(['intereses' => $intereses]);
    }
}
