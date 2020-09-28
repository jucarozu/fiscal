<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\Auditoria;

class AuditoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $registrosAuditoria = Auditoria::select("registro", "fecha", "usuario", "opcion", "accion", "peticion")
                                       ->orderBy("fecha")
                                       ->get();

        return response()->json(['registrosAuditoria' => $registrosAuditoria]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\UserForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->ajax())
        {
        	$datosAudit = $request->only('usuario', 'opcion', 'accion', 'peticion');

	    	try
	    	{
	    		$auditoria = new Auditoria();
	            $auditoria->usuario = $datosAudit['usuario'];
	            $auditoria->opcion = $datosAudit['opcion'];
	    		$auditoria->accion = $datosAudit['accion'];
	            $auditoria->peticion = $datosAudit['peticion'];
	            // $auditoria->host = $_SERVER['REMOTE_ADDR'];
	    		$auditoria->save();
	    	}
	    	catch (Exception $e)
	    	{
	    		return response()->json(['error' => 'audit_failed'], 500);
	    	}

            return response()->json(['message' => 'Auditoría registrada']);
        }
    }
}
