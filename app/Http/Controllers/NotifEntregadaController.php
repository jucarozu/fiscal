<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\NotifEntregada;
use App\Models\VTNotifEntregada;

class NotifEntregadaController extends Controller
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
            $notifEntregada = new NotifEntregada();
            $notifEntregada->notificacion = $request->input('notificacion');
            $notifEntregada->empresa_mensajeria = $request->input('empresa_mensajeria');
            $notifEntregada->numero_guia = $request->input('numero_guia');
            $notifEntregada->fecha_entrega = $request->input('fecha_entrega');
            $notifEntregada->nombre_recibe = $request->input('nombre_recibe');
            $notifEntregada->observaciones = $request->input('observaciones');
            $notifEntregada->usuario = $request->input('usuario');
            $notifEntregada->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al marcar la notificación como Entregada.', 'excepcion' => $e->getMessage()], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'La notificación ha sido marcada como Entregada.']);
    }

    /**
     * Display the specified item by filters.
     *
     * @param  int  $notificacion
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($notificacion)
    {
        $notifEntregadas = VTNotifEntregada::whereRaw($notificacion != 0 ? ('NOTIFICACION = '.$notificacion) : ('NOTIFICACION = NOTIFICACION'))
                                           ->orderBy('entregada', 'asc')
                                           ->get();

        return response()->json(['notifEntregadas' => $notifEntregadas]);
    }
}
