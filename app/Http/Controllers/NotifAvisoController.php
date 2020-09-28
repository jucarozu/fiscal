<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\NotifAviso;

use App\Services\GeneralService;

class NotifAvisoController extends Controller
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
            $notifAviso = new NotifAviso();
            $notifAviso->notificacion = $request->input('notificacion');
            $notifAviso->fecha_fija = $request->input('fecha_fija');
            $notifAviso->funcionario_fija = $request->input('funcionario_fija');
            $notifAviso->observaciones_fija = $request->input('observaciones_fija');
            $notifAviso->usuario_fija = $request->input('usuario_fija');
            $notifAviso->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al marcar la notificación como Fijada.', 'excepcion' => $e->getMessage()], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'La notificación ha sido marcada como Fijada.']);
    }

    /**
     * Update the specified item in storage.
     *
     * @param  \App\Http\Requests\PersonaEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try
        {
            $notifAviso = NotifAviso::find($id);
            $notifAviso->fecha_desfija = $request->input('fecha_desfija');
            $notifAviso->funcionario_desfija = $request->input('funcionario_desfija');
            $notifAviso->observaciones_desfija = $request->input('observaciones_desfija');
            $notifAviso->fecha_registra_desfija = GeneralService::getFechaActual('Y-m-d H:i:s');
            $notifAviso->usuario_desfija = $request->input('usuario_desfija');
            $notifAviso->save();
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al marcar la notificación como Desfijada.', 'excepcion' => $e->getMessage()], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'La notificación ha sido marcada como Desfijada.']);
    }

    public function getByNotificacion($notificacion)
    {
        $aviso = NotifAviso::where('notificacion', $notificacion)
                           ->get()
                           ->first();

        return response()->json(['aviso' => $aviso]);
    }
}

