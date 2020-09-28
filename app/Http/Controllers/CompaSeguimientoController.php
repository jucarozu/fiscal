<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\CompaSeguimiento;
use App\Models\Consecutivo;

use App\Models\VTCompaSeguimiento;

use App\Services\GeneralService;

class CompaSeguimientoController extends Controller
{
    public function index()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\UserForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try
        {
            // Obtener número de resolución.
            if (is_null($request->input('numero')))
            {
                $consecutivo = Consecutivo::where('tipo', 'RESOLUCION_SANCION')->first();
                $numeroResolucion = $consecutivo->prefijo + $consecutivo->vigencia + $consecutivo->numero;
            }
            else
            {
                $numeroResolucion = $request->input('numero');
            }

            // Obtener funcionario responsable de la sanción de comparendos.
            $responsable = $this->responsableService->getByTipoActo(1);

            $compaSeguimiento = new CompaSeguimiento();
            $compaSeguimiento->comparendo = $request->input('comparendo');
            $compaSeguimiento->fecha_inicia = GeneralService::getFechaActual('Y-m-d');
            $compaSeguimiento->funcionario = $request->input('funcionario');
            $compaSeguimiento->estado = $request->input('estado');
            $compaSeguimiento->usuario = $request->input('usuario');
            $compaSeguimiento->observaciones = $request->input('observaciones');
            $compaSeguimiento->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al guardar el seguimiento de comparendo.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Seguimiento de comparendo registrado.']);
    }

    /**
     * Display the specified item by filters.
     *
     * @param  int  $notificacion
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($comparendo)
    {
        $compaSeguimientos = VTCompaSeguimiento::whereRaw($comparendo != 0 ? ('COMPARENDO = '.$comparendo) : ('COMPARENDO = COMPARENDO'))
                                               ->orderBy('seguimiento', 'asc')
                                               ->get();

        return response()->json(['compaSeguimientos' => $compaSeguimientos]);
    }
}