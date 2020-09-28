<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\NotifDevuelta;
use App\Models\VTNotifDevuelta;

class NotifDevueltaController extends Controller
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
            $notifDevuelta = new NotifDevuelta();
            $notifDevuelta->notificacion = $request->input('notificacion');
            $notifDevuelta->empresa_mensajeria = $request->input('empresa_mensajeria');
            $notifDevuelta->numero_guia = $request->input('numero_guia');
            $notifDevuelta->fecha_novedad = $request->input('fecha_novedad');
            $notifDevuelta->causal_devolucion = $request->input('causal_devolucion');
            $notifDevuelta->observaciones = $request->input('observaciones');
            $notifDevuelta->usuario = $request->input('usuario');
            $notifDevuelta->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al marcar la notificación como Devuelta.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'La notificación ha sido marcada como Devuelta.']);
    }

    /**
     * Display the specified item by filters.
     *
     * @param  int  $notificacion
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($notificacion)
    {
        $notifDevueltas = VTNotifDevuelta::whereRaw($notificacion != 0 ? ('NOTIFICACION = '.$notificacion) : ('NOTIFICACION = NOTIFICACION'))
                                         ->orderBy('devuelta', 'asc')
                                         ->get();

        return response()->json(['notifDevueltas' => $notifDevueltas]);
    }
}
