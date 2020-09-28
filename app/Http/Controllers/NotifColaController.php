<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\NotifCola;

use DB;

class NotifColaController extends Controller
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
            // Decodificar el JSON a un array para obtener los datos de la notificación a poner en cola.
            $notif_cola = json_decode(stripslashes($request->input('notif_cola')));

            $notifColaArray = array(
                $notif_cola->medio,
                $notif_cola->tipo,
                $notif_cola->persona,
                $notif_cola->referencia,
                $notif_cola->estado,
                $notif_cola->usuario,
                $notif_cola->observaciones,
                $notif_cola->cola,
                $notif_cola->comparendo,
                $notif_cola->direccion,
                $notif_cola->divipo,
                $notif_cola->descripcion
            );

            // Ejecutar el procedimiento almacenado que realiza la generación de las notificaciones.
            DB::statement(
                'CALL SP_INSERT_NOTIF_COLA(?,?,?,?,?,?,?,?,?,?,?,?)', 
                $notifColaArray
            );
        }
        catch(\Exception $e)
        {
            return response()->json(['estado' => 'ERROR', 'mensaje' => 'Error al marcar la notificación En cola.'], 500);
        }

        return response()->json(['estado' => 'OK', 'mensaje' => 'La notificación ha sido marcada como En cola.']);
    }

    /**
     * Display the specified item by filters.
     *
     * @param  int  $notificacion
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($notificacion)
    {
        $notifColas = NotifCola::whereRaw($notificacion != 0 ? ('NOTIFICACION = '.$notificacion) : ('NOTIFICACION = NOTIFICACION'))
                               ->orderBy('notif_cola', 'asc')
                               ->get();

        return response()->json(['notifColas' => $notifColas]);
    }
}