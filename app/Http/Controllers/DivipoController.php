<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

use App\Models\Divipo;

class DivipoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $divipos = Divipo::orderBy("departamento")
                         ->orderBy("municipio")
                         ->orderBy("poblado")
                         ->get();

        return response()->json(['divipos' => $divipos]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Devuelve la lista de departamentos.
     *
     * @return \Illuminate\Http\Response
     */
    public function getDepartamentos()
    {
        $departamentos = Divipo::select('cod_departamento', 'departamento')
                               ->groupBy('cod_departamento')
                               ->groupBy('departamento')
                               ->orderBy('departamento')
                               ->get();

        return response()->json(['departamentos' => $departamentos]);
    }

    /**
     * Devuelve la lista de municipios de un departamento.
     *
     * @param  int  $cod_departamento
     * @return \Illuminate\Http\Response
     */
    public function getMunicipios($cod_departamento)
    {
        $municipios = Divipo::select('cod_municipio', 'municipio')
                            ->where('cod_departamento', $cod_departamento)
                            ->groupBy('cod_municipio')
                            ->groupBy('municipio')
                            ->orderBy('cod_municipio')
                            ->get();

        return response()->json(['municipios' => $municipios]);
    }

    /**
     * Devuelve la lista de poblados de un municipio.
     *
     * @param  int  $cod_municipio
     * @return \Illuminate\Http\Response
     */
    public function getPoblados($cod_municipio)
    {
        $poblados = Divipo::select('cod_poblado', 'poblado')
                          ->where('cod_municipio', $cod_municipio)
                          ->orderBy('cod_poblado')
                          ->get();

        return response()->json(['poblados' => $poblados]);
    }
}
