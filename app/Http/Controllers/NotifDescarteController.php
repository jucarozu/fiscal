<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\NotifDescarte;
use App\Models\VTNotifDescarte;

class NotifDescarteController extends Controller
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
            $notifDescarte = new NotifDescarte();
            $notifDescarte->notificacion = $request->input('notificacion');
            $notifDescarte->empresa_mensajeria = $request->input('empresa_mensajeria');
            $notifDescarte->fecha_descarte = $request->input('fecha_descarte');
            $notifDescarte->causal_descarte = $request->input('causal_descarte');
            $notifDescarte->observaciones = $request->input('observaciones');
            $notifDescarte->usuario = $request->input('usuario');
            $notifDescarte->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al marcar la notificación como Descartada.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'La notificación ha sido marcada como Descartada.']);
    }

    /**
     * Display the specified item by filters.
     *
     * @param  int  $notificacion
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($notificacion)
    {
        $notifDescartadas = VTNotifDescarte::whereRaw($notificacion != 0 ? ('NOTIFICACION = '.$notificacion) : ('NOTIFICACION = NOTIFICACION'))
                                            ->orderBy('descarte', 'asc')
                                            ->get();

        return response()->json(['notifDescartadas' => $notifDescartadas]);
    }
}
