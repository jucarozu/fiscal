<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\Vehiculo;

class VehiculoController extends Controller
{
    /**
     * Display a listing of the persons.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $vehiculos = Vehiculo::all();
        return response()->json(['vehiculos' => $vehiculos]);
    }

    /**
     * Display the specified person.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $vehiculo = Vehiculo::find($id);
        return response()->json(['vehiculo' => $vehiculo]);
    }

    /**
     * Store a newly created person in storage.
     *
     * @param  \App\Http\Requests\VehiculoAddForm  $request
     * @return \Illuminate\Http\Response
     */
    public function store(VehiculoAddForm $request)
    {
        if ($request->ajax())
        {
            $vehiculo = new Vehiculo();
            
            if ($vehiculo->save())
            {
                return response()->json(['mensaje' => 'Vehículo registrado', 'vehiculo' => $vehiculo]);
            }
        }
    }

    /**
     * Update the specified person in storage.
     *
     * @param  \App\Http\Requests\VehiculoEditForm  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(VehiculoEditForm $request, $id)
    {
        if ($request->ajax())
        {
            $vehiculo = Vehiculo::find($id);
            
            if ($vehiculo->save())
            {
                return response()->json(['mensaje' => 'Vehículo actualizado', 'vehiculo' => $vehiculo]);
            }
        }
    }

    /**
     * Display the specified person by filters.
     *
     * @param  int  $tipo_doc
     * @param  int  $numero_doc
     * @param  int  $nombres
     * @param  int  $apellidos
     * @return \Illuminate\Http\Response
     */
    public function getByFilters($tipo_doc, $numero_doc, $nombres, $apellidos)
    {
        $vehiculos = VTVehiculo::whereRaw($tipo_doc != 0 ? ('TIPO_DOC = '.$tipo_doc) : ('TIPO_DOC = TIPO_DOC'))
                               ->whereRaw($numero_doc != "0" ? ('NUMERO_DOC = '.$numero_doc) : ('NUMERO_DOC = NUMERO_DOC'))
                               ->whereRaw($nombres != "0" ? ('LOWER(NOMBRES) LIKE \'%'.strtolower($nombres).'%\'') : ('NOMBRES = NOMBRES'))
                               ->whereRaw($apellidos != "0" ? ('LOWER(APELLIDOS) LIKE \'%'.strtolower($apellidos).'%\'') : ('APELLIDOS = APELLIDOS'))
                               ->orderBy('nombres')
                               ->orderBy('apellidos')
                               ->get();

        return response()->json(['vehiculos' => $vehiculos]);
    }
}
