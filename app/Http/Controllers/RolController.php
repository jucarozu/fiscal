<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Requests\RolAddForm;
use App\Http\Requests\RolEditForm;

use App\Models\Rol;
use App\Models\Permiso;
use App\Models\VTModuloOpcion;
use App\Models\VTRolOpcion;

class RolController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $i=0;

        foreach (Rol::orderBy('nombre')->get() as $rol)
        {
            $vtOpciones = VTModuloOpcion::select('modulo', 'modulo_nombre', 'opcion', 'opcion_nombre')
                                        ->orderBy('modulo_nombre')
                                        ->orderBy('opcion_nombre')
                                        ->get();

            if (!empty($vtOpciones))
            {
                $roles[$i]['rol'] = $rol->rol;
                $roles[$i]['nombre'] = $rol->nombre;
                $roles[$i]['descripcion'] = $rol->descripcion;
                $roles[$i]['tiene_rol'] = false;

                $j=0;

                foreach ($vtOpciones as $opcion)
                {
                    $roles[$i]['opciones'][$j]['modulo'] = $opcion->modulo;
                    $roles[$i]['opciones'][$j]['modulo_nombre'] = $opcion->modulo_nombre;
                    $roles[$i]['opciones'][$j]['opcion'] = $opcion->opcion;
                    $roles[$i]['opciones'][$j]['opcion_nombre'] = $opcion->opcion_nombre;

                    $vtRolOpcion = VTRolOpcion::where('rol', $rol->rol)
                                              ->where('opcion', $opcion->opcion)
                                              ->select('consulta', 'adiciona', 'edita', 'elimina', 'ejecuta')
                                              ->get()
                                              ->first();

                    if (!empty($vtRolOpcion))
                    {
                        $roles[$i]['opciones'][$j]['consulta'] = $vtRolOpcion->consulta == 1 ? true : false;
                        $roles[$i]['opciones'][$j]['adiciona'] = $vtRolOpcion->adiciona == 1 ? true : false;
                        $roles[$i]['opciones'][$j]['edita'] = $vtRolOpcion->edita == 1 ? true : false;
                        $roles[$i]['opciones'][$j]['elimina'] = $vtRolOpcion->elimina == 1 ? true : false;
                        $roles[$i]['opciones'][$j]['ejecuta'] = $vtRolOpcion->ejecuta == 1 ? true : false;
                    }
                    else
                    {
                        $roles[$i]['opciones'][$j]['consulta'] = false;
                        $roles[$i]['opciones'][$j]['adiciona'] = false;
                        $roles[$i]['opciones'][$j]['edita'] = false;
                        $roles[$i]['opciones'][$j]['elimina'] = false;
                        $roles[$i]['opciones'][$j]['ejecuta'] = false;
                    }

                    $j++;
                }

                $i++;
            }
        }

        return response()->json(['roles' => $roles]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rol = Rol::find($id);
        return response()->json(['rol' => $rol]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\RolAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RolAddForm $request)
    {
        if ($request->ajax())
        {
            $opciones = json_decode(stripslashes($request->input('opciones')));

            $rol = new Rol();
            $rol->nombre = $request->input('nombre');
            $rol->descripcion = $request->input('descripcion');
            
            if ($rol->save())
            {
                if (!empty($opciones))
                {
                    foreach ($opciones as $opcion)
                    {
                        $permiso = new Permiso();
                        
                        $permiso->rol = $rol->rol;
                        $permiso->opcion = $opcion->opcion;
                        $permiso->consulta = $opcion->consulta ? 1 : 0;
                        $permiso->adiciona = $opcion->adiciona ? 1 : 0;
                        $permiso->edita = $opcion->edita ? 1 : 0;
                        $permiso->elimina = $opcion->elimina ? 1 : 0;
                        $permiso->ejecuta = $opcion->ejecuta ? 1 : 0;
                        $permiso->usuario_asigna = $request->input('usuario_asigna');

                        $permiso->save();
                    }
                }

                return response()->json(['mensaje' => 'Rol registrado', 'rol' => $rol]);
            }
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\RolEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(RolEditForm $request, $id)
    {
        if ($request->ajax())
        {
            $opciones = json_decode(stripslashes($request->input('opciones')));
            
            $rol = Rol::find($id);
            $rol->descripcion = $request->input('descripcion');
            
            if ($rol->save())
            {
                if (!empty($opciones))
                {
                    foreach ($opciones as $opcion)
                    {
                        $permiso = Permiso::where('rol', $rol->rol)
                                          ->where('opcion', $opcion->opcion)
                                          ->first();

                        $permiso->consulta = $opcion->consulta ? 1 : 0;
                        $permiso->adiciona = $opcion->adiciona ? 1 : 0;
                        $permiso->edita = $opcion->edita ? 1 : 0;
                        $permiso->elimina = $opcion->elimina ? 1 : 0;
                        $permiso->ejecuta = $opcion->ejecuta ? 1 : 0;
                        $permiso->usuario_asigna = $request->input('usuario_asigna');

                        $permiso->save();
                    }
                }

                return response()->json(['mensaje' => 'Rol actualizado', 'rol' => $rol]);
            }
        }
    }
}
