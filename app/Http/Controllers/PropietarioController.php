<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\PropietarioAddForm;
use App\Http\Requests\PropietarioEditForm;

use App\Models\Propietario;
use App\Models\VTPropietario;

use App\Services\GeneralService;

class PropietarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $propietarios = VTPropietario::orderBy('desde')
                                     ->get();

        return response()->json(['propietarios' => $propietarios]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $propietario = VTPropietario::find($id);
        return response()->json(['propietario' => $propietario]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\PropietarioAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PropietarioAddForm $request)
    {
        $placa = $request->input('placa');
        
        $valid_desde = strtotime($request->input('desde'));
        $valid_hasta = !empty($request->input('hasta')) ? strtotime($request->input('hasta')) : null;

        // Validar si existen propietarios registrados para el vehículo en el rango de fechas especificado.
        $propietarios = Propietario::where('placa', $placa)
                                   ->orderBy('desde')
                                   ->get();

        $cruceFechas = false;

        foreach ($propietarios as $prop)
        {
            $base_desde = strtotime($prop->desde);
            $base_hasta = !empty($prop->hasta) ? strtotime($prop->hasta) : null;

            if ($valid_desde == null || $base_desde == null)
            {
                $cruceFechas = true;
                break;
            }
            
            if ($base_desde <= $valid_desde && ($base_hasta == null || $base_hasta >= $valid_desde))
            {
                $cruceFechas = true;
                break;
            }
            
            if ($valid_hasta != null)
            {
                if ($base_desde <= $valid_hasta && ($base_hasta == null || $base_hasta >= $valid_hasta))
                {
                    $cruceFechas = true;
                    break;
                }
            }
            
            if ($valid_desde <= $base_desde && ($valid_hasta == null || $valid_hasta >= $base_desde))
            {
                $cruceFechas = true;
                break;
            }
            
            if ($base_hasta != null)
            {
                if ($valid_desde <= $base_hasta && ($valid_hasta == null || $valid_hasta >= $base_hasta))
                {
                    $cruceFechas = true;
                    break;
                }
            }
        }

        if ($cruceFechas)
        {
            return response()->json(['error' => 'Ya existe un propietario registrado para el vehículo de placas '.$placa.' en este rango de fechas.'], 422);
        }

        // Registrar el propietario asociado al vehículo especificado.
        if ($request->ajax())
        {
            $propietario = new Propietario();
            $propietario->placa = $request->input('placa');
            $propietario->persona = $request->input('persona');
            $propietario->fuente = $request->input('fuente');
            $propietario->tipo = $request->input('tipo');
            $propietario->locatario = $request->input('locatario');
            $propietario->desde = $request->input('desde');
            $propietario->hasta = $request->input('hasta');
            $propietario->usuario = $request->input('usuario');
            
            if (!$propietario->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Propietario registrado', 'propietario' => $propietario]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\PropietarioEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(PropietarioEditForm $request, $id)
    {
        $persona = $request->input('persona');
        $placa = $request->input('placa');
        $desde = $request->input('desde');
        $hasta = $request->input('hasta');

        if (!empty($hasta))
        {
            $condicion = "(DESDE BETWEEN TO_DATE('".$desde."','YYYY-MM-DD') AND TO_DATE('".$hasta."','YYYY-MM-DD') OR 
                           HASTA BETWEEN TO_DATE('".$desde."','YYYY-MM-DD') AND TO_DATE('".$hasta."','YYYY-MM-DD'))";
        }
        else
        {
            $condicion = "(DESDE >= TO_DATE('".$desde."','YYYY-MM-DD') OR
                           HASTA IS NULL)";
        }

        $validaFechas = Propietario::where('persona', '<>', $persona)
                                   ->where('placa', $placa)
                                   ->whereRaw($condicion)
                                   ->get();

        if (count($validaFechas) > 0)
        {
            return response()->json(['error' => 'Ya existe un propietario registrado para el vehículo de placas '.$placa.' en este rango de fechas.'], 422);
        }

        if ($request->ajax())
        {
            $propietario = Propietario::find($id);
            $propietario->persona = $request->input('persona');
            $propietario->fuente = $request->input('fuente');
            $propietario->tipo = $request->input('tipo');
            $propietario->locatario = $request->input('locatario');
            $propietario->desde = $request->input('desde');
            $propietario->hasta = $request->input('hasta');
            $propietario->fecha_registra = GeneralService::getFechaActual('Y-m-d h:i:s');
            
            if (!$propietario->save())
            {
                return response()->json(['error' => 'internal_error'], 500);
            }

            return response()->json(['mensaje' => 'Propietario actualizado', 'propietario' => $propietario]);
        }
    }

    /**
     * Display the specified resource by filters.
     *
     * @param  int  $placa
     * @param  int  $tipo_doc
     * @param  int  $numero_doc
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($placa, $tipo_doc, $numero_doc)
    {
        // Obtener los propietarios con información actualizada.        
        $propietarios = VTPropietario::whereRaw($placa != "0" ? ('LOWER(PLACA) = \''.strtolower($placa).'\'') : ('PLACA = PLACA'))
                                     ->whereRaw($tipo_doc != 0 ? ('TIPO_DOC = '.$tipo_doc) : ('TIPO_DOC = TIPO_DOC'))
                                     ->whereRaw($numero_doc != "0" ? ('NUMERO_DOC = '.$numero_doc) : ('NUMERO_DOC = NUMERO_DOC'))
                                     ->orderBy('placa')
                                     ->orderBy('desde', 'DESC')
                                     ->get();

        return response()->json(['propietarios' => $propietarios]);
    }
}
