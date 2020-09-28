<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\NotifSeguimiento;
use App\Models\VTNotifSeguimiento;

class NotifSeguimientoController extends Controller
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
            $notifSeguimiento = new NotifSeguimiento();
            $notifSeguimiento->notificacion = $request->input('notificacion');
            $notifSeguimiento->estado = $request->input('estado');
            $notifSeguimiento->usuario = $request->input('usuario');
            $notifSeguimiento->observaciones = $request->input('observaciones');
            $notifSeguimiento->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al guardar el seguimiento de notificación.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'Seguimiento de notificación registrado.']);
    }

    /**
     * Display the specified item by filters.
     *
     * @param  int  $notificacion
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($notificacion)
    {
        $notifSeguimientos = VTNotifSeguimiento::whereRaw($notificacion != 0 ? ('NOTIFICACION = '.$notificacion) : ('NOTIFICACION = NOTIFICACION'))
                                               ->orderBy('seguimiento', 'asc')
                                               ->get();

        return response()->json(['notifSeguimientos' => $notifSeguimientos]);
    }
}
